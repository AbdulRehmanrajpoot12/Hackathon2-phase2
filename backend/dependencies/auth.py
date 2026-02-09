from fastapi import Header, HTTPException, status
import jwt
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("BETTER_AUTH_SECRET")
ALGORITHM = "HS256"

async def get_current_user(authorization: str = Header(None)) -> str:
    """
    Extract and verify JWT token, return user_id

    Args:
        authorization: Authorization header with Bearer token

    Returns:
        user_id: Authenticated user ID

    Raises:
        HTTPException(401): Invalid or missing token
    """
    import logging
    logger = logging.getLogger(__name__)

    logger.info(f"Auth header received: {authorization[:50] if authorization else 'None'}...")

    if not authorization or not authorization.startswith("Bearer "):
        logger.warning("Missing or invalid authorization header")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authorization header"
        )

    token = authorization.replace("Bearer ", "")
    logger.info(f"Token extracted: {token[:20]}...")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub") or payload.get("user_id")

        logger.info(f"Token decoded successfully. User ID: {user_id}")

        if not user_id:
            logger.error("Token payload missing user_id")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )

        return user_id

    except jwt.ExpiredSignatureError:
        logger.error("Token expired")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired"
        )
    except jwt.InvalidTokenError as e:
        logger.error(f"Invalid token: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

def verify_user_access(path_user_id: str, token_user_id: str):
    """
    Verify that path user_id matches authenticated user_id

    Args:
        path_user_id: User ID from URL path parameter
        token_user_id: User ID from authenticated JWT token

    Raises:
        HTTPException(403): User ID mismatch
    """
    if path_user_id != token_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: user_id mismatch"
        )
