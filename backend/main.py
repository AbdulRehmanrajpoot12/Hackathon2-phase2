from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
from db import create_db_and_tables
from dependencies.auth import get_current_user
from routes.tasks import router as tasks_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(title="Todo API", version="1.0.0")

@app.on_event("startup")
def on_startup():
    """Initialize database tables on startup"""
    logger.info("Starting Todo API...")
    try:
        create_db_and_tables()
        logger.info("Database tables initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
        raise

@app.on_event("shutdown")
def on_shutdown():
    """Cleanup on shutdown"""
    logger.info("Shutting down Todo API...")

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle unexpected exceptions"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(tasks_router)

@app.get("/")
def root():
    """Root endpoint returning API information"""
    return {"message": "Todo API", "version": "1.0.0"}

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

@app.get("/test-auth")
async def test_auth(current_user: str = Depends(get_current_user)):
    """Test endpoint to verify JWT authentication"""
    return {"user_id": current_user, "message": "Authentication successful"}
