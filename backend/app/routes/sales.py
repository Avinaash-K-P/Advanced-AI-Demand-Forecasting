from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
import pandas as pd
from app.utils.response import success_response
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.sales import Sales
from app.core.security import verify_token
from app.services.sales_service import (
    validate_dataset, 
    clean_dataset
)

router = APIRouter(prefix="/sales", tags=["sales"])

# Upload Sales Dataset
@router.post("/upload-dataset")
async def upload_dataset(file: UploadFile = File(...), db: Session = Depends(get_db), user = Depends(verify_token)):

    filename = file.filename.lower()

    try:

        # CSV Upload
        if filename.endswith(".csv"):

            df = pd.read_csv(file.file)

        # Excel Upload
        elif filename.endswith(".xlsx"):

            df = pd.read_excel(file.file)

        else:
            raise HTTPException(
                status_code=400,
                detail="Only CSV and Excel files are allowed"
            )
        
        # Validate dataset
        validation_error = validate_dataset(df)

        if validation_error:

            raise HTTPException(
                status_code=400,
                detail=validation_error
            )
        
        # Clean dataset
        df, cleaning_report = clean_dataset(df)

        sales_records = []

        for _, row in df.iterrows():

            sales = Sales(
                product_name=row["product_name"],
                category=row["category"],
                sales_date=row["sales_date"],
                quantity_sold=int(row["quantity_sold"]),
                revenue=float(row["revenue"])
                )
            sales_records.append(sales)

        db.add_all(sales_records)
        db.commit() 

        return success_response(
            message = "File uploaded successfully",
            data = {
                "columns": list(df.columns),
                "rows_after_cleaning": len(df),
                "cleaning_report": cleaning_report
            }
        )


    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )