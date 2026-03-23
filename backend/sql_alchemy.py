import enum
from typing import List, Optional
from sqlalchemy import (
    create_engine, Column, ForeignKey, Table, Text, Boolean, String, Date, 
    Time, DateTime, Float, Integer, Enum
)
from sqlalchemy.orm import (
    column_property, DeclarativeBase, Mapped, mapped_column, relationship
)
from datetime import datetime as dt_datetime, time as dt_time, date as dt_date

class Base(DeclarativeBase):
    pass

# Definitions of Enumerations
class StatusRezervacije(enum.Enum):
    ZAVRSENO = "ZAVRSENO"
    NA_CEKANJU = "NA_CEKANJU"
    OTKAZANO = "OTKAZANO"
    POTVRDJENO = "POTVRDJENO"

class TipAranzmana(enum.Enum):
    CITY_BREAK = "CITY_BREAK"
    ZIMOVANJE = "ZIMOVANJE"
    LETOVANJE = "LETOVANJE"
    KRSTARENJE = "KRSTARENJE"

class StatusRacuna(enum.Enum):
    KASNI = "KASNI"
    OTKAZAN = "OTKAZAN"
    PLACEN = "PLACEN"
    IZDAT = "IZDAT"

class NacinPlacanja(enum.Enum):
    PRENOS = "PRENOS"
    ONLINE = "ONLINE"
    GOTOVINA = "GOTOVINA"
    KARTICA = "KARTICA"


# Tables definition for many-to-many relationships

# Tables definition
class Vodic(Base):
    __tablename__ = "vodic"
    id: Mapped[int] = mapped_column(primary_key=True)
    ime: Mapped[str] = mapped_column(String(100))
    prezime: Mapped[str] = mapped_column(String(100))
    jezici: Mapped[str] = mapped_column(String(100))
    specijalizacija: Mapped[str] = mapped_column(String(100))

class Rezervacija(Base):
    __tablename__ = "rezervacija"
    id: Mapped[int] = mapped_column(primary_key=True)
    datumRezervacije: Mapped[dt_date] = mapped_column(Date)
    ukupnaCena: Mapped[float] = mapped_column(Float)
    status: Mapped[StatusRezervacije] = mapped_column(Enum(StatusRezervacije))
    aranzman_id: Mapped[int] = mapped_column(ForeignKey("aranzman.id"))
    klijent_id: Mapped[int] = mapped_column(ForeignKey("klijent.id"))

class Aranzman(Base):
    __tablename__ = "aranzman"
    id: Mapped[int] = mapped_column(primary_key=True)
    naziv: Mapped[str] = mapped_column(String(100))
    cena: Mapped[float] = mapped_column(Float)
    trajanje: Mapped[int] = mapped_column(Integer)
    datumPolaska: Mapped[dt_date] = mapped_column(Date)
    datumPovratka: Mapped[dt_date] = mapped_column(Date)
    tip: Mapped[TipAranzmana] = mapped_column(Enum(TipAranzmana))
    hotel_id: Mapped[int] = mapped_column(ForeignKey("hotel.id"))
    vodic_id: Mapped[int] = mapped_column(ForeignKey("vodic.id"), nullable=True)
    destinacija_id: Mapped[int] = mapped_column(ForeignKey("destinacija.id"))

class Racun(Base):
    __tablename__ = "racun"
    id: Mapped[int] = mapped_column(primary_key=True)
    brojRacuna: Mapped[str] = mapped_column(String(100))
    datumIzdavanja: Mapped[dt_date] = mapped_column(Date)
    datumDospeca: Mapped[dt_date] = mapped_column(Date)
    iznos: Mapped[float] = mapped_column(Float)
    pdv: Mapped[float] = mapped_column(Float)
    ukupno: Mapped[float] = mapped_column(Float)
    nacin_placanja: Mapped[NacinPlacanja] = mapped_column(Enum(NacinPlacanja))
    status: Mapped[StatusRacuna] = mapped_column(Enum(StatusRacuna))
    klijent_1_id: Mapped[int] = mapped_column(ForeignKey("klijent.id"))
    aranzman_4_id: Mapped[int] = mapped_column(ForeignKey("aranzman.id"))

