from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import pandas as pd
from app.db.database import get_db
from app.models.sales import Sales
from app.models.forecast import ForecastResult
from app.core.security import verify_token
from app.utils.response import success_response
from app.services.forecast_service import ( 
    preprocess_sales_data,
    train_forecast_model
)    

router = APIRouter(prefix="/forecast", tags=["forecast"])

# Preprocess Sales Data
@router.get("/preprocess-data")
def preprocess_data(
    db: Session = Depends(get_db),
    user = Depends(verify_token)
):

    sales_data = db.query(Sales).all()

    data = []

    for row in sales_data:

        data.append({
            "sales_date": row.sales_date,
            "quantity_sold": row.quantity_sold
        })

    df = pd.DataFrame(data)

    processed_df = preprocess_sales_data(df)

    data = processed_df.to_dict(orient="records")
    return success_response(
        message = "Data preprocessed successfully!",
        data = data
    )

#Generate Forecast
@router.get("/generate-forecast")
def generate_forecast(
    db: Session = Depends(get_db),
    user = Depends(verify_token)
):
    sales_data = db.query(Sales).all()

    data = []

    for row in sales_data:

        data.append({
            "sales_date": row.sales_date,
            "quantity_sold": row.quantity_sold
        })

    df = pd.DataFrame(data)

    # Preprocess dataset
    processed_df = preprocess_sales_data(df)

    # Train forecasting model
    forecast_df = train_forecast_model(
        processed_df
    )

     # Store forecast results
    forecast_records = []

    for _, row in forecast_df.iterrows():

        forecast = ForecastResult(
            product_name="All Products",

            forecast_date=row["ds"],

            predicted_demand=float(
                row["predicted_demand"]
            )
        )

        forecast_records.append(forecast)

    db.add_all(forecast_records)

    db.commit()

    data = forecast_df.to_dict(orient="records")
    return success_response(
        message = "Forecast generated successfully!",
        data = data
    )


