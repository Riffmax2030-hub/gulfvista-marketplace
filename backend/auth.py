"""
Authentication utilities for gulfvista.properties.
Handles JWT token generation, validation, and password hashing.
"""

from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
import config
from database import get_db
from models import User
from typing import Optional, NamedTuple


# Token data model
class TokenData(NamedTuple):
    user_id: int
    email: str


# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthenticationService:
    """Service for handling authentication operations."""

    @staticmethod
    def hash_password(password: str) -> str:
        """
        Hash a plain text password using bcrypt.

        Args:
            password: Plain text password

        Returns:
            Hashed password
        """
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """
        Verify a plain text password against a hashed password.

        Args:
            plain_password: Plain text password
            hashed_password: Hashed password from database

        Returns:
            True if password matches, False otherwise
        """
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def create_access_token(user_id: int, email: str, expires_delta: Optional[timedelta] = None) -> str:
        """
        Create a JWT access token.

        Args:
            user_id: User ID
            email: User email
            expires_delta: Custom expiration time

        Returns:
            Encoded JWT token
        """
        if expires_delta is None:
            expires_delta = timedelta(minutes=config.ACCESS_TOKEN_EXPIRE_MINUTES)

        expire = datetime.now(timezone.utc) + expires_delta
        to_encode = {
            "sub": str(user_id),
            "email": email,
            "exp": expire,
            "iat": datetime.now(timezone.utc),
            "type": "access",
        }

        encoded_jwt = jwt.encode(
            to_encode,
            config.SECRET_KEY,
            algorithm=config.ALGORITHM,
        )
        return encoded_jwt

    @staticmethod
    def create_refresh_token(user_id: int, email: str) -> str:
        """
        Create a JWT refresh token.

        Args:
            user_id: User ID
            email: User email

        Returns:
            Encoded JWT refresh token
        """
        expire = datetime.now(timezone.utc) + timedelta(days=config.REFRESH_TOKEN_EXPIRE_DAYS)
        to_encode = {
            "sub": str(user_id),
            "email": email,
            "exp": expire,
            "iat": datetime.now(timezone.utc),
            "type": "refresh",
        }

        encoded_jwt = jwt.encode(
            to_encode,
            config.SECRET_KEY,
            algorithm=config.ALGORITHM,
        )
        return encoded_jwt

    @staticmethod
    def decode_token(token: str) -> Optional[TokenData]:
        """
        Decode and validate a JWT token.

        Args:
            token: JWT token string

        Returns:
            TokenData if valid, None otherwise
        """
        try:
            payload = jwt.decode(
                token,
                config.SECRET_KEY,
                algorithms=[config.ALGORITHM],
            )
            user_id: str = payload.get("sub")
            email: str = payload.get("email")

            if user_id is None or email is None:
                return None

            return TokenData(user_id=int(user_id), email=email)
        except JWTError:
            return None


async def get_current_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db),
) -> User:
    """
    Dependency to get the current authenticated user from JWT token.

    Args:
        authorization: Authorization header with Bearer token
        db: Database session

    Returns:
        Current user object

    Raises:
        HTTPException: If token is invalid or user not found
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = authorization.split(" ")[1]
    token_data = AuthenticationService.decode_token(token)

    if token_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.query(User).filter(User.id == token_data.user_id).first()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive",
        )

    return user


async def get_current_agent_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Dependency to ensure current user is an agent with admin access (verified payment).

    Args:
        current_user: Current authenticated user

    Returns:
        Current user if they are an agent_admin

    Raises:
        HTTPException: If user is not an agent_admin
    """
    if not current_user.is_agent_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This action requires an active agent subscription. Please complete the $200 USD registration fee.",
        )

    return current_user


async def get_current_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Dependency to ensure current user is a superuser/admin.

    Args:
        current_user: Current authenticated user

    Returns:
        Current user if they are a superuser

    Raises:
        HTTPException: If user is not a superuser
    """
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This action requires admin privileges",
        )

    return current_user
