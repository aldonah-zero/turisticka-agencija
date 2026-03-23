"""
Skripta za punjenje baze podataka turističke agencije ADRIATICA
Pokretanje: python seed.py (iz backend_output foldera, sa aktivnim venv)
"""

import requests
import json

BASE = "http://localhost:8000"

def post(endpoint, data):
    r = requests.post(f"{BASE}/{endpoint}/", json=data)
    if r.status_code in (200, 201):
        result = r.json()
        # BESSER wraps single objects
        if isinstance(result, dict) and endpoint in result:
            return result[endpoint]
        return result
    else:
        print(f"  ❌ GREŠKA {endpoint}: {r.status_code} - {r.text[:200]}")
        return None

print("\n🌍 DESTINACIJE")
destinacije = [
    {"naziv": "Santorini",     "zemlja": "Grčka",    "opis": "Vulkansko ostrvo sa belim kućama, plavim kupolama i spektakularnim zalascima sunca."},
    {"naziv": "Dubrovnik",     "zemlja": "Hrvatska", "opis": "Biser Jadrana, stari grad opasan zidinama, UNESCO svetska baština."},
    {"naziv": "Rim",           "zemlja": "Italija",  "opis": "Večni grad, dom Koloseuma, Vatikana i najlepše italijanske kuhinje."},
    {"naziv": "Barcelona",     "zemlja": "Španija",  "opis": "Gaudijevi biseri, plaže, fudbal i nezaboravna noćna scena."},
    {"naziv": "Istanbul",      "zemlja": "Turska",   "opis": "Grad na dva kontinenta, spoj Istoka i Zapada, džamije i bazar."},
    {"naziv": "Pariz",         "zemlja": "Francuska","opis": "Grad svetlosti, Ajfelov toranj, Luvr i romantika na svakom koraku."},
    {"naziv": "Bečki Alpi",    "zemlja": "Austrija", "opis": "Predivni alpski predeli, skijaška staza svetske klase, čisto planinsko vazduh."},
    {"naziv": "Egipat - Hurgada", "zemlja": "Egipat","opis": "Sunce, peščane plaže, koralji Crvenog mora i piramide u dahu."},
]

dest_ids = {}
for d in destinacije:
    r = post("destinacija", d)
    if r:
        dest_ids[d["naziv"]] = r["id"]
        print(f"  ✓ {d['naziv']} ({d['zemlja']}) → ID {r['id']}")

print("\n🏨 HOTELI")
hoteli = [
    {"naziv": "Santorini Grace",        "zvezdice": "5", "adresa": "Imerovigli, Santorini, Grčka"},
    {"naziv": "Hotel Excelsior",         "zvezdice": "5", "adresa": "Frana Supila 12, Dubrovnik"},
    {"naziv": "Hotel de Russie",         "zvezdice": "5", "adresa": "Via del Babuino 9, Rim"},
    {"naziv": "Hotel Arts Barcelona",    "zvezdice": "5", "adresa": "Carrer de la Marina 19-21, Barcelona"},
    {"naziv": "Ciragan Palace Kempinski","zvezdice": "5", "adresa": "Ciragan Cad. 32, Istanbul"},
    {"naziv": "Hotel Le Meurice",        "zvezdice": "5", "adresa": "228 Rue de Rivoli, Pariz"},
    {"naziv": "Hotel Kaiserhof Wien",    "zvezdice": "4", "adresa": "Sonnbergpromenade 2, Beč"},
    {"naziv": "Hilton Hurghada Plaza",   "zvezdice": "5", "adresa": "Corniche Road, Hurgada, Egipat"},
    {"naziv": "Hotel Mediteran",         "zvezdice": "3", "adresa": "Santorini Centar"},
    {"naziv": "Adriatic Pearl Hotel",    "zvezdice": "4", "adresa": "Stari Grad, Dubrovnik"},
]

