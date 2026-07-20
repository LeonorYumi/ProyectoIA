import json
import pickle
import random
import re
from pathlib import Path

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split

from dataset import construir_dataset, normalizar_texto

MODEL_PATH = Path(__file__).parent / "modelo_chatbot.pkl"
METRICS_PATH = Path(__file__).parent / "metricas_entrenamiento.json"

PARAMS_DEFAULT = {
    "C": 4.5,
    "ngram_max": 2,
    "test_size": 0.2,
    "umbral": 0.12,
}


def entrenar_modelo(params: dict = None):
    parametros = {**PARAMS_DEFAULT, **(params or {})}
    X, y, respuestas = construir_dataset()

    if not X:
        raise ValueError("No hay ejemplos disponibles para entrenar.")

    vectorizer = TfidfVectorizer(ngram_range=(1, parametros["ngram_max"]), sublinear_tf=True)
    X_vec = vectorizer.fit_transform(X)

    metricas = {
        "parametros_usados": parametros,
        "n_ejemplos": len(X),
        "n_intenciones": len(respuestas),
    }

    try:
        X_train, X_test, y_train, y_test = train_test_split(
            X_vec,
            y,
            test_size=parametros["test_size"],
            random_state=42,
            stratify=y, 
        )
        hay_validacion = True
    except ValueError:
        X_train, X_test, y_train, y_test = X_vec, None, y, None
        hay_validacion = False

    
    clasificador = LogisticRegression(C=parametros["C"], max_iter=3000, solver="lbfgs")
    clasificador.fit(X_train, y_train)

    if hay_validacion and X_test is not None and len(y_test) > 0:
        y_pred = clasificador.predict(X_test)
        metricas["accuracy"] = accuracy_score(y_test, y_pred)
        metricas["reporte"] = classification_report(y_test, y_pred, zero_division=0, output_dict=True)
        metricas["validacion_disponible"] = True
    else:
        y_pred_train = clasificador.predict(X_train)
        metricas["accuracy_train"] = accuracy_score(y_train, y_pred_train)
        metricas["validacion_disponible"] = False

    with open(MODEL_PATH, "wb") as archivo:
        pickle.dump(
            {
                "vectorizer": vectorizer,
                "clasificador": clasificador,
                "respuestas": respuestas,
                "umbral": parametros["umbral"],
                "parametros": parametros,
            },
            archivo,
        )

    with open(METRICS_PATH, "w", encoding="utf-8") as archivo:
        json.dump(metricas, archivo, ensure_ascii=False, indent=2)

    return vectorizer, clasificador, respuestas, metricas


def cargar_modelo():
    with open(MODEL_PATH, "rb") as archivo:
        datos = pickle.load(archivo)
    return datos["vectorizer"], datos["clasificador"], datos["respuestas"], datos.get("umbral", 0.35)


def cargar_metricas():
    if not METRICS_PATH.exists():
        return None
    with open(METRICS_PATH, "r", encoding="utf-8") as archivo:
        return json.load(archivo)


def calcular_operacion_simple(texto: str):
    patrones = [
        (r"^(\d+)\s*(?:\+|mas)\s*(\d+)$", lambda a, b: int(a) + int(b), "+"),
        (r"^(\d+)\s*(?:-|menos)\s*(\d+)$", lambda a, b: int(a) - int(b), "-"),
        (r"^(\d+)\s*(?:x|por|\*)\s*(\d+)$", lambda a, b: int(a) * int(b), "×"),
        (r"^(\d+)\s*(?:/|dividido)\s*(\d+)$", lambda a, b: None if int(b) == 0 else int(a) / int(b), "÷"),
    ]
    for patron, operacion, simbolo in patrones:
        coincidencia = re.match(patron, texto)
        if coincidencia:
            a, b = coincidencia.groups()
            resultado = operacion(a, b)
            if resultado is None:
                return "No puedo dividir entre cero.", None, 1.0
            if simbolo == "÷" and isinstance(resultado, float) and resultado.is_integer():
                resultado = int(resultado)
            return f"{a} {simbolo} {b} = {resultado}", "mat_operaciones_basicas", 0.95
    return None


def es_consulta_ayuda_general(texto: str):
    if re.search(r"\b(ayuda|ayudame|no entiendo|necesito ayuda|me puedes ayudar|dame ayuda|no se que|no sé que|puedes ayudarme)\b", texto):
        return True
    return False


def predecir(texto: str, vectorizer, clasificador, respuestas, umbral: float = 0.35):
    texto_norm = normalizar_texto(texto)
    if not texto_norm:
        return (
            "No tengo suficiente información para responder con seguridad. Intenta reformular la pregunta con más detalle.",
            "consulta_general",
            0.0,
        )

    operacion = calcular_operacion_simple(texto_norm)
    if operacion is not None:
        return operacion

    if es_consulta_ayuda_general(texto_norm):
        ayuda = respuestas.get("ayuda_general")
        if ayuda:
            return random.choice(ayuda), "ayuda_general", 0.85
        return (
            "Claro, dime qué parte necesitas que te explique y lo resolvemos juntos.",
            "ayuda_general",
            0.85,
        )

    X_vec = vectorizer.transform([texto_norm])
    probas = clasificador.predict_proba(X_vec)[0]
    indice_maximo = int(probas.argmax())
    confianza = float(probas[indice_maximo])
    etiqueta = clasificador.classes_[indice_maximo]

    if confianza < umbral:
        return (
            "No tengo suficiente información para responder con seguridad. Puedes reformular tu pregunta o pedir una explicación más general.",
            etiqueta,
            confianza,
        )

    options = respuestas.get(etiqueta, ["No tengo una respuesta preparada para esta consulta."])
    respuesta = random.choice(options)
    return respuesta, etiqueta, confianza


if __name__ == "__main__":
    vectorizer, clasificador, respuestas, metricas = entrenar_modelo()
    print("Modelo listo. Escribe una pregunta o 'salir' para terminar.")
    while True:
        texto = input("Tú: ")
        if texto.lower() in {"salir", "exit", "quit"}:
            break
        respuesta, etiqueta, confianza = predecir(texto, vectorizer, clasificador, respuestas, metricas["parametros_usados"]["umbral"])
        print(f"Bot [{etiqueta} | {confianza:.2f}]: {respuesta}\n")
