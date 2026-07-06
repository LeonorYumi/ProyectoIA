# app.py
# Servidor Flask que expone el chatbot como API

from flask import Flask, request, jsonify
from flask_cors import CORS
from model import ChatbotModel, entrenar_modelo
import os

app = Flask(__name__)
CORS(app)

modelo = None
RUTA_MODELO = "modelo_chatbot.pkl"
UMBRAL_CONFIANZA = 0.3


@app.route('/api/entrenar', methods=['POST'])
def entrenar():
    global modelo
    try:
        modelo = entrenar_modelo()
        return jsonify({
            "exito": True,
            "mensaje": "Modelo entrenado correctamente",
            "metricas": modelo.obtener_metricas()
        }), 200
    except Exception as e:
        return jsonify({"exito": False, "mensaje": f"Error al entrenar: {str(e)}"}), 500


@app.route('/api/chatbot', methods=['POST'])
def chatbot():
    if modelo is None:
        return jsonify({
            "exito": False,
            "mensaje": "El modelo no está entrenado. Primero entrena el modelo."
        }), 400

    datos = request.get_json()
    pregunta = datos.get('pregunta', '').strip()

    if not pregunta:
        return jsonify({"exito": False, "mensaje": "Por favor, escribe una pregunta"}), 400

    try:
        respuesta, confianza = modelo.encontrar_respuesta(pregunta)

        if confianza < UMBRAL_CONFIANZA:
            respuesta = "No tengo información para responder eso todavía. Intenta con otra pregunta sobre Python."

        return jsonify({
            "exito": True,
            "pregunta": pregunta,
            "respuesta": respuesta,
            "confianza": float(confianza)
        }), 200
    except Exception as e:
        return jsonify({"exito": False, "mensaje": f"Error: {str(e)}"}), 500


@app.route('/api/metricas', methods=['GET'])
def metricas():
    if modelo is None:
        return jsonify({"exito": False, "mensaje": "Modelo no entrenado"}), 400
    return jsonify(modelo.obtener_metricas()), 200


@app.route('/api/estado', methods=['GET'])
def estado():
    estado_modelo = "Entrenado" if modelo is not None else "No entrenado"
    return jsonify({"servidor": "funcionando", "modelo": estado_modelo}), 200


def cargar_modelo_existente():
    global modelo
    if os.path.exists(RUTA_MODELO):
        print(f"Cargando modelo existente: {RUTA_MODELO}")
        modelo = ChatbotModel.cargar(RUTA_MODELO)
    else:
        print("No hay modelo guardado, entrenando uno nuevo...")
        modelo = entrenar_modelo()


if __name__ == '__main__':
    cargar_modelo_existente()
    print("\nServidor iniciado en http://localhost:5000/api/estado")
    app.run(debug=True, port=5000)