hotel_ids = {}
for h in hoteli:
    r = post("hotel", h)
    if r:
        hotel_ids[h["naziv"]] = r["id"]
        print(f"  ✓ {h['naziv']} ({'⭐'*int(h['zvezdice'])}) → ID {r['id']}")

print("\n👤 VODIČI")
vodici = [
    {"ime": "Marko",   "prezime": "Nikolić",   "jezici": "srpski, engleski, grčki",    "specijalizacija": "Mediteran i grčka ostrva"},
    {"ime": "Ana",     "prezime": "Jovanović",  "jezici": "srpski, engleski, italijanski","specijalizacija": "Italija i kulturna putovanja"},
    {"ime": "Stefan",  "prezime": "Petrović",   "jezici": "srpski, engleski, španski",  "specijalizacija": "Španija i Iberijsko poluostrvo"},
    {"ime": "Jelena",  "prezime": "Stojanović", "jezici": "srpski, engleski, turski",   "specijalizacija": "Turska i Bliski istok"},
    {"ime": "Nikola",  "prezime": "Đorđević",   "jezici": "srpski, engleski, francuski","specijalizacija": "Francuska i zapadna Evropa"},
    {"ime": "Ivana",   "prezime": "Milošević",  "jezici": "srpski, engleski, nemački",  "specijalizacija": "Alpske destinacije i zimovanje"},
]

vodic_ids = {}
for v in vodici:
    r = post("vodic", v)
    if r:
        vodic_ids[v["prezime"]] = r["id"]
        print(f"  ✓ {v['ime']} {v['prezime']} → ID {r['id']}")

print("\n✈️  ARANŽMANI")
aranzmani_data = [
    # Letovanja
    {"naziv": "Santorini Luxury 7 noći",   "cena": 128000, "trajanje": 8,  "datumPolaska": "2025-06-15", "datumPovratka": "2025-06-22", "tip": "LETOVANJE",   "dest": "Santorini",        "hotel": "Santorini Grace",        "vodic": "Nikolić"},
    {"naziv": "Santorini Budget 5 noći",   "cena": 72000,  "trajanje": 6,  "datumPolaska": "2025-07-10", "datumPovratka": "2025-07-15", "tip": "LETOVANJE",   "dest": "Santorini",        "hotel": "Hotel Mediteran",        "vodic": "Nikolić"},
    {"naziv": "Dubrovnik Biseri Jadrana",  "cena": 89000,  "trajanje": 7,  "datumPolaska": "2025-06-20", "datumPovratka": "2025-06-26", "tip": "LETOVANJE",   "dest": "Dubrovnik",        "hotel": "Hotel Excelsior",        "vodic": None},
    {"naziv": "Dubrovnik Klasik",          "cena": 65000,  "trajanje": 5,  "datumPolaska": "2025-08-01", "datumPovratka": "2025-08-05", "tip": "LETOVANJE",   "dest": "Dubrovnik",        "hotel": "Adriatic Pearl Hotel",   "vodic": None},
    {"naziv": "Hurgada All Inclusive",     "cena": 95000,  "trajanje": 10, "datumPolaska": "2025-07-05", "datumPovratka": "2025-07-14", "tip": "LETOVANJE",   "dest": "Egipat - Hurgada", "hotel": "Hilton Hurghada Plaza",  "vodic": None},
    # City breakovi
    {"naziv": "Rim Večni Grad 4 dana",     "cena": 75000,  "trajanje": 4,  "datumPolaska": "2025-05-10", "datumPovratka": "2025-05-13", "tip": "CITY_BREAK",  "dest": "Rim",              "hotel": "Hotel de Russie",        "vodic": "Jovanović"},
    {"naziv": "Barcelona Art & Beach",     "cena": 82000,  "trajanje": 5,  "datumPolaska": "2025-05-20", "datumPovratka": "2025-05-24", "tip": "CITY_BREAK",  "dest": "Barcelona",        "hotel": "Hotel Arts Barcelona",   "vodic": "Petrović"},
    {"naziv": "Istanbul Dva sveta",        "cena": 68000,  "trajanje": 5,  "datumPolaska": "2025-04-15", "datumPovratka": "2025-04-19", "tip": "CITY_BREAK",  "dest": "Istanbul",         "hotel": "Ciragan Palace Kempinski","vodic": "Stojanović"},
    {"naziv": "Pariz Romantika",           "cena": 110000, "trajanje": 4,  "datumPolaska": "2025-06-01", "datumPovratka": "2025-06-04", "tip": "CITY_BREAK",  "dest": "Pariz",            "hotel": "Hotel Le Meurice",       "vodic": "Đorđević"},
    # Zimovanje
    {"naziv": "Austrijski Alpi 7 dana",   "cena": 115000, "trajanje": 7,  "datumPolaska": "2026-01-10", "datumPovratka": "2026-01-16", "tip": "ZIMOVANJE",   "dest": "Bečki Alpi",       "hotel": "Hotel Kaiserhof Wien",   "vodic": "Milošević"},
    # Krstarenje
    {"naziv": "Mediteransko krstarenje",  "cena": 185000, "trajanje": 12, "datumPolaska": "2025-09-01", "datumPovratka": "2025-09-12", "tip": "KRSTARENJE",  "dest": "Santorini",        "hotel": "Santorini Grace",        "vodic": "Nikolić"},
]

