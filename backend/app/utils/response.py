def success_response(message: str, data: dict = None):
    return {
        "status": "success",
        "message": message,
        "data": data
    }

def error_response(message: str, details: str = None):
    return {
        "status": "error",
        "message": message,
        "details": details
    }

