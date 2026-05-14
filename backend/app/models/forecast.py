from sqlalchemy import Column, Integer, String, Float, Date
from app.db.session import Base

class ForecastResult(Base):

    __tablename__ = "forecast_results"

    id = Column(Integer, primary_key=True, index=True)

    product_name = Column(String(255))

    forecast_date = Column(Date)

    predicted_demand = Column(Float)