aranzman_ids = []
for a in aranzmani_data:
    payload = {
        "naziv": a["naziv"],
        "cena": a["cena"],
        "trajanje": a["trajanje"],
        "datumPolaska": a["datumPolaska"],
        "datumPovratka": a["datumPovratka"],
        "tip": a["tip"],
        "destinacija": dest_ids.get(a["dest"]),
        "hotel": hotel_ids.get(a["hotel"]),
        "vodic": vodic_ids.get(a["vodic"]) if a["vodic"] else None,
    }
    r = post("aranzman", payload)
    if r:
        aid = r.get("id") or r.get("aranzman", {}).get("id")
        if aid:
            aranzman_ids.append(aid)
            print(f"  ✓ {a['naziv']} ({a['tip']}) — {a['cena']:,} RSD → ID {aid}")

print("\n👥 KLIJENTI")
klijenti_data = [
    {"ime": "Petar",    "prezime": "Kovačević", "email": "petar.kovacevic@gmail.com",  "telefon": "+381 60 123 4567", "datumRodjenja": "1985-03-15"},
    {"ime": "Milica",   "prezime": "Filipović", "email": "milica.filipovic@gmail.com", "telefon": "+381 64 234 5678", "datumRodjenja": "1990-07-22"},
    {"ime": "Dragan",   "prezime": "Vasić",     "email": "dragan.vasic@yahoo.com",     "telefon": "+381 65 345 6789", "datumRodjenja": "1978-11-08"},
    {"ime": "Jovana",   "prezime": "Lukić",     "email": "jovana.lukic@gmail.com",     "telefon": "+381 61 456 7890", "datumRodjenja": "1995-05-30"},
    {"ime": "Aleksandar","prezime": "Bogdanović","email": "aleks.bogdanovic@gmail.com", "telefon": "+381 63 567 8901", "datumRodjenja": "1982-09-14"},
]

klijent_ids = []
for k in klijenti_data:
    r = post("klijent", k)
    if r:
        kid = r.get("id") or r.get("klijent", {}).get("id")
        if kid:
            klijent_ids.append(kid)
            print(f"  ✓ {k['ime']} {k['prezime']} → ID {kid}")

