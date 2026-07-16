import json
import re
import unicodedata
from pathlib import Path

DATASETS_DIR = Path(__file__).parent / "datasets"
BASE_DIR = Path(__file__).parent


def normalizar_texto(texto: str) -> str:
    texto = texto.lower().strip()
    # Normaliza operadores matemáticos comunes para que consultas como "2+2" se entiendan mejor.
    texto = re.sub(r'(?<=\d)\s*([+])\s*(?=\d)', ' mas ', texto)
    texto = re.sub(r'(?<=\d)\s*([-])\s*(?=\d)', ' menos ', texto)
    texto = re.sub(r'(?<=\d)\s*([x×*])\s*(?=\d)', ' por ', texto)
    texto = re.sub(r'(?<=\d)\s*([/÷])\s*(?=\d)', ' dividido ', texto)
    texto = unicodedata.normalize("NFD", texto)
    texto = "".join(caracter for caracter in texto if unicodedata.category(caracter) != "Mn")
    texto = re.sub(r"[^a-z0-9\s]", "", texto)
    texto = re.sub(r"\s+", " ", texto).strip()
    return texto


def cargar_todos_los_intents(directorio: Path = DATASETS_DIR) -> list[dict]:
    directorios = []
    for ruta in [directorio, DATASETS_DIR, BASE_DIR]:
        if ruta.exists():
            directorios.append(ruta)

    archivos = []
    for ruta in directorios:
        archivos.extend(sorted(ruta.glob("*.json")))

    archivos = sorted({archivo.resolve(): archivo for archivo in archivos}.values())
    if not archivos:
        raise FileNotFoundError(f"No se encontraron archivos JSON de conocimiento en {BASE_DIR}")

    todos_los_intents = []
    tags_vistos = set()

    for archivo in archivos:
        try:
            with open(archivo, "r", encoding="utf-8") as manejador:
                datos = json.load(manejador)
        except (json.JSONDecodeError, UnicodeDecodeError, OSError):
            continue

        if not isinstance(datos, dict) or "intents" not in datos:
            continue

        for intent in datos["intents"]:
            tag = intent.get("tag")
            if not tag or tag in tags_vistos:
                continue
            tags_vistos.add(tag)
            todos_los_intents.append(intent)

    if not todos_los_intents:
        raise ValueError("No se encontraron intenciones válidas para entrenar.")

    return todos_los_intents


def construir_dataset(directorio: Path = DATASETS_DIR):
    intents = cargar_todos_los_intents(directorio)

    X, y = [], []
    respuestas = {}

    for intent in intents:
        tag = intent["tag"]
        respuestas[tag] = intent.get("responses", [])

        for patron in intent.get("patterns", []):
            texto_limpio = normalizar_texto(patron)
            if texto_limpio:
                X.append(texto_limpio)
                y.append(tag)

    return X, y, respuestas


if __name__ == "__main__":
    X, y, respuestas = construir_dataset()
    print(f"Ejemplos cargados: {len(X)}")
    print(f"Intenciones cargadas: {len(respuestas)}")