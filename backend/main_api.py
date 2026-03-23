import uvicorn
import os, json
import time as time_module
import logging
from fastapi import Depends, FastAPI, HTTPException, Request, status, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from pydantic_classes import *
from sql_alchemy import *

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

############################################
#
#   Initialize the database
#
############################################

def init_db():
    SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./data/Class_Diagram.db")
    # Ensure local SQLite directory exists (safe no-op for other DBs)
    os.makedirs("data", exist_ok=True)
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        connect_args={"check_same_thread": False},
        pool_size=10,
        max_overflow=20,
        pool_pre_ping=True,
        echo=False
    )
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    return SessionLocal

app = FastAPI(
    title="Class_Diagram API",
    description="Auto-generated REST API with full CRUD operations, relationship management, and advanced features",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_tags=[
        {"name": "System", "description": "System health and statistics"},
        {"name": "Racun", "description": "Operations for Racun entities"},
        {"name": "Racun Relationships", "description": "Manage Racun relationships"},
        {"name": "Vodic", "description": "Operations for Vodic entities"},
        {"name": "Vodic Relationships", "description": "Manage Vodic relationships"},
        {"name": "Rezervacija", "description": "Operations for Rezervacija entities"},
        {"name": "Rezervacija Relationships", "description": "Manage Rezervacija relationships"},
        {"name": "Aranzman", "description": "Operations for Aranzman entities"},
        {"name": "Aranzman Relationships", "description": "Manage Aranzman relationships"},
        {"name": "Hotel", "description": "Operations for Hotel entities"},
        {"name": "Hotel Relationships", "description": "Manage Hotel relationships"},
        {"name": "Destinacija", "description": "Operations for Destinacija entities"},
        {"name": "Destinacija Relationships", "description": "Manage Destinacija relationships"},
        {"name": "Klijent", "description": "Operations for Klijent entities"},
        {"name": "Klijent Relationships", "description": "Manage Klijent relationships"},
    ]
)

# Enable CORS for all origins (for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or restrict to ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