print("\n📋 REZERVACIJE")
from datetime import date
rezervacije_data = [
    {"klijent": 0, "aranzman": 0, "status": "POTVRDJENO",  "cena": 128000, "datum": "2025-04-01"},
    {"klijent": 1, "aranzman": 5, "status": "POTVRDJENO",  "cena": 75000,  "datum": "2025-03-15"},
    {"klijent": 2, "aranzman": 9, "status": "POTVRDJENO",  "cena": 115000, "datum": "2025-05-20"},
    {"klijent": 3, "aranzman": 6, "status": "NA_CEKANJU",  "cena": 82000,  "datum": "2025-04-10"},
    {"klijent": 4, "aranzman": 2, "status": "POTVRDJENO",  "cena": 89000,  "datum": "2025-03-28"},
    {"klijent": 0, "aranzman": 7, "status": "OTKAZANO",    "cena": 68000,  "datum": "2025-02-14"},
    {"klijent": 1, "aranzman": 4, "status": "POTVRDJENO",  "cena": 95000,  "datum": "2025-04-05"},
]

for rez in rezervacije_data:
    if rez["klijent"] < len(klijent_ids) and rez["aranzman"] < len(aranzman_ids):
        payload = {
            "datumRezervacije": rez["datum"],
            "ukupnaCena": rez["cena"],
            "status": rez["status"],
            "klijent": klijent_ids[rez["klijent"]],
            "aranzman": aranzman_ids[rez["aranzman"]],
        }
        r = post("rezervacija", payload)
        if r:
            print(f"  ✓ Rezervacija: Klijent {klijent_ids[rez['klijent']]} + Aranžman {aranzman_ids[rez['aranzman']]} → {rez['status']}")


print("\n🧾 RAČUNI")
racuni_data = [
    {"brojRacuna": "ADR-2025-001", "datumIzdavanja": "2025-04-02", "datumDospeca": "2025-04-20",
     "iznos": 128000, "pdv": 23040, "ukupno": 151040,
     "nacin_placanja": "KARTICA", "status": "PLACEN", "klijent": 0, "aranzman": 0},
    {"brojRacuna": "ADR-2025-002", "datumIzdavanja": "2025-03-16", "datumDospeca": "2025-04-01",
     "iznos": 75000, "pdv": 13500, "ukupno": 88500,
     "nacin_placanja": "PRENOS", "status": "PLACEN", "klijent": 1, "aranzman": 5},
    {"brojRacuna": "ADR-2025-003", "datumIzdavanja": "2025-05-21", "datumDospeca": "2025-06-05",
     "iznos": 115000, "pdv": 20700, "ukupno": 135700,
     "nacin_placanja": "ONLINE", "status": "IZDAT", "klijent": 2, "aranzman": 9},
    {"brojRacuna": "ADR-2025-004", "datumIzdavanja": "2025-04-11", "datumDospeca": "2025-04-25",
     "iznos": 82000, "pdv": 14760, "ukupno": 96760,
     "nacin_placanja": "GOTOVINA", "status": "KASNI", "klijent": 3, "aranzman": 6},
    {"brojRacuna": "ADR-2025-005", "datumIzdavanja": "2025-03-29", "datumDospeca": "2025-04-12",
     "iznos": 89000, "pdv": 16020, "ukupno": 105020,
     "nacin_placanja": "KARTICA", "status": "PLACEN", "klijent": 4, "aranzman": 2},
]

for rac in racuni_data:
    if rac["klijent"] < len(klijent_ids) and rac["aranzman"] < len(aranzman_ids):
        payload = {
            "brojRacuna": rac["brojRacuna"],
            "datumIzdavanja": rac["datumIzdavanja"],
            "datumDospeca": rac["datumDospeca"],
            "iznos": rac["iznos"],
            "pdv": rac["pdv"],
            "ukupno": rac["ukupno"],
            "nacin_placanja": rac["nacin_placanja"],
            "status": rac["status"],
            "klijent_id": klijent_ids[rac["klijent"]],
            "aranzman_id": aranzman_ids[rac["aranzman"]],
        }
        r = post("racun", payload)
        if r:
            rid = r.get("id") or r.get("racun", {}).get("id")
            print(f"  ✓ {rac['brojRacuna']} — {rac['status']} — {rac['ukupno']:,} RSD → ID {rid}")

print("\n✅ GOTOVO! Baza je popunjena.")
print("   Osvježi localhost:3000 da vidiš podatke.")