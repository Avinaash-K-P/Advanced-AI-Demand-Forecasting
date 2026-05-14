from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session  
from app.db.database import get_db
from app.models.user import User
from app.schemas.auth import UserCreate, UserLogin
from app.utils.response import success_response
from app.core.security import(
    hash_password, 
    verify_password, 
    create_access_token,
)  


router = APIRouter(prefix="/auth", tags=["auth"])

# User Register
@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = User(
        username=user.username,
        email=user.email,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return success_response(
        message = "User registered successfully!"
    )

# User Login
@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        user.password,
        existing_user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        data={"sub": existing_user.email}
    )

    return success_response(
    message="User Login successful!",
    data = {
        "username": existing_user.username,
        "access_token": access_token,
        "token_type": "bearer"
    }
    )