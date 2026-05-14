from sqlalchemy import Column, Integer, String, Float, Date
from app.db.session import Base

class Sales(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)

    product_name = Column(String(255))
    
    category = Column(String(255))

    sales_date = Column(Date)

    quantity_sold = Column(Integer)

    revenue = Column(Float)

