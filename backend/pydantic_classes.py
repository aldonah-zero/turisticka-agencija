from datetime import datetime, date, time
from typing import Any, List, Optional, Union, Set
from enum import Enum
from pydantic import BaseModel, field_validator


############################################
# Enumerations are defined here
############################################

class TipAranzmana(Enum):
    KRSTARENJE = "KRSTARENJE"
    CITY_BREAK = "CITY_BREAK"
    ZIMOVANJE = "ZIMOVANJE"
    LETOVANJE = "LETOVANJE"

class StatusRacuna(Enum):
    KASNI = "KASNI"
    OTKAZAN = "OTKAZAN"
    IZDAT = "IZDAT"
    PLACEN = "PLACEN"

class NacinPlacanja(Enum):
    ONLINE = "ONLINE"
    GOTOVINA = "GOTOVINA"
    PRENOS = "PRENOS"
    KARTICA = "KARTICA"

class StatusRezervacije(Enum):
    OTKAZANO = "OTKAZANO"
    NA_CEKANJU = "NA_CEKANJU"
    POTVRDJENO = "POTVRDJENO"
    ZAVRSENO = "ZAVRSENO"

############################################
# Classes are defined here
############################################
class RacunCreate(BaseModel):
    iznos: float
    ukupno: float
    datumDospeca: date
    datumIzdavanja: date
    status: StatusRacuna
    brojRacuna: str
    nacin_placanja: NacinPlacanja
    pdv: float
    klijent_1: int  # N:1 Relationship (mandatory)
    aranzman_4: int  # N:1 Relationship (mandatory)


class VodicCreate(BaseModel):
    ime: str
    prezime: str
    jezici: str
    specijalizacija: str


class RezervacijaCreate(BaseModel):
    status: StatusRezervacije
    ukupnaCena: float
    datumRezervacije: date
    aranzman: int  # N:1 Relationship (mandatory)
    klijent: int  # N:1 Relationship (mandatory)


class AranzmanCreate(BaseModel):
    datumPolaska: date
    cena: float
    tip: TipAranzmana
    naziv: str
    trajanje: int
    datumPovratka: date
    vodic: Optional[int] = None  # N:1 Relationship (optional)
    hotel: int  # N:1 Relationship (mandatory)
    destinacija: int  # N:1 Relationship (mandatory)
    rezervacija_1: Optional[List[int]] = None  # 1:N Relationship


class HotelCreate(BaseModel):
    adresa: str
    naziv: str
    zvezdice: str


class DestinacijaCreate(BaseModel):
    naziv: str
    opis: str
    zemlja: str


class KlijentCreate(BaseModel):
    telefon: str
    email: str
    prezime: str
    datumRodjenja: date
    ime: str
    racun: Optional[List[int]] = None  # 1:N Relationship
    rezervacija: Optional[List[int]] = None  # 1:N Relationship


