import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from dataset import construir_dataset, cargar_todos_los_intents


class DatasetModelTests(unittest.TestCase):
    def test_conversacion_se_incluye_en_el_dataset(self):
        intents = cargar_todos_los_intents()
        tags = {intent["tag"] for intent in intents}

        self.assertIn("saludo", tags)
        self.assertIn("despedida", tags)
        self.assertIn("agradecimiento", tags)

    def test_hola_queda_bien_representado_en_el_dataset(self):
        X, y, respuestas = construir_dataset()

        self.assertGreater(len(X), 50)
        self.assertIn("hola", X)
        self.assertIn("saludo", y)
        self.assertIn("saludo", respuestas)

    def test_operaciones_basicas_quedan_bien_representadas(self):
        X, y, respuestas = construir_dataset()

        self.assertIn("cuanto es 2 mas 2", X)
        self.assertIn("mat_operaciones_basicas", respuestas)
        self.assertIn("mat_operaciones_basicas", y)


if __name__ == "__main__":
    unittest.main()