class Hotel(Base):
    __tablename__ = "hotel"
    id: Mapped[int] = mapped_column(primary_key=True)
    naziv: Mapped[str] = mapped_column(String(100))
    zvezdice: Mapped[str] = mapped_column(String(100))
    adresa: Mapped[str] = mapped_column(String(100))

class Destinacija(Base):
    __tablename__ = "destinacija"
    id: Mapped[int] = mapped_column(primary_key=True)
    naziv: Mapped[str] = mapped_column(String(100))
    zemlja: Mapped[str] = mapped_column(String(100))
    opis: Mapped[str] = mapped_column(String(100))

class Klijent(Base):
    __tablename__ = "klijent"
    id: Mapped[int] = mapped_column(primary_key=True)
    ime: Mapped[str] = mapped_column(String(100))
    prezime: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(100))
    telefon: Mapped[str] = mapped_column(String(100))
    datumRodjenja: Mapped[dt_date] = mapped_column(Date)


#--- Relationships of the vodic table
Vodic.aranzman_3: Mapped[List["Aranzman"]] = relationship("Aranzman", back_populates="vodic", foreign_keys=[Aranzman.vodic_id])

#--- Relationships of the rezervacija table
Rezervacija.aranzman: Mapped["Aranzman"] = relationship("Aranzman", back_populates="rezervacija_1", foreign_keys=[Rezervacija.aranzman_id])
Rezervacija.klijent: Mapped["Klijent"] = relationship("Klijent", back_populates="rezervacija", foreign_keys=[Rezervacija.klijent_id])

#--- Relationships of the aranzman table
Aranzman.rezervacija_1: Mapped[List["Rezervacija"]] = relationship("Rezervacija", back_populates="aranzman", foreign_keys=[Rezervacija.aranzman_id])
Aranzman.racun_1: Mapped[List["Racun"]] = relationship("Racun", back_populates="aranzman_4", foreign_keys=[Racun.aranzman_4_id])
Aranzman.hotel: Mapped["Hotel"] = relationship("Hotel", back_populates="aranzman_2", foreign_keys=[Aranzman.hotel_id])
Aranzman.vodic: Mapped["Vodic"] = relationship("Vodic", back_populates="aranzman_3", foreign_keys=[Aranzman.vodic_id])
Aranzman.destinacija: Mapped["Destinacija"] = relationship("Destinacija", back_populates="aranzman_1", foreign_keys=[Aranzman.destinacija_id])

#--- Relationships of the racun table
Racun.klijent_1: Mapped["Klijent"] = relationship("Klijent", back_populates="racun", foreign_keys=[Racun.klijent_1_id])
Racun.aranzman_4: Mapped["Aranzman"] = relationship("Aranzman", back_populates="racun_1", foreign_keys=[Racun.aranzman_4_id])

#--- Relationships of the hotel table
Hotel.aranzman_2: Mapped[List["Aranzman"]] = relationship("Aranzman", back_populates="hotel", foreign_keys=[Aranzman.hotel_id])

#--- Relationships of the destinacija table
Destinacija.aranzman_1: Mapped[List["Aranzman"]] = relationship("Aranzman", back_populates="destinacija", foreign_keys=[Aranzman.destinacija_id])

#--- Relationships of the klijent table
Klijent.rezervacija: Mapped[List["Rezervacija"]] = relationship("Rezervacija", back_populates="klijent", foreign_keys=[Rezervacija.klijent_id])
Klijent.racun: Mapped[List["Racun"]] = relationship("Racun", back_populates="klijent_1", foreign_keys=[Racun.klijent_1_id])

# Database connection
DATABASE_URL = "sqlite:///Class_Diagram.db"  # SQLite connection
engine = create_engine(DATABASE_URL, echo=True)

# Create tables in the database
Base.metadata.create_all(engine, checkfirst=True)