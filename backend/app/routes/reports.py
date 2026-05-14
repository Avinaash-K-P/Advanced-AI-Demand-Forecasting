from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.forecast import ForecastResult
from app.core.security import verify_token
from app.utils.response import success_response
import pandas as pd
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)
from reportlab.lib.styles import (
    getSampleStyleSheet
)    

router = APIRouter(prefix="/reports", tags=["reports"])

@router.get("/export-excel")
def export_excel(
    db: Session = Depends(get_db),
    user = Depends(verify_token)
):

    forecasts = db.query(
        ForecastResult
    ).all()

    data = []

    for row in forecasts:

        data.append({
            "Forecast Date": row.forecast_date,
            "Predicted Demand": row.predicted_demand
        })

    df = pd.DataFrame(data)

    file_path = "reports/forecast_report.xlsx"

    df.to_excel(
        file_path,
        index=False
    )

    data =  FileResponse(
        path=file_path,
        filename="forecast_report.xlsx",
        media_type=(
            "application/vnd.openxmlformats-"
            "officedocument.spreadsheetml.sheet"
        ))
    
    return success_response(
        message = "Forecast report exported successfully!",
        data = data
    )

@router.get("/export-pdf")
def export_pdf(
    db: Session = Depends(get_db),
    user = Depends(verify_token)
):

    forecasts = db.query(
        ForecastResult
    ).all()

    file_path = "reports/forecast_report.pdf"

    doc = SimpleDocTemplate(
        file_path
    )

    styles = getSampleStyleSheet()

    elements = []

    title = Paragraph(
        "AI Demand Forecast Report",
        styles["Title"]
    )

    elements.append(title)

    elements.append(
        Spacer(1, 20)
    )

    for row in forecasts:

        text = (
            f"Date: {row.forecast_date}"
            f" | Predicted Demand:"
            f" {row.predicted_demand}"
        )

        paragraph = Paragraph(
            text,
            styles["BodyText"]
        )

        elements.append(paragraph)

        elements.append(
            Spacer(1, 10)
        )

    doc.build(elements)

    data = FileResponse(
        path=file_path,
        filename="forecast_report.pdf",
        media_type="application/pdf"
    )

    return success_response(
        message = "Forecast report exported successfully!",
        data = data
    )