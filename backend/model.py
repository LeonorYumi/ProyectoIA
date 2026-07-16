

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import joblib
from dataset import obtener_dataset


class ChatbotModel:

    def __init__(self):
        self.preguntas_entrenamiento = []
        self.respuestas_entrenamiento = []
        self.vectorizador = None
        self.matriz_caracteristicas = None
        self.exactitud = 0

    def cargar_datos(self):
        dataset = obtener_dataset()
        self.preguntas_entrenamiento = [item["pregunta"] for item in dataset]
        self.respuestas_entrenamiento = [item["respuesta"] for item in dataset]
        print(f"Datos cargados: {len(self.preguntas_entrenamiento)} pares")

    def entrenar(self):
        print("Entrenando modelo...")

        # Vectorizador por palabras
        self.vectorizador = TfidfVectorizer(
            lowercase=True,
            strip_accents="unicode",
            ngram_range=(1, 2)
        )

        self.matriz_caracteristicas = self.vectorizador.fit_transform(
            self.preguntas_entrenamiento
        )

        # Métrica simple de exactitud
        aciertos = 0
        for i, pregunta in enumerate(self.preguntas_entrenamiento):
            respuesta_encontrada, _ = self.encontrar_respuesta(pregunta)
            if respuesta_encontrada == self.respuestas_entrenamiento[i]:
                aciertos += 1

        self.exactitud = (aciertos / len(self.preguntas_entrenamiento)) * 100
        print(f"Exactitud: {self.exactitud:.2f}%")

    def encontrar_respuesta(self, pregunta_usuario):
        texto = pregunta_usuario.strip().lower()

        for pregunta, respuesta in zip(self.preguntas_entrenamiento, self.respuestas_entrenamiento):
            if texto == pregunta.lower():
                return respuesta, 1.0

        pregunta_vectorizada = self.vectorizador.transform([pregunta_usuario])

        similitudes = cosine_similarity(
            pregunta_vectorizada,
            self.matriz_caracteristicas
        )[0]

        indice_similar = np.argmax(similitudes)
        confianza = similitudes[indice_similar]
        respuesta = self.respuestas_entrenamiento[indice_similar]

        return respuesta, float(confianza)

    def obtener_metricas(self):
        return {
            "exactitud": round(self.exactitud, 2),
            "preguntas_entrenamiento": len(self.preguntas_entrenamiento),
            "tipo_modelo": "TF-IDF + Cosine Similarity",
            "idioma": "Español"
        }

    def guardar(self, ruta="modelo_chatbot.pkl"):
        joblib.dump(self, ruta)
        print(f"Modelo guardado en {ruta}")

    @staticmethod
    def cargar(ruta="modelo_chatbot.pkl"):
        return joblib.load(ruta)


def entrenar_modelo():
    modelo = ChatbotModel()
    modelo.cargar_datos()
    modelo.entrenar()
    modelo.guardar()
    return modelo


if __name__ == "__main__":
    modelo = entrenar_modelo()

    pregunta_test = "¿Qué es una variable?"
    respuesta, confianza = modelo.encontrar_respuesta(pregunta_test)

    print(f"\nPregunta: {pregunta_test}")
    print(f"Respuesta: {respuesta}")
    print(f"Confianza: {confianza:.2f}")