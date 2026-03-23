from datetime import datetime, date, time
from typing import Any, List, Optional, Union, Set
from enum import Enum
from pydantic import BaseModel, field_validator


############################################
# Enumerations are defined here
############################################

class StatusRezervacije(Enum):
    ZAVRSENO = "ZAVRSENO"
    NA_CEKANJU = "NA_CEKANJU"
    OTKAZANO = "OTKAZANO"
    POTVRDJENO = "POTVRDJENO"

class TipAranzmana(Enum):
    CITY_BREAK = "CITY_BREAK"
    ZIMOVANJE = "ZIMOVANJE"
    LETOVANJE = "LETOVANJE"
    KRSTARENJE = "KRSTARENJE"

class StatusRacuna(Enum):
    KASNI = "KASNI"
    OTKAZAN = "OTKAZAN"
    PLACEN = "PLACEN"
    IZDAT = "IZDAT"

class NacinPlacanja(Enum):
    PRENOS = "PRENOS"
    ONLINE = "ONLINE"
    GOTOVINA = "GOTOVINA"
    KARTICA = "KARTICA"

############################################
# Classes are defined here
############################################
class VodicCreate(BaseModel):
    prezime: str
    specijalizacija: str
    jezici: str
    ime: str


class RezervacijaCreate(BaseModel):
    ukupnaCena: float
    datumRezervacije: date
    status: StatusRezervacije
    aranzman: int  # N:1 Relationship (mandatory)
    klijent: int  # N:1 Relationship (mandatory)


class AranzmanCreate(BaseModel):
    cena: float
    trajanje: int
    datumPolaska: date
    datumPovratka: date
    tip: TipAranzmana
    naziv: str
    rezervacija_1: Optional[List[int]] = None  # 1:N Relationship
    vodic: Optional[int] = None  # N:1 Relationship (optional)
    hotel: int  # N:1 Relationship (mandatory)
    destinacija: int  # N:1 Relationship (mandatory)


class RacunCreate(BaseModel):
    ukupno: float
    pdv: float
    nacin_placanja: NacinPlacanja
    datumIzdavanja: date
    iznos: float
    datumDospeca: date
    brojRacuna: str
    status: StatusRacuna
    aranzman_4: int  # N:1 Relationship (mandatory)
    klijent_1: int  # N:1 Relationship (mandatory)


class HotelCreate(BaseModel):
    zvezdice: str
    naziv: str
    adresa: str


class DestinacijaCreate(BaseModel):
    zemlja: str
    opis: str
    naziv: str


class KlijentCreate(BaseModel):
    datumRodjenja: date
    ime: str
    prezime: str
    telefon: str
    email: str
    racun: Optional[List[int]] = None  # 1:N Relationship
    rezervacija: Optional[List[int]] = None  # 1:N Relationship


