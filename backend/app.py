from flask import Flask, request, jsonify
from flask_cors import CORS

from model import entrenar_modelo, cargar_metricas, predecir, PARAMS_DEFAULT

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://localhost:3001", "https://proyectoia-rho.vercel.app"]}}, supports_credentials=True)

try:
    print("Entrenando modelo con el dataset actualizado...")
    vectorizer, clf, respuestas, metricas = entrenar_modelo()
    umbral = metricas["parametros_usados"]["umbral"]
    print("Modelo entrenado y listo para usar.")
except Exception as exc:
    print(f"No fue posible entrenar el modelo al iniciar: {exc}")
    vectorizer = None
    clf = None
    respuestas = None
    umbral = PARAMS_DEFAULT["umbral"]


def estado_modelo():
    return {
        "estado": "listo",
        "modelo_cargado": clf is not None,
        "umbral": round(float(umbral), 3),
    }


@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify(estado_modelo())

@app.route("/api/train", methods=["POST"])
def train_model():
    global vectorizer, clf, respuestas, umbral

    body = request.get_json(silent=True) or {}
    params_validos = {clave: body[clave] for clave in PARAMS_DEFAULT if clave in body}

    try:
        vectorizer, clf, respuestas, metricas_res = entrenar_modelo(params_validos)
        umbral = metricas_res["parametros_usados"]["umbral"]
    except Exception as exc:
        return jsonify({"error": f"No fue posible entrenar el modelo: {exc}"}), 500

    return jsonify({
        "mensaje": "Modelo entrenado correctamente.",
        "metricas": metricas_res,
    })


@app.route("/api/metrics", methods=["GET"])
def get_metrics():
    metricas_entrenamiento = cargar_metricas()
    if metricas_entrenamiento is None:
        return jsonify({"error": "Aún no hay un modelo entrenado. Usa POST /api/entrenar."}), 404
    return jsonify(metricas_entrenamiento)


@app.route("/api/chat", methods=["POST"])
def chat_endpoint():
    body = request.get_json(silent=True) or {}
    mensaje = (body.get("mensaje") or body.get("pregunta") or "").strip()

    if not mensaje:
        return jsonify({"error": "El campo 'mensaje' es requerido."}), 400

    if clf is None or vectorizer is None or respuestas is None:
        # Fallback: prove a friendly instructional response when no trained model exists
        return jsonify({
            "respuesta": "Aún no hay un modelo entrenado. Puedes entrenarlo usando el botón 'Entrenar modelo'. Mientras tanto, intenta preguntas generales sobre matemáticas, programación o ciencias.",
            "intencion": "fallback",
            "confianza": 0.0,
        })

    respuesta, etiqueta, confianza = predecir(mensaje, vectorizer, clf, respuestas, umbral)

    return jsonify({
        "respuesta": respuesta,
        "intencion": etiqueta,
        "confianza": round(confianza, 3),
    })


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)