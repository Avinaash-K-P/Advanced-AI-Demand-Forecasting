from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.database import get_db
from app.utils.response import success_response
from app.models.sales import Sales
from app.models.forecast import ForecastResult
from sklearn.metrics import mean_absolute_error
from app.core.security import verify_token

router = APIRouter(prefix="/analytics", tags=["analytics"])

# Total Sales and Quantity
@router.get("/total-sales")
def get_total_sales(
    db: Session = Depends(get_db),
    user = Depends(verify_token)
):

    total_sales = db.query(func.sum(Sales.revenue)).scalar()

    total_quantity = db.query(func.sum(Sales.quantity_sold)).scalar()

    
    return success_response(
    message = "Total sales and quantity retrieved successfully!",
    data =  {
            "total_revenue": total_sales or 0,
            "total_quantity_sold": total_quantity or 0
        }
    )    

# Monthly Sales Trend
@router.get("/monthly-sales")
def get_monthly_sales(
    db: Session = Depends(get_db),
    user = Depends(verify_token)
):

    results = db.query(func.date_format(Sales.sales_date,"%Y-%m").label("month"),

        func.sum(Sales.revenue).label(
            "total_revenue")

    ).group_by("month").all()

    data = []

    for row in results:

        data.append({
            "month": row.month,
            "total_revenue": float(
                row.total_revenue
            )
        })

    return success_response(
        message = "Monthly sales trend retrieved successfully!",
        data = data
    )

# Forecast Results
@router.get("/forecast-results")
def get_forecast_results(
    db: Session = Depends(get_db),
    user = Depends(verify_token)
):

    forecasts = db.query(
        ForecastResult
    ).all()

    data = []

    for row in forecasts:

        data.append({
            "forecast_date": row.forecast_date,
            "predicted_demand": row.predicted_demand
        })

    return success_response(
        message = "Forecast results retrieved successfully!",
        data = data
    )

# Forecast Accuracy
@router.get("/forecast-accuracy")
def get_forecast_accuracy(
    db: Session = Depends(get_db),
    user = Depends(verify_token)
):

    sales_data = db.query(Sales).all()

    forecast_data = db.query(
        ForecastResult
    ).all()

    # Convert actual sales
    actual_dict = {}

    for row in sales_data:

        date_key = str(row.sales_date)

        if date_key not in actual_dict:
            actual_dict[date_key] = 0

        actual_dict[date_key] += row.quantity_sold

    # Convert forecast data
    predicted_dict = {}

    for row in forecast_data:

        date_key = str(row.forecast_date)

        predicted_dict[date_key] = (
            row.predicted_demand
        )

    # Find common dates
    common_dates = set(
        actual_dict.keys()
    ).intersection(
        predicted_dict.keys()
    )

    if not common_dates:

        return success_response(
            message = "No matching dates found for accuracy calculation",
            data = {}
        )

    actual_values = []
    predicted_values = []

    for date in common_dates:

        actual_values.append(
            actual_dict[date]
        )

        predicted_values.append(
            predicted_dict[date]
        )

    # Calculate MAE
    mae = mean_absolute_error(
        actual_values,
        predicted_values
    )

    # Simple interpretation
    if mae < 5:
        performance = "Excellent"

    elif mae < 15:
        performance = "Good"

    else:
        performance = "Needs Improvement"

    return success_response(
        message = "Forecast accuracy calculated successfully!",
        data =  {
            "mae": round(mae, 2),
            "model_performance": performance,
            "compared_dates": len(common_dates)
        }
    )

# Top Selling Products
@router.get("/top-products")
def get_top_products(
    db: Session = Depends(get_db),
    user = Depends(verify_token)
):

    results = db.query(
        Sales.product_name,
        func.sum(Sales.quantity_sold).label("total_quantity")
    ).group_by(Sales.product_name).order_by(func.sum(Sales.quantity_sold).desc()).limit(5).all()

    data = []

    for row in results:
        data.append({
            "product_name": row.product_name,
            "total_quantity_sold": int(row.total_quantity),
        })

    return success_response(
        message = "Top selling products retrieved successfully!",
        data = data
    )