############################################
#
#   Middleware
#
############################################

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all incoming requests and responses."""
    logger.info(f"Incoming request: {request.method} {request.url.path}")
    response = await call_next(request)
    logger.info(f"Response status: {response.status_code}")
    return response

# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    """Add processing time header to all responses."""
    start_time = time_module.time()
    response = await call_next(request)
    process_time = time_module.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

############################################
#
#   Exception Handlers
#
############################################

# Global exception handlers
@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    """Handle ValueError exceptions."""
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "error": "Bad Request",
            "message": str(exc),
            "detail": "Invalid input data provided"
        }
    )


@app.exception_handler(IntegrityError)
async def integrity_error_handler(request: Request, exc: IntegrityError):
    """Handle database integrity errors."""
    logger.error(f"Database integrity error: {exc}")

    # Extract more detailed error information
    error_detail = str(exc.orig) if hasattr(exc, 'orig') else str(exc)

    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT,
        content={
            "error": "Conflict",
            "message": "Data conflict occurred",
            "detail": error_detail
        }
    )


@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_error_handler(request: Request, exc: SQLAlchemyError):
    """Handle general SQLAlchemy errors."""
    logger.error(f"Database error: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal Server Error",
            "message": "Database operation failed",
            "detail": "An internal database error occurred"
        }
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions with consistent format."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail if isinstance(exc.detail, str) else "HTTP Error",
            "message": exc.detail,
            "detail": f"HTTP {exc.status_code} error occurred"
        }
    )

# Initialize database session
SessionLocal = init_db()
# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    except Exception:
        db.rollback()
        logger.error("Database session rollback due to exception")
        raise
    finally:
        db.close()

############################################
#
#   Global API endpoints
#
############################################

@app.get("/", tags=["System"])
def root():
    """Root endpoint - API information"""
    return {
        "name": "Class_Diagram API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health", tags=["System"])
def health_check():
    """Health check endpoint for monitoring"""
    from datetime import datetime
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "database": "connected"
    }


@app.get("/statistics", tags=["System"])
def get_statistics(database: Session = Depends(get_db)):
    """Get database statistics for all entities"""
    stats = {}
    stats["racun_count"] = database.query(Racun).count()
    stats["vodic_count"] = database.query(Vodic).count()
    stats["rezervacija_count"] = database.query(Rezervacija).count()
    stats["aranzman_count"] = database.query(Aranzman).count()
    stats["hotel_count"] = database.query(Hotel).count()
    stats["destinacija_count"] = database.query(Destinacija).count()
    stats["klijent_count"] = database.query(Klijent).count()
    stats["total_entities"] = sum(stats.values())
    return stats


############################################
#
#   BESSER Action Language standard lib
#
############################################


async def BAL_size(sequence:list) -> int:
    return len(sequence)

async def BAL_is_empty(sequence:list) -> bool:
    return len(sequence) == 0

async def BAL_add(sequence:list, elem) -> None:
    sequence.append(elem)

async def BAL_remove(sequence:list, elem) -> None:
    sequence.remove(elem)

async def BAL_contains(sequence:list, elem) -> bool:
    return elem in sequence

async def BAL_filter(sequence:list, predicate) -> list:
    return [elem for elem in sequence if predicate(elem)]

async def BAL_forall(sequence:list, predicate) -> bool:
    for elem in sequence:
        if not predicate(elem):
            return False
    return True

async def BAL_exists(sequence:list, predicate) -> bool:
    for elem in sequence:
        if predicate(elem):
            return True
    return False

async def BAL_one(sequence:list, predicate) -> bool:
    found = False
    for elem in sequence:
        if predicate(elem):
            if found:
                return False
            found = True
    return found

async def BAL_is_unique(sequence:list, mapping) -> bool:
    mapped = [mapping(elem) for elem in sequence]
    return len(set(mapped)) == len(mapped)

async def BAL_map(sequence:list, mapping) -> list:
    return [mapping(elem) for elem in sequence]

async def BAL_reduce(sequence:list, reduce_fn, aggregator) -> any:
    for elem in sequence:
        aggregator = reduce_fn(aggregator, elem)
    return aggregator


############################################
#
#   Racun functions
#
############################################

@app.get("/racun/", response_model=None, tags=["Racun"])
def get_all_racun(detailed: bool = False, database: Session = Depends(get_db)) -> list:
    from sqlalchemy.orm import joinedload

    # Use detailed=true to get entities with eagerly loaded relationships (for tables with lookup columns)
    if detailed:
        # Eagerly load all relationships to avoid N+1 queries
        query = database.query(Racun)
        query = query.options(joinedload(Racun.klijent_1))
        query = query.options(joinedload(Racun.aranzman_4))
        racun_list = query.all()

        # Serialize with relationships included
        result = []
        for racun_item in racun_list:
            item_dict = racun_item.__dict__.copy()
            item_dict.pop('_sa_instance_state', None)

            # Add many-to-one relationships (foreign keys for lookup columns)
            if racun_item.klijent_1:
                related_obj = racun_item.klijent_1
                related_dict = related_obj.__dict__.copy()
                related_dict.pop('_sa_instance_state', None)
                item_dict['klijent_1'] = related_dict
            else:
                item_dict['klijent_1'] = None
            if racun_item.aranzman_4:
                related_obj = racun_item.aranzman_4
                related_dict = related_obj.__dict__.copy()
                related_dict.pop('_sa_instance_state', None)
                item_dict['aranzman_4'] = related_dict
            else:
                item_dict['aranzman_4'] = None


            result.append(item_dict)
        return result
    else:
        # Default: return flat entities (faster for charts/widgets without lookup columns)
        return database.query(Racun).all()


@app.get("/racun/count/", response_model=None, tags=["Racun"])
def get_count_racun(database: Session = Depends(get_db)) -> dict:
    """Get the total count of Racun entities"""
    count = database.query(Racun).count()
    return {"count": count}


@app.get("/racun/paginated/", response_model=None, tags=["Racun"])
def get_paginated_racun(skip: int = 0, limit: int = 100, detailed: bool = False, database: Session = Depends(get_db)) -> dict:
    """Get paginated list of Racun entities"""
    total = database.query(Racun).count()
    racun_list = database.query(Racun).offset(skip).limit(limit).all()
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": racun_list
    }


@app.get("/racun/search/", response_model=None, tags=["Racun"])
def search_racun(
    database: Session = Depends(get_db)
) -> list:
    """Search Racun entities by attributes"""
    query = database.query(Racun)


    results = query.all()
    return results


@app.get("/racun/{racun_id}/", response_model=None, tags=["Racun"])
async def get_racun(racun_id: int, database: Session = Depends(get_db)) -> Racun:
    db_racun = database.query(Racun).filter(Racun.id == racun_id).first()
    if db_racun is None:
        raise HTTPException(status_code=404, detail="Racun not found")

    response_data = {
        "racun": db_racun,
}
    return response_data



@app.post("/racun/", response_model=None, tags=["Racun"])
async def create_racun(racun_data: RacunCreate, database: Session = Depends(get_db)) -> Racun:

    if racun_data.klijent_1 is not None:
        db_klijent_1 = database.query(Klijent).filter(Klijent.id == racun_data.klijent_1).first()
        if not db_klijent_1:
            raise HTTPException(status_code=400, detail="Klijent not found")
    else:
        raise HTTPException(status_code=400, detail="Klijent ID is required")
    if racun_data.aranzman_4 is not None:
        db_aranzman_4 = database.query(Aranzman).filter(Aranzman.id == racun_data.aranzman_4).first()
        if not db_aranzman_4:
            raise HTTPException(status_code=400, detail="Aranzman not found")
    else:
        raise HTTPException(status_code=400, detail="Aranzman ID is required")

    db_racun = Racun(
        iznos=racun_data.iznos,        ukupno=racun_data.ukupno,        datumDospeca=racun_data.datumDospeca,        datumIzdavanja=racun_data.datumIzdavanja,        status=racun_data.status.value,        brojRacuna=racun_data.brojRacuna,        nacin_placanja=racun_data.nacin_placanja.value,        pdv=racun_data.pdv,        klijent_1_id=racun_data.klijent_1,        aranzman_4_id=racun_data.aranzman_4        )

    database.add(db_racun)
    database.commit()
    database.refresh(db_racun)




    return db_racun


@app.post("/racun/bulk/", response_model=None, tags=["Racun"])
async def bulk_create_racun(items: list[RacunCreate], database: Session = Depends(get_db)) -> dict:
    """Create multiple Racun entities at once"""
    created_items = []
    errors = []

    for idx, item_data in enumerate(items):
        try:
            # Basic validation for each item
            if not item_data.klijent_1:
                raise ValueError("Klijent ID is required")
            if not item_data.aranzman_4:
                raise ValueError("Aranzman ID is required")

            db_racun = Racun(
                iznos=item_data.iznos,                ukupno=item_data.ukupno,                datumDospeca=item_data.datumDospeca,                datumIzdavanja=item_data.datumIzdavanja,                status=item_data.status.value,                brojRacuna=item_data.brojRacuna,                nacin_placanja=item_data.nacin_placanja.value,                pdv=item_data.pdv,                klijent_1_id=item_data.klijent_1,                aranzman_4_id=item_data.aranzman_4            )
            database.add(db_racun)
            database.flush()  # Get ID without committing
            created_items.append(db_racun.id)
        except Exception as e:
            errors.append({"index": idx, "error": str(e)})

    if errors:
        database.rollback()
        raise HTTPException(status_code=400, detail={"message": "Bulk creation failed", "errors": errors})

    database.commit()
    return {
        "created_count": len(created_items),
        "created_ids": created_items,
        "message": f"Successfully created {len(created_items)} Racun entities"
    }


@app.delete("/racun/bulk/", response_model=None, tags=["Racun"])
async def bulk_delete_racun(ids: list[int], database: Session = Depends(get_db)) -> dict:
    """Delete multiple Racun entities at once"""
    deleted_count = 0
    not_found = []

    for item_id in ids:
        db_racun = database.query(Racun).filter(Racun.id == item_id).first()
        if db_racun:
            database.delete(db_racun)
            deleted_count += 1
        else:
            not_found.append(item_id)

    database.commit()

    return {
        "deleted_count": deleted_count,
        "not_found": not_found,
        "message": f"Successfully deleted {deleted_count} Racun entities"
    }

@app.put("/racun/{racun_id}/", response_model=None, tags=["Racun"])
async def update_racun(racun_id: int, racun_data: RacunCreate, database: Session = Depends(get_db)) -> Racun:
    db_racun = database.query(Racun).filter(Racun.id == racun_id).first()
    if db_racun is None:
        raise HTTPException(status_code=404, detail="Racun not found")

    setattr(db_racun, 'iznos', racun_data.iznos)
    setattr(db_racun, 'ukupno', racun_data.ukupno)
    setattr(db_racun, 'datumDospeca', racun_data.datumDospeca)
    setattr(db_racun, 'datumIzdavanja', racun_data.datumIzdavanja)
    setattr(db_racun, 'status', racun_data.status.value)
    setattr(db_racun, 'brojRacuna', racun_data.brojRacuna)
    setattr(db_racun, 'nacin_placanja', racun_data.nacin_placanja.value)
    setattr(db_racun, 'pdv', racun_data.pdv)
    if racun_data.klijent_1 is not None:
        db_klijent_1 = database.query(Klijent).filter(Klijent.id == racun_data.klijent_1).first()
        if not db_klijent_1:
            raise HTTPException(status_code=400, detail="Klijent not found")
        setattr(db_racun, 'klijent_1_id', racun_data.klijent_1)
    if racun_data.aranzman_4 is not None:
        db_aranzman_4 = database.query(Aranzman).filter(Aranzman.id == racun_data.aranzman_4).first()
        if not db_aranzman_4:
            raise HTTPException(status_code=400, detail="Aranzman not found")
        setattr(db_racun, 'aranzman_4_id', racun_data.aranzman_4)
    database.commit()
    database.refresh(db_racun)

    return db_racun


@app.delete("/racun/{racun_id}/", response_model=None, tags=["Racun"])
async def delete_racun(racun_id: int, database: Session = Depends(get_db)):
    db_racun = database.query(Racun).filter(Racun.id == racun_id).first()
    if db_racun is None:
        raise HTTPException(status_code=404, detail="Racun not found")
    database.delete(db_racun)
    database.commit()
    return db_racun





############################################
#
#   Vodic functions
#
############################################

@app.get("/vodic/", response_model=None, tags=["Vodic"])
def get_all_vodic(detailed: bool = False, database: Session = Depends(get_db)) -> list:
    from sqlalchemy.orm import joinedload

    return database.query(Vodic).all()


@app.get("/vodic/count/", response_model=None, tags=["Vodic"])
def get_count_vodic(database: Session = Depends(get_db)) -> dict:
    """Get the total count of Vodic entities"""
    count = database.query(Vodic).count()
    return {"count": count}


@app.get("/vodic/paginated/", response_model=None, tags=["Vodic"])
def get_paginated_vodic(skip: int = 0, limit: int = 100, detailed: bool = False, database: Session = Depends(get_db)) -> dict:
    """Get paginated list of Vodic entities"""
    total = database.query(Vodic).count()
    vodic_list = database.query(Vodic).offset(skip).limit(limit).all()
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": vodic_list
    }


@app.get("/vodic/search/", response_model=None, tags=["Vodic"])
def search_vodic(
    database: Session = Depends(get_db)
) -> list:
    """Search Vodic entities by attributes"""
    query = database.query(Vodic)


    results = query.all()
    return results


@app.get("/vodic/{vodic_id}/", response_model=None, tags=["Vodic"])
async def get_vodic(vodic_id: int, database: Session = Depends(get_db)) -> Vodic:
    db_vodic = database.query(Vodic).filter(Vodic.id == vodic_id).first()
    if db_vodic is None:
        raise HTTPException(status_code=404, detail="Vodic not found")

    response_data = {
        "vodic": db_vodic,
}
    return response_data



@app.post("/vodic/", response_model=None, tags=["Vodic"])
async def create_vodic(vodic_data: VodicCreate, database: Session = Depends(get_db)) -> Vodic:


    db_vodic = Vodic(
        ime=vodic_data.ime,        prezime=vodic_data.prezime,        jezici=vodic_data.jezici,        specijalizacija=vodic_data.specijalizacija        )

    database.add(db_vodic)
    database.commit()
    database.refresh(db_vodic)




    return db_vodic


@app.post("/vodic/bulk/", response_model=None, tags=["Vodic"])
async def bulk_create_vodic(items: list[VodicCreate], database: Session = Depends(get_db)) -> dict:
    """Create multiple Vodic entities at once"""
    created_items = []
    errors = []

    for idx, item_data in enumerate(items):
        try:
            # Basic validation for each item

            db_vodic = Vodic(
                ime=item_data.ime,                prezime=item_data.prezime,                jezici=item_data.jezici,                specijalizacija=item_data.specijalizacija            )
            database.add(db_vodic)
            database.flush()  # Get ID without committing
            created_items.append(db_vodic.id)
        except Exception as e:
            errors.append({"index": idx, "error": str(e)})

    if errors:
        database.rollback()
        raise HTTPException(status_code=400, detail={"message": "Bulk creation failed", "errors": errors})

    database.commit()
    return {
        "created_count": len(created_items),
        "created_ids": created_items,
        "message": f"Successfully created {len(created_items)} Vodic entities"
    }


@app.delete("/vodic/bulk/", response_model=None, tags=["Vodic"])
async def bulk_delete_vodic(ids: list[int], database: Session = Depends(get_db)) -> dict:
    """Delete multiple Vodic entities at once"""
    deleted_count = 0
    not_found = []

    for item_id in ids:
        db_vodic = database.query(Vodic).filter(Vodic.id == item_id).first()
        if db_vodic:
            database.delete(db_vodic)
            deleted_count += 1
        else:
            not_found.append(item_id)

    database.commit()

    return {
        "deleted_count": deleted_count,
        "not_found": not_found,
        "message": f"Successfully deleted {deleted_count} Vodic entities"
    }

@app.put("/vodic/{vodic_id}/", response_model=None, tags=["Vodic"])
async def update_vodic(vodic_id: int, vodic_data: VodicCreate, database: Session = Depends(get_db)) -> Vodic:
    db_vodic = database.query(Vodic).filter(Vodic.id == vodic_id).first()
    if db_vodic is None:
        raise HTTPException(status_code=404, detail="Vodic not found")

    setattr(db_vodic, 'ime', vodic_data.ime)
    setattr(db_vodic, 'prezime', vodic_data.prezime)
    setattr(db_vodic, 'jezici', vodic_data.jezici)
    setattr(db_vodic, 'specijalizacija', vodic_data.specijalizacija)
    database.commit()
    database.refresh(db_vodic)

    return db_vodic


@app.delete("/vodic/{vodic_id}/", response_model=None, tags=["Vodic"])
async def delete_vodic(vodic_id: int, database: Session = Depends(get_db)):
    db_vodic = database.query(Vodic).filter(Vodic.id == vodic_id).first()
    if db_vodic is None:
        raise HTTPException(status_code=404, detail="Vodic not found")
    database.delete(db_vodic)
    database.commit()
    return db_vodic





############################################
#
#   Rezervacija functions
#
############################################

@app.get("/rezervacija/", response_model=None, tags=["Rezervacija"])
def get_all_rezervacija(detailed: bool = False, database: Session = Depends(get_db)) -> list:
    from sqlalchemy.orm import joinedload

    # Use detailed=true to get entities with eagerly loaded relationships (for tables with lookup columns)
    if detailed:
        # Eagerly load all relationships to avoid N+1 queries
        query = database.query(Rezervacija)
        query = query.options(joinedload(Rezervacija.aranzman))
        query = query.options(joinedload(Rezervacija.klijent))
        rezervacija_list = query.all()

        # Serialize with relationships included
        result = []
        for rezervacija_item in rezervacija_list:
            item_dict = rezervacija_item.__dict__.copy()
            item_dict.pop('_sa_instance_state', None)

            # Add many-to-one relationships (foreign keys for lookup columns)
            if rezervacija_item.aranzman:
                related_obj = rezervacija_item.aranzman
                related_dict = related_obj.__dict__.copy()
                related_dict.pop('_sa_instance_state', None)
                item_dict['aranzman'] = related_dict
            else:
                item_dict['aranzman'] = None
            if rezervacija_item.klijent:
                related_obj = rezervacija_item.klijent
                related_dict = related_obj.__dict__.copy()
                related_dict.pop('_sa_instance_state', None)
                item_dict['klijent'] = related_dict
            else:
                item_dict['klijent'] = None


            result.append(item_dict)
        return result
    else:
        # Default: return flat entities (faster for charts/widgets without lookup columns)
        return database.query(Rezervacija).all()


@app.get("/rezervacija/count/", response_model=None, tags=["Rezervacija"])
def get_count_rezervacija(database: Session = Depends(get_db)) -> dict:
    """Get the total count of Rezervacija entities"""
    count = database.query(Rezervacija).count()
    return {"count": count}


@app.get("/rezervacija/paginated/", response_model=None, tags=["Rezervacija"])
def get_paginated_rezervacija(skip: int = 0, limit: int = 100, detailed: bool = False, database: Session = Depends(get_db)) -> dict:
    """Get paginated list of Rezervacija entities"""
    total = database.query(Rezervacija).count()
    rezervacija_list = database.query(Rezervacija).offset(skip).limit(limit).all()
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": rezervacija_list
    }


@app.get("/rezervacija/search/", response_model=None, tags=["Rezervacija"])
def search_rezervacija(
    database: Session = Depends(get_db)
) -> list:
    """Search Rezervacija entities by attributes"""
    query = database.query(Rezervacija)


    results = query.all()
    return results


@app.get("/rezervacija/{rezervacija_id}/", response_model=None, tags=["Rezervacija"])
async def get_rezervacija(rezervacija_id: int, database: Session = Depends(get_db)) -> Rezervacija:
    db_rezervacija = database.query(Rezervacija).filter(Rezervacija.id == rezervacija_id).first()
    if db_rezervacija is None:
        raise HTTPException(status_code=404, detail="Rezervacija not found")

    response_data = {
        "rezervacija": db_rezervacija,
}
    return response_data



@app.post("/rezervacija/", response_model=None, tags=["Rezervacija"])
async def create_rezervacija(rezervacija_data: RezervacijaCreate, database: Session = Depends(get_db)) -> Rezervacija:

    if rezervacija_data.aranzman is not None:
        db_aranzman = database.query(Aranzman).filter(Aranzman.id == rezervacija_data.aranzman).first()
        if not db_aranzman:
            raise HTTPException(status_code=400, detail="Aranzman not found")
    else:
        raise HTTPException(status_code=400, detail="Aranzman ID is required")
    if rezervacija_data.klijent is not None:
        db_klijent = database.query(Klijent).filter(Klijent.id == rezervacija_data.klijent).first()
        if not db_klijent:
            raise HTTPException(status_code=400, detail="Klijent not found")
    else:
        raise HTTPException(status_code=400, detail="Klijent ID is required")

    db_rezervacija = Rezervacija(
        status=rezervacija_data.status.value,        ukupnaCena=rezervacija_data.ukupnaCena,        datumRezervacije=rezervacija_data.datumRezervacije,        aranzman_id=rezervacija_data.aranzman,        klijent_id=rezervacija_data.klijent        )

    database.add(db_rezervacija)
    database.commit()
    database.refresh(db_rezervacija)




    return db_rezervacija


@app.post("/rezervacija/bulk/", response_model=None, tags=["Rezervacija"])
async def bulk_create_rezervacija(items: list[RezervacijaCreate], database: Session = Depends(get_db)) -> dict:
    """Create multiple Rezervacija entities at once"""
    created_items = []
    errors = []

    for idx, item_data in enumerate(items):
        try:
            # Basic validation for each item
            if not item_data.aranzman:
                raise ValueError("Aranzman ID is required")
            if not item_data.klijent:
                raise ValueError("Klijent ID is required")

            db_rezervacija = Rezervacija(
                status=item_data.status.value,                ukupnaCena=item_data.ukupnaCena,                datumRezervacije=item_data.datumRezervacije,                aranzman_id=item_data.aranzman,                klijent_id=item_data.klijent            )
            database.add(db_rezervacija)
            database.flush()  # Get ID without committing
            created_items.append(db_rezervacija.id)
        except Exception as e:
            errors.append({"index": idx, "error": str(e)})

    if errors:
        database.rollback()
        raise HTTPException(status_code=400, detail={"message": "Bulk creation failed", "errors": errors})

    database.commit()
    return {
        "created_count": len(created_items),
        "created_ids": created_items,
        "message": f"Successfully created {len(created_items)} Rezervacija entities"
    }


@app.delete("/rezervacija/bulk/", response_model=None, tags=["Rezervacija"])
async def bulk_delete_rezervacija(ids: list[int], database: Session = Depends(get_db)) -> dict:
    """Delete multiple Rezervacija entities at once"""
    deleted_count = 0
    not_found = []

    for item_id in ids:
        db_rezervacija = database.query(Rezervacija).filter(Rezervacija.id == item_id).first()
        if db_rezervacija:
            database.delete(db_rezervacija)
            deleted_count += 1
        else:
            not_found.append(item_id)

    database.commit()

    return {
        "deleted_count": deleted_count,
        "not_found": not_found,
        "message": f"Successfully deleted {deleted_count} Rezervacija entities"
    }

@app.put("/rezervacija/{rezervacija_id}/", response_model=None, tags=["Rezervacija"])
async def update_rezervacija(rezervacija_id: int, rezervacija_data: RezervacijaCreate, database: Session = Depends(get_db)) -> Rezervacija:
    db_rezervacija = database.query(Rezervacija).filter(Rezervacija.id == rezervacija_id).first()
    if db_rezervacija is None:
        raise HTTPException(status_code=404, detail="Rezervacija not found")

    setattr(db_rezervacija, 'status', rezervacija_data.status.value)
    setattr(db_rezervacija, 'ukupnaCena', rezervacija_data.ukupnaCena)
    setattr(db_rezervacija, 'datumRezervacije', rezervacija_data.datumRezervacije)
    if rezervacija_data.aranzman is not None:
        db_aranzman = database.query(Aranzman).filter(Aranzman.id == rezervacija_data.aranzman).first()
        if not db_aranzman:
            raise HTTPException(status_code=400, detail="Aranzman not found")
        setattr(db_rezervacija, 'aranzman_id', rezervacija_data.aranzman)
    if rezervacija_data.klijent is not None:
        db_klijent = database.query(Klijent).filter(Klijent.id == rezervacija_data.klijent).first()
        if not db_klijent:
            raise HTTPException(status_code=400, detail="Klijent not found")
        setattr(db_rezervacija, 'klijent_id', rezervacija_data.klijent)
    database.commit()
    database.refresh(db_rezervacija)

    return db_rezervacija


@app.delete("/rezervacija/{rezervacija_id}/", response_model=None, tags=["Rezervacija"])
async def delete_rezervacija(rezervacija_id: int, database: Session = Depends(get_db)):
    db_rezervacija = database.query(Rezervacija).filter(Rezervacija.id == rezervacija_id).first()
    if db_rezervacija is None:
        raise HTTPException(status_code=404, detail="Rezervacija not found")
    database.delete(db_rezervacija)
    database.commit()
    return db_rezervacija





############################################
#
#   Aranzman functions
#
############################################

@app.get("/aranzman/", response_model=None, tags=["Aranzman"])
def get_all_aranzman(detailed: bool = False, database: Session = Depends(get_db)) -> list:
    from sqlalchemy.orm import joinedload

    # Use detailed=true to get entities with eagerly loaded relationships (for tables with lookup columns)
    if detailed:
        # Eagerly load all relationships to avoid N+1 queries
        query = database.query(Aranzman)
        query = query.options(joinedload(Aranzman.vodic))
        query = query.options(joinedload(Aranzman.hotel))
        query = query.options(joinedload(Aranzman.destinacija))
        aranzman_list = query.all()

        # Serialize with relationships included
        result = []
        for aranzman_item in aranzman_list:
            item_dict = aranzman_item.__dict__.copy()
            item_dict.pop('_sa_instance_state', None)

            # Add many-to-one relationships (foreign keys for lookup columns)
            if aranzman_item.vodic:
                related_obj = aranzman_item.vodic
                related_dict = related_obj.__dict__.copy()
                related_dict.pop('_sa_instance_state', None)
                item_dict['vodic'] = related_dict
            else:
                item_dict['vodic'] = None
            if aranzman_item.hotel:
                related_obj = aranzman_item.hotel
                related_dict = related_obj.__dict__.copy()
                related_dict.pop('_sa_instance_state', None)
                item_dict['hotel'] = related_dict
            else:
                item_dict['hotel'] = None
            if aranzman_item.destinacija:
                related_obj = aranzman_item.destinacija
                related_dict = related_obj.__dict__.copy()
                related_dict.pop('_sa_instance_state', None)
                item_dict['destinacija'] = related_dict
            else:
                item_dict['destinacija'] = None

            # Add many-to-many and one-to-many relationship objects (full details)
            rezervacija_list = database.query(Rezervacija).filter(Rezervacija.aranzman_id == aranzman_item.id).all()
            item_dict['rezervacija_1'] = []
            for rezervacija_obj in rezervacija_list:
                rezervacija_dict = rezervacija_obj.__dict__.copy()
                rezervacija_dict.pop('_sa_instance_state', None)
                item_dict['rezervacija_1'].append(rezervacija_dict)

            result.append(item_dict)
        return result
    else:
        # Default: return flat entities (faster for charts/widgets without lookup columns)
        return database.query(Aranzman).all()


@app.get("/aranzman/count/", response_model=None, tags=["Aranzman"])
def get_count_aranzman(database: Session = Depends(get_db)) -> dict:
    """Get the total count of Aranzman entities"""
    count = database.query(Aranzman).count()
    return {"count": count}


@app.get("/aranzman/paginated/", response_model=None, tags=["Aranzman"])
def get_paginated_aranzman(skip: int = 0, limit: int = 100, detailed: bool = False, database: Session = Depends(get_db)) -> dict:
    """Get paginated list of Aranzman entities"""
    total = database.query(Aranzman).count()
    aranzman_list = database.query(Aranzman).offset(skip).limit(limit).all()
    # By default, return flat entities (for charts/widgets)
    # Use detailed=true to get entities with relationships
    if not detailed:
        return {
            "total": total,
            "skip": skip,
            "limit": limit,
            "data": aranzman_list
        }

    result = []
    for aranzman_item in aranzman_list:
        rezervacija_1_ids = database.query(Rezervacija.id).filter(Rezervacija.aranzman_id == aranzman_item.id).all()
        item_data = {
            "aranzman": aranzman_item,
            "rezervacija_1_ids": [x[0] for x in rezervacija_1_ids]        }
        result.append(item_data)
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": result
    }


@app.get("/aranzman/search/", response_model=None, tags=["Aranzman"])
def search_aranzman(
    database: Session = Depends(get_db)
) -> list:
    """Search Aranzman entities by attributes"""
    query = database.query(Aranzman)


    results = query.all()
    return results


@app.get("/aranzman/{aranzman_id}/", response_model=None, tags=["Aranzman"])
async def get_aranzman(aranzman_id: int, database: Session = Depends(get_db)) -> Aranzman:
    db_aranzman = database.query(Aranzman).filter(Aranzman.id == aranzman_id).first()
    if db_aranzman is None:
        raise HTTPException(status_code=404, detail="Aranzman not found")

    rezervacija_1_ids = database.query(Rezervacija.id).filter(Rezervacija.aranzman_id == db_aranzman.id).all()
    response_data = {
        "aranzman": db_aranzman,
        "rezervacija_1_ids": [x[0] for x in rezervacija_1_ids]}
    return response_data



@app.post("/aranzman/", response_model=None, tags=["Aranzman"])
async def create_aranzman(aranzman_data: AranzmanCreate, database: Session = Depends(get_db)) -> Aranzman:

    if aranzman_data.vodic :
        db_vodic = database.query(Vodic).filter(Vodic.id == aranzman_data.vodic).first()
        if not db_vodic:
            raise HTTPException(status_code=400, detail="Vodic not found")
    if aranzman_data.hotel is not None:
        db_hotel = database.query(Hotel).filter(Hotel.id == aranzman_data.hotel).first()
        if not db_hotel:
            raise HTTPException(status_code=400, detail="Hotel not found")
    else:
        raise HTTPException(status_code=400, detail="Hotel ID is required")
    if aranzman_data.destinacija is not None:
        db_destinacija = database.query(Destinacija).filter(Destinacija.id == aranzman_data.destinacija).first()
        if not db_destinacija:
            raise HTTPException(status_code=400, detail="Destinacija not found")
    else:
        raise HTTPException(status_code=400, detail="Destinacija ID is required")

    db_aranzman = Aranzman(
        datumPolaska=aranzman_data.datumPolaska,        cena=aranzman_data.cena,        tip=aranzman_data.tip.value,        naziv=aranzman_data.naziv,        trajanje=aranzman_data.trajanje,        datumPovratka=aranzman_data.datumPovratka,        vodic_id=aranzman_data.vodic,        hotel_id=aranzman_data.hotel,        destinacija_id=aranzman_data.destinacija        )

    database.add(db_aranzman)
    database.commit()
    database.refresh(db_aranzman)

    if aranzman_data.rezervacija_1:
        # Validate that all Rezervacija IDs exist
        for rezervacija_id in aranzman_data.rezervacija_1:
            db_rezervacija = database.query(Rezervacija).filter(Rezervacija.id == rezervacija_id).first()
            if not db_rezervacija:
                raise HTTPException(status_code=400, detail=f"Rezervacija with id {rezervacija_id} not found")

        # Update the related entities with the new foreign key
        database.query(Rezervacija).filter(Rezervacija.id.in_(aranzman_data.rezervacija_1)).update(
            {Rezervacija.aranzman_id: db_aranzman.id}, synchronize_session=False
        )
        database.commit()



    rezervacija_1_ids = database.query(Rezervacija.id).filter(Rezervacija.aranzman_id == db_aranzman.id).all()
    response_data = {
        "aranzman": db_aranzman,
        "rezervacija_1_ids": [x[0] for x in rezervacija_1_ids]    }
    return response_data


@app.post("/aranzman/bulk/", response_model=None, tags=["Aranzman"])
async def bulk_create_aranzman(items: list[AranzmanCreate], database: Session = Depends(get_db)) -> dict:
    """Create multiple Aranzman entities at once"""
    created_items = []
    errors = []

    for idx, item_data in enumerate(items):
        try:
            # Basic validation for each item
            if not item_data.hotel:
                raise ValueError("Hotel ID is required")
            if not item_data.destinacija:
                raise ValueError("Destinacija ID is required")

            db_aranzman = Aranzman(
                datumPolaska=item_data.datumPolaska,                cena=item_data.cena,                tip=item_data.tip.value,                naziv=item_data.naziv,                trajanje=item_data.trajanje,                datumPovratka=item_data.datumPovratka,                vodic_id=item_data.vodic,                hotel_id=item_data.hotel,                destinacija_id=item_data.destinacija            )
            database.add(db_aranzman)
            database.flush()  # Get ID without committing
            created_items.append(db_aranzman.id)
        except Exception as e:
            errors.append({"index": idx, "error": str(e)})

    if errors:
        database.rollback()
        raise HTTPException(status_code=400, detail={"message": "Bulk creation failed", "errors": errors})

    database.commit()
    return {
        "created_count": len(created_items),
        "created_ids": created_items,
        "message": f"Successfully created {len(created_items)} Aranzman entities"
    }


@app.delete("/aranzman/bulk/", response_model=None, tags=["Aranzman"])
async def bulk_delete_aranzman(ids: list[int], database: Session = Depends(get_db)) -> dict:
    """Delete multiple Aranzman entities at once"""
    deleted_count = 0
    not_found = []

    for item_id in ids:
        db_aranzman = database.query(Aranzman).filter(Aranzman.id == item_id).first()
        if db_aranzman:
            database.delete(db_aranzman)
            deleted_count += 1
        else:
            not_found.append(item_id)

    database.commit()

    return {
        "deleted_count": deleted_count,
        "not_found": not_found,
        "message": f"Successfully deleted {deleted_count} Aranzman entities"
    }

@app.put("/aranzman/{aranzman_id}/", response_model=None, tags=["Aranzman"])
async def update_aranzman(aranzman_id: int, aranzman_data: AranzmanCreate, database: Session = Depends(get_db)) -> Aranzman:
    db_aranzman = database.query(Aranzman).filter(Aranzman.id == aranzman_id).first()
    if db_aranzman is None:
        raise HTTPException(status_code=404, detail="Aranzman not found")

    setattr(db_aranzman, 'datumPolaska', aranzman_data.datumPolaska)
    setattr(db_aranzman, 'cena', aranzman_data.cena)
    setattr(db_aranzman, 'tip', aranzman_data.tip.value)
    setattr(db_aranzman, 'naziv', aranzman_data.naziv)
    setattr(db_aranzman, 'trajanje', aranzman_data.trajanje)
    setattr(db_aranzman, 'datumPovratka', aranzman_data.datumPovratka)
    if aranzman_data.vodic is not None:
        db_vodic = database.query(Vodic).filter(Vodic.id == aranzman_data.vodic).first()
        if not db_vodic:
            raise HTTPException(status_code=400, detail="Vodic not found")
        setattr(db_aranzman, 'vodic_id', aranzman_data.vodic)
    else:
        setattr(db_aranzman, 'vodic_id', None)
    if aranzman_data.hotel is not None:
        db_hotel = database.query(Hotel).filter(Hotel.id == aranzman_data.hotel).first()
        if not db_hotel:
            raise HTTPException(status_code=400, detail="Hotel not found")
        setattr(db_aranzman, 'hotel_id', aranzman_data.hotel)
    if aranzman_data.destinacija is not None:
        db_destinacija = database.query(Destinacija).filter(Destinacija.id == aranzman_data.destinacija).first()
        if not db_destinacija:
            raise HTTPException(status_code=400, detail="Destinacija not found")
        setattr(db_aranzman, 'destinacija_id', aranzman_data.destinacija)
    if aranzman_data.rezervacija_1 is not None:
        # Clear all existing relationships (set foreign key to NULL)
        database.query(Rezervacija).filter(Rezervacija.aranzman_id == db_aranzman.id).update(
            {Rezervacija.aranzman_id: None}, synchronize_session=False
        )

        # Set new relationships if list is not empty
        if aranzman_data.rezervacija_1:
            # Validate that all IDs exist
            for rezervacija_id in aranzman_data.rezervacija_1:
                db_rezervacija = database.query(Rezervacija).filter(Rezervacija.id == rezervacija_id).first()
                if not db_rezervacija:
                    raise HTTPException(status_code=400, detail=f"Rezervacija with id {rezervacija_id} not found")

            # Update the related entities with the new foreign key
            database.query(Rezervacija).filter(Rezervacija.id.in_(aranzman_data.rezervacija_1)).update(
                {Rezervacija.aranzman_id: db_aranzman.id}, synchronize_session=False
            )
    database.commit()
    database.refresh(db_aranzman)

    rezervacija_1_ids = database.query(Rezervacija.id).filter(Rezervacija.aranzman_id == db_aranzman.id).all()
    response_data = {
        "aranzman": db_aranzman,
        "rezervacija_1_ids": [x[0] for x in rezervacija_1_ids]    }
    return response_data


@app.delete("/aranzman/{aranzman_id}/", response_model=None, tags=["Aranzman"])
async def delete_aranzman(aranzman_id: int, database: Session = Depends(get_db)):
    db_aranzman = database.query(Aranzman).filter(Aranzman.id == aranzman_id).first()
    if db_aranzman is None:
        raise HTTPException(status_code=404, detail="Aranzman not found")
    database.delete(db_aranzman)
    database.commit()
    return db_aranzman





############################################
#
#   Hotel functions
#
############################################

@app.get("/hotel/", response_model=None, tags=["Hotel"])
def get_all_hotel(detailed: bool = False, database: Session = Depends(get_db)) -> list:
    from sqlalchemy.orm import joinedload

    return database.query(Hotel).all()


@app.get("/hotel/count/", response_model=None, tags=["Hotel"])
def get_count_hotel(database: Session = Depends(get_db)) -> dict:
    """Get the total count of Hotel entities"""
    count = database.query(Hotel).count()
    return {"count": count}


@app.get("/hotel/paginated/", response_model=None, tags=["Hotel"])
def get_paginated_hotel(skip: int = 0, limit: int = 100, detailed: bool = False, database: Session = Depends(get_db)) -> dict:
    """Get paginated list of Hotel entities"""
    total = database.query(Hotel).count()
    hotel_list = database.query(Hotel).offset(skip).limit(limit).all()
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": hotel_list
    }


@app.get("/hotel/search/", response_model=None, tags=["Hotel"])
def search_hotel(
    database: Session = Depends(get_db)
) -> list:
    """Search Hotel entities by attributes"""
    query = database.query(Hotel)


    results = query.all()
    return results


@app.get("/hotel/{hotel_id}/", response_model=None, tags=["Hotel"])
async def get_hotel(hotel_id: int, database: Session = Depends(get_db)) -> Hotel:
    db_hotel = database.query(Hotel).filter(Hotel.id == hotel_id).first()
    if db_hotel is None:
        raise HTTPException(status_code=404, detail="Hotel not found")

    response_data = {
        "hotel": db_hotel,
}
    return response_data



@app.post("/hotel/", response_model=None, tags=["Hotel"])
async def create_hotel(hotel_data: HotelCreate, database: Session = Depends(get_db)) -> Hotel:


    db_hotel = Hotel(
        adresa=hotel_data.adresa,        naziv=hotel_data.naziv,        zvezdice=hotel_data.zvezdice        )

    database.add(db_hotel)
    database.commit()
    database.refresh(db_hotel)




    return db_hotel


@app.post("/hotel/bulk/", response_model=None, tags=["Hotel"])
async def bulk_create_hotel(items: list[HotelCreate], database: Session = Depends(get_db)) -> dict:
    """Create multiple Hotel entities at once"""
    created_items = []
    errors = []

    for idx, item_data in enumerate(items):
        try:
            # Basic validation for each item

            db_hotel = Hotel(
                adresa=item_data.adresa,                naziv=item_data.naziv,                zvezdice=item_data.zvezdice            )
            database.add(db_hotel)
            database.flush()  # Get ID without committing
            created_items.append(db_hotel.id)
        except Exception as e:
            errors.append({"index": idx, "error": str(e)})

    if errors:
        database.rollback()
        raise HTTPException(status_code=400, detail={"message": "Bulk creation failed", "errors": errors})

    database.commit()
    return {
        "created_count": len(created_items),
        "created_ids": created_items,
        "message": f"Successfully created {len(created_items)} Hotel entities"
    }


@app.delete("/hotel/bulk/", response_model=None, tags=["Hotel"])
async def bulk_delete_hotel(ids: list[int], database: Session = Depends(get_db)) -> dict:
    """Delete multiple Hotel entities at once"""
    deleted_count = 0
    not_found = []

    for item_id in ids:
        db_hotel = database.query(Hotel).filter(Hotel.id == item_id).first()
        if db_hotel:
            database.delete(db_hotel)
            deleted_count += 1
        else:
            not_found.append(item_id)

    database.commit()

    return {
        "deleted_count": deleted_count,
        "not_found": not_found,
        "message": f"Successfully deleted {deleted_count} Hotel entities"
    }

@app.put("/hotel/{hotel_id}/", response_model=None, tags=["Hotel"])
async def update_hotel(hotel_id: int, hotel_data: HotelCreate, database: Session = Depends(get_db)) -> Hotel:
    db_hotel = database.query(Hotel).filter(Hotel.id == hotel_id).first()
    if db_hotel is None:
        raise HTTPException(status_code=404, detail="Hotel not found")

    setattr(db_hotel, 'adresa', hotel_data.adresa)
    setattr(db_hotel, 'naziv', hotel_data.naziv)
    setattr(db_hotel, 'zvezdice', hotel_data.zvezdice)
    database.commit()
    database.refresh(db_hotel)

    return db_hotel


@app.delete("/hotel/{hotel_id}/", response_model=None, tags=["Hotel"])
async def delete_hotel(hotel_id: int, database: Session = Depends(get_db)):
    db_hotel = database.query(Hotel).filter(Hotel.id == hotel_id).first()
    if db_hotel is None:
        raise HTTPException(status_code=404, detail="Hotel not found")
    database.delete(db_hotel)
    database.commit()
    return db_hotel





############################################
#
#   Destinacija functions
#
############################################

@app.get("/destinacija/", response_model=None, tags=["Destinacija"])
def get_all_destinacija(detailed: bool = False, database: Session = Depends(get_db)) -> list:
    from sqlalchemy.orm import joinedload

    return database.query(Destinacija).all()


@app.get("/destinacija/count/", response_model=None, tags=["Destinacija"])
def get_count_destinacija(database: Session = Depends(get_db)) -> dict:
    """Get the total count of Destinacija entities"""
    count = database.query(Destinacija).count()
    return {"count": count}


@app.get("/destinacija/paginated/", response_model=None, tags=["Destinacija"])
def get_paginated_destinacija(skip: int = 0, limit: int = 100, detailed: bool = False, database: Session = Depends(get_db)) -> dict:
    """Get paginated list of Destinacija entities"""
    total = database.query(Destinacija).count()
    destinacija_list = database.query(Destinacija).offset(skip).limit(limit).all()
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": destinacija_list
    }


@app.get("/destinacija/search/", response_model=None, tags=["Destinacija"])
def search_destinacija(
    database: Session = Depends(get_db)
) -> list:
    """Search Destinacija entities by attributes"""
    query = database.query(Destinacija)


    results = query.all()
    return results


@app.get("/destinacija/{destinacija_id}/", response_model=None, tags=["Destinacija"])
async def get_destinacija(destinacija_id: int, database: Session = Depends(get_db)) -> Destinacija:
    db_destinacija = database.query(Destinacija).filter(Destinacija.id == destinacija_id).first()
    if db_destinacija is None:
        raise HTTPException(status_code=404, detail="Destinacija not found")

    response_data = {
        "destinacija": db_destinacija,
}
    return response_data



@app.post("/destinacija/", response_model=None, tags=["Destinacija"])
async def create_destinacija(destinacija_data: DestinacijaCreate, database: Session = Depends(get_db)) -> Destinacija:


    db_destinacija = Destinacija(
        naziv=destinacija_data.naziv,        opis=destinacija_data.opis,        zemlja=destinacija_data.zemlja        )

    database.add(db_destinacija)
    database.commit()
    database.refresh(db_destinacija)




    return db_destinacija


@app.post("/destinacija/bulk/", response_model=None, tags=["Destinacija"])
async def bulk_create_destinacija(items: list[DestinacijaCreate], database: Session = Depends(get_db)) -> dict:
    """Create multiple Destinacija entities at once"""
    created_items = []
    errors = []

    for idx, item_data in enumerate(items):
        try:
            # Basic validation for each item

            db_destinacija = Destinacija(
                naziv=item_data.naziv,                opis=item_data.opis,                zemlja=item_data.zemlja            )
            database.add(db_destinacija)
            database.flush()  # Get ID without committing
            created_items.append(db_destinacija.id)
        except Exception as e:
            errors.append({"index": idx, "error": str(e)})

    if errors:
        database.rollback()
        raise HTTPException(status_code=400, detail={"message": "Bulk creation failed", "errors": errors})

    database.commit()
    return {
        "created_count": len(created_items),
        "created_ids": created_items,
        "message": f"Successfully created {len(created_items)} Destinacija entities"
    }


@app.delete("/destinacija/bulk/", response_model=None, tags=["Destinacija"])
async def bulk_delete_destinacija(ids: list[int], database: Session = Depends(get_db)) -> dict:
    """Delete multiple Destinacija entities at once"""
    deleted_count = 0
    not_found = []

    for item_id in ids:
        db_destinacija = database.query(Destinacija).filter(Destinacija.id == item_id).first()
        if db_destinacija:
            database.delete(db_destinacija)
            deleted_count += 1
        else:
            not_found.append(item_id)

    database.commit()

    return {
        "deleted_count": deleted_count,
        "not_found": not_found,
        "message": f"Successfully deleted {deleted_count} Destinacija entities"
    }

@app.put("/destinacija/{destinacija_id}/", response_model=None, tags=["Destinacija"])
async def update_destinacija(destinacija_id: int, destinacija_data: DestinacijaCreate, database: Session = Depends(get_db)) -> Destinacija:
    db_destinacija = database.query(Destinacija).filter(Destinacija.id == destinacija_id).first()
    if db_destinacija is None:
        raise HTTPException(status_code=404, detail="Destinacija not found")

    setattr(db_destinacija, 'naziv', destinacija_data.naziv)
    setattr(db_destinacija, 'opis', destinacija_data.opis)
    setattr(db_destinacija, 'zemlja', destinacija_data.zemlja)
    database.commit()
    database.refresh(db_destinacija)

    return db_destinacija


@app.delete("/destinacija/{destinacija_id}/", response_model=None, tags=["Destinacija"])
async def delete_destinacija(destinacija_id: int, database: Session = Depends(get_db)):
    db_destinacija = database.query(Destinacija).filter(Destinacija.id == destinacija_id).first()
    if db_destinacija is None:
        raise HTTPException(status_code=404, detail="Destinacija not found")
    database.delete(db_destinacija)
    database.commit()
    return db_destinacija





############################################
#
#   Klijent functions
#
############################################

@app.get("/klijent/", response_model=None, tags=["Klijent"])
def get_all_klijent(detailed: bool = False, database: Session = Depends(get_db)) -> list:
    from sqlalchemy.orm import joinedload

    # Use detailed=true to get entities with eagerly loaded relationships (for tables with lookup columns)
    if detailed:
        # Eagerly load all relationships to avoid N+1 queries
        query = database.query(Klijent)
        klijent_list = query.all()

        # Serialize with relationships included
        result = []
        for klijent_item in klijent_list:
            item_dict = klijent_item.__dict__.copy()
            item_dict.pop('_sa_instance_state', None)

            # Add many-to-one relationships (foreign keys for lookup columns)

            # Add many-to-many and one-to-many relationship objects (full details)
            racun_list = database.query(Racun).filter(Racun.klijent_1_id == klijent_item.id).all()
            item_dict['racun'] = []
            for racun_obj in racun_list:
                racun_dict = racun_obj.__dict__.copy()
                racun_dict.pop('_sa_instance_state', None)
                item_dict['racun'].append(racun_dict)
            rezervacija_list = database.query(Rezervacija).filter(Rezervacija.klijent_id == klijent_item.id).all()
            item_dict['rezervacija'] = []
            for rezervacija_obj in rezervacija_list:
                rezervacija_dict = rezervacija_obj.__dict__.copy()
                rezervacija_dict.pop('_sa_instance_state', None)
                item_dict['rezervacija'].append(rezervacija_dict)

            result.append(item_dict)
        return result
    else:
        # Default: return flat entities (faster for charts/widgets without lookup columns)
        return database.query(Klijent).all()


@app.get("/klijent/count/", response_model=None, tags=["Klijent"])
def get_count_klijent(database: Session = Depends(get_db)) -> dict:
    """Get the total count of Klijent entities"""
    count = database.query(Klijent).count()
    return {"count": count}


@app.get("/klijent/paginated/", response_model=None, tags=["Klijent"])
def get_paginated_klijent(skip: int = 0, limit: int = 100, detailed: bool = False, database: Session = Depends(get_db)) -> dict:
    """Get paginated list of Klijent entities"""
    total = database.query(Klijent).count()
    klijent_list = database.query(Klijent).offset(skip).limit(limit).all()
    # By default, return flat entities (for charts/widgets)
    # Use detailed=true to get entities with relationships
    if not detailed:
        return {
            "total": total,
            "skip": skip,
            "limit": limit,
            "data": klijent_list
        }

    result = []
    for klijent_item in klijent_list:
        racun_ids = database.query(Racun.id).filter(Racun.klijent_1_id == klijent_item.id).all()
        rezervacija_ids = database.query(Rezervacija.id).filter(Rezervacija.klijent_id == klijent_item.id).all()
        item_data = {
            "klijent": klijent_item,
            "racun_ids": [x[0] for x in racun_ids],            "rezervacija_ids": [x[0] for x in rezervacija_ids]        }
        result.append(item_data)
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "data": result
    }


@app.get("/klijent/search/", response_model=None, tags=["Klijent"])
def search_klijent(
    database: Session = Depends(get_db)
) -> list:
    """Search Klijent entities by attributes"""
    query = database.query(Klijent)


    results = query.all()
    return results


@app.get("/klijent/{klijent_id}/", response_model=None, tags=["Klijent"])
async def get_klijent(klijent_id: int, database: Session = Depends(get_db)) -> Klijent:
    db_klijent = database.query(Klijent).filter(Klijent.id == klijent_id).first()
    if db_klijent is None:
        raise HTTPException(status_code=404, detail="Klijent not found")

    racun_ids = database.query(Racun.id).filter(Racun.klijent_1_id == db_klijent.id).all()
    rezervacija_ids = database.query(Rezervacija.id).filter(Rezervacija.klijent_id == db_klijent.id).all()
    response_data = {
        "klijent": db_klijent,
        "racun_ids": [x[0] for x in racun_ids],        "rezervacija_ids": [x[0] for x in rezervacija_ids]}
    return response_data



@app.post("/klijent/", response_model=None, tags=["Klijent"])
async def create_klijent(klijent_data: KlijentCreate, database: Session = Depends(get_db)) -> Klijent:


    db_klijent = Klijent(
        telefon=klijent_data.telefon,        email=klijent_data.email,        prezime=klijent_data.prezime,        datumRodjenja=klijent_data.datumRodjenja,        ime=klijent_data.ime        )

    database.add(db_klijent)
    database.commit()
    database.refresh(db_klijent)

    if klijent_data.racun:
        # Validate that all Racun IDs exist
        for racun_id in klijent_data.racun:
            db_racun = database.query(Racun).filter(Racun.id == racun_id).first()
            if not db_racun:
                raise HTTPException(status_code=400, detail=f"Racun with id {racun_id} not found")

        # Update the related entities with the new foreign key
        database.query(Racun).filter(Racun.id.in_(klijent_data.racun)).update(
            {Racun.klijent_1_id: db_klijent.id}, synchronize_session=False
        )
        database.commit()
    if klijent_data.rezervacija:
        # Validate that all Rezervacija IDs exist
        for rezervacija_id in klijent_data.rezervacija:
            db_rezervacija = database.query(Rezervacija).filter(Rezervacija.id == rezervacija_id).first()
            if not db_rezervacija:
                raise HTTPException(status_code=400, detail=f"Rezervacija with id {rezervacija_id} not found")

        # Update the related entities with the new foreign key
        database.query(Rezervacija).filter(Rezervacija.id.in_(klijent_data.rezervacija)).update(
            {Rezervacija.klijent_id: db_klijent.id}, synchronize_session=False
        )
        database.commit()



    racun_ids = database.query(Racun.id).filter(Racun.klijent_1_id == db_klijent.id).all()
    rezervacija_ids = database.query(Rezervacija.id).filter(Rezervacija.klijent_id == db_klijent.id).all()
    response_data = {
        "klijent": db_klijent,
        "racun_ids": [x[0] for x in racun_ids],        "rezervacija_ids": [x[0] for x in rezervacija_ids]    }
    return response_data


@app.post("/klijent/bulk/", response_model=None, tags=["Klijent"])
async def bulk_create_klijent(items: list[KlijentCreate], database: Session = Depends(get_db)) -> dict:
    """Create multiple Klijent entities at once"""
    created_items = []
    errors = []

    for idx, item_data in enumerate(items):
        try:
            # Basic validation for each item

            db_klijent = Klijent(
                telefon=item_data.telefon,                email=item_data.email,                prezime=item_data.prezime,                datumRodjenja=item_data.datumRodjenja,                ime=item_data.ime            )
            database.add(db_klijent)
            database.flush()  # Get ID without committing
            created_items.append(db_klijent.id)
        except Exception as e:
            errors.append({"index": idx, "error": str(e)})

    if errors:
        database.rollback()
        raise HTTPException(status_code=400, detail={"message": "Bulk creation failed", "errors": errors})

    database.commit()
    return {
        "created_count": len(created_items),
        "created_ids": created_items,
        "message": f"Successfully created {len(created_items)} Klijent entities"
    }


@app.delete("/klijent/bulk/", response_model=None, tags=["Klijent"])
async def bulk_delete_klijent(ids: list[int], database: Session = Depends(get_db)) -> dict:
    """Delete multiple Klijent entities at once"""
    deleted_count = 0
    not_found = []

    for item_id in ids:
        db_klijent = database.query(Klijent).filter(Klijent.id == item_id).first()
        if db_klijent:
            database.delete(db_klijent)
            deleted_count += 1
        else:
            not_found.append(item_id)

    database.commit()

    return {
        "deleted_count": deleted_count,
        "not_found": not_found,
        "message": f"Successfully deleted {deleted_count} Klijent entities"
    }

@app.put("/klijent/{klijent_id}/", response_model=None, tags=["Klijent"])
async def update_klijent(klijent_id: int, klijent_data: KlijentCreate, database: Session = Depends(get_db)) -> Klijent:
    db_klijent = database.query(Klijent).filter(Klijent.id == klijent_id).first()
    if db_klijent is None:
        raise HTTPException(status_code=404, detail="Klijent not found")

    setattr(db_klijent, 'telefon', klijent_data.telefon)
    setattr(db_klijent, 'email', klijent_data.email)
    setattr(db_klijent, 'prezime', klijent_data.prezime)
    setattr(db_klijent, 'datumRodjenja', klijent_data.datumRodjenja)
    setattr(db_klijent, 'ime', klijent_data.ime)
    if klijent_data.racun is not None:
        # Clear all existing relationships (set foreign key to NULL)
        database.query(Racun).filter(Racun.klijent_1_id == db_klijent.id).update(
            {Racun.klijent_1_id: None}, synchronize_session=False
        )

        # Set new relationships if list is not empty
        if klijent_data.racun:
            # Validate that all IDs exist
            for racun_id in klijent_data.racun:
                db_racun = database.query(Racun).filter(Racun.id == racun_id).first()
                if not db_racun:
                    raise HTTPException(status_code=400, detail=f"Racun with id {racun_id} not found")

            # Update the related entities with the new foreign key
            database.query(Racun).filter(Racun.id.in_(klijent_data.racun)).update(
                {Racun.klijent_1_id: db_klijent.id}, synchronize_session=False
            )
    if klijent_data.rezervacija is not None:
        # Clear all existing relationships (set foreign key to NULL)
        database.query(Rezervacija).filter(Rezervacija.klijent_id == db_klijent.id).update(
            {Rezervacija.klijent_id: None}, synchronize_session=False
        )

        # Set new relationships if list is not empty
        if klijent_data.rezervacija:
            # Validate that all IDs exist
            for rezervacija_id in klijent_data.rezervacija:
                db_rezervacija = database.query(Rezervacija).filter(Rezervacija.id == rezervacija_id).first()
                if not db_rezervacija:
                    raise HTTPException(status_code=400, detail=f"Rezervacija with id {rezervacija_id} not found")

            # Update the related entities with the new foreign key
            database.query(Rezervacija).filter(Rezervacija.id.in_(klijent_data.rezervacija)).update(
                {Rezervacija.klijent_id: db_klijent.id}, synchronize_session=False
            )
    database.commit()
    database.refresh(db_klijent)

    racun_ids = database.query(Racun.id).filter(Racun.klijent_1_id == db_klijent.id).all()
    rezervacija_ids = database.query(Rezervacija.id).filter(Rezervacija.klijent_id == db_klijent.id).all()
    response_data = {
        "klijent": db_klijent,
        "racun_ids": [x[0] for x in racun_ids],        "rezervacija_ids": [x[0] for x in rezervacija_ids]    }
    return response_data


@app.delete("/klijent/{klijent_id}/", response_model=None, tags=["Klijent"])
async def delete_klijent(klijent_id: int, database: Session = Depends(get_db)):
    db_klijent = database.query(Klijent).filter(Klijent.id == klijent_id).first()
    if db_klijent is None:
        raise HTTPException(status_code=404, detail="Klijent not found")
    database.delete(db_klijent)
    database.commit()
    return db_klijent







############################################
# Maintaining the server
############################################
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)



