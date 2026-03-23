from datetime import datetime, date, time
from typing import Any, List, Optional, Union, Set
from enum import Enum
from pydantic import BaseModel, field_validator


############################################
# Enumerations are defined here
############################################

class TipAranzmana(Enum):
    CITY_BREAK = "CITY_BREAK"
    KRSTARENJE = "KRSTARENJE"
    LETOVANJE = "LETOVANJE"
    ZIMOVANJE = "ZIMOVANJE"

class StatusRacuna(Enum):
    PLACEN = "PLACEN"
    IZDAT = "IZDAT"
    OTKAZAN = "OTKAZAN"
    KASNI = "KASNI"

class NacinPlacanja(Enum):
    ONLINE = "ONLINE"
    PRENOS = "PRENOS"
    GOTOVINA = "GOTOVINA"
    KARTICA = "KARTICA"

class StatusRezervacije(Enum):
    POTVRDJENO = "POTVRDJENO"
    OTKAZANO = "OTKAZANO"
    NA_CEKANJU = "NA_CEKANJU"
    ZAVRSENO = "ZAVRSENO"

############################################
# Classes are defined here
############################################
class RacunCreate(BaseModel):
    pdv: float
    brojRacuna: str
    datumDospeca: date
    iznos: float
    ukupno: float
    status: StatusRacuna
    nacin_placanja: NacinPlacanja
    datumIzdavanja: date
    aranzman_id: int
    klijent_id: int


class VodicCreate(BaseModel):
    ime: str
    prezime: str
    specijalizacija: str
    jezici: str


class RezervacijaCreate(BaseModel):
    datumRezervacije: date
    status: StatusRezervacije
    ukupnaCena: float
    aranzman: int  # N:1 Relationship (mandatory)
    klijent: int  # N:1 Relationship (mandatory)


class AranzmanCreate(BaseModel):
    datumPolaska: date
    tip: TipAranzmana
    datumPovratka: date
    naziv: str
    cena: float
    trajanje: int
    vodic: Optional[int] = None  # N:1 Relationship (optional)
    rezervacija_id: Optional[List[int]] = None  # 1:N Relationship
    destinacija: int  # N:1 Relationship (mandatory)
    hotel: int  # N:1 Relationship (mandatory)


class HotelCreate(BaseModel):
    zvezdice: str
    adresa: str
    naziv: str


class DestinacijaCreate(BaseModel):
    opis: str
    naziv: str
    zemlja: str


class KlijentCreate(BaseModel):
    prezime: str
    ime: str
    email: str
    telefon: str
    datumRodjenja: date
    racun: Optional[List[int]] = None  # 1:N Relationship
    rezervacija: Optional[List[int]] = None  # 1:N Relationship


