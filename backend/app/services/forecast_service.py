import pandas as pd
from prophet import Prophet

def preprocess_sales_data(df: pd.DataFrame):

    # Convert sales_date to datetime
    df["sales_date"] = pd.to_datetime(
        df["sales_date"]
    )

    # Group by date and sum quantity
    grouped_df = df.groupby(
        "sales_date"
    )["quantity_sold"].sum().reset_index()

    # Rename columns for Prophet
    grouped_df.columns = ["ds", "y"]

    # Sort by date
    grouped_df = grouped_df.sort_values("ds")

    return grouped_df

def train_forecast_model(df: pd.DataFrame):

    # Create Prophet model
    model = Prophet()

    # Train model
    model.fit(df)

    # Generate future dates
    future = model.make_future_dataframe(
        periods=10
    )

    # Predict future demand
    forecast = model.predict(future)

    # Select important columns
    result = forecast[[
        "ds",
        "yhat"
    ]].tail(30)

    # Rename prediction column
    result = result.rename(
        columns={
            "yhat": "predicted_demand"
        }
    )

    return result