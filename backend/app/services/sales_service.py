import pandas as pd

REQUIRED_COLUMNS = [
    "product_name",
    "category",
    "sales_date",
    "quantity_sold",
    "revenue"
]

def validate_dataset(df: pd.DataFrame):

    # Check empty dataset
    if df.empty:
        return "Dataset is empty"

    # Normalize column names
    df.columns = df.columns.str.strip().str.lower()

    # Check required columns
    missing_columns = [
        col for col in REQUIRED_COLUMNS
        if col not in df.columns
    ]

    if missing_columns:
        return f"Missing columns: {missing_columns}"

    # Validate date column
    try:
        df["sales_date"] = pd.to_datetime(
            df["sales_date"]
        )
    except:
        return "Invalid sales_date format"

    # Validate numeric columns
    numeric_columns = ["quantity_sold", "revenue"]

    for col in numeric_columns:

        if not pd.api.types.is_numeric_dtype(df[col]):
            return f"{col} must be numeric"

    return None

def clean_dataset(df: pd.DataFrame):

    original_rows = len(df)

    # Remove duplicates
    duplicate_count = df.duplicated().sum()

    df = df.drop_duplicates()

    # Handle missing values

    missing_values_before = df.isnull().sum().to_dict()

    # Drop rows with critical missing values
    df = df.dropna(
        subset=[
            "product_name",
            "sales_date",
            "quantity_sold",
            "revenue"
        ]
    )

    # Fill category missing values
    df["category"] = df["category"].fillna(
        "Unknown"
    )

    missing_values_after = df.isnull().sum().to_dict()

    cleaned_rows = len(df)

    cleaning_report = {
        "original_rows": original_rows,
        "cleaned_rows": cleaned_rows,
        "duplicates_removed": int(duplicate_count),
        "missing_values_before": missing_values_before,
        "missing_values_after": missing_values_after
    }

    return df, cleaning_report