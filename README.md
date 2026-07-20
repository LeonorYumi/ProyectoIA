# PoliBot - Chatbot Educativo con IA

PoliBot es un asistente educativo desarrollado como proyecto académico para responder preguntas de forma natural sobre diversas materias escolares y conceptos de aprendizaje. El sistema combina un backend en Flask con un frontend en React y utiliza un modelo clásico de procesamiento de lenguaje natural basado en TF-IDF y regresión logística para clasificar preguntas y generar respuestas.

## 1. Propósito del proyecto

El objetivo de PoliBot es ofrecer una experiencia de consulta interactiva, útil para estudiantes que necesitan ayuda rápida sobre temas académicos. El chatbot puede responder preguntas generales, brindar apoyo en situaciones de duda y, además, manejar operaciones matemáticas básicas simples.

## 2. Características principales

- Interfaz web amigable desarrollada con React
- API REST en Flask para gestionar conversaciones y entrenar el modelo
- Clasificación de intenciones mediante técnicas de NLP
- Respuestas basadas en un dataset estructurado en JSON
- Métricas de entrenamiento y estado del modelo
- Soporte para operaciones matemáticas básicas como sumar, restar, multiplicar y dividir
- Historial de conversaciones en el navegador

## 3. Tecnologías utilizadas

### Backend
- Python 3.9+
- Flask
- Flask-CORS
- scikit-learn
- NumPy
- SciPy
- joblib

### Frontend
- React 18
- Axios
- React Scripts

## 4. Estructura del proyecto

```text
ProyectoIA/
├── backend/
│   ├── app.py
│   ├── dataset.py
│   ├── model.py
│   ├── requirements.txt
│   ├── datasets/
│   │   ├── ciencias.json
│   │   ├── conversacion.json
│   │   ├── geografia.json
│   │   ├── historia.json
│   │   ├── informatica.json
│   │   ├── lenguaje.json
│   │   ├── matematicas.json
│   │   └── metricas_entrenamiento.json
│   └── modelo_chatbot.pkl
├── frontend/
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.js
│       ├── App.css
│       ├── index.css
│       ├── index.js
│       └── components/
│           └── InteractiveOwl.jsx
└── README.md
```

## 5. Instalación y ejecución local

### Requisitos previos
- Python instalado
- Node.js y npm instalados
- Git

### 5.1 Backend

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

El backend quedará disponible en:
- http://localhost:5000/api/health

### 5.2 Frontend

```powershell
cd frontend
npm install
npm start
```

La interfaz quedará disponible en:
- http://localhost:3000

## 6. Uso del sistema

### Interacción con la interfaz
1. Abrir la aplicación en el navegador.
2. Escribir una pregunta o solicitud en el chat.
3. El sistema intentará clasificar la intención y devolver una respuesta adecuada.
4. Si el modelo no está entrenado aún, el sistema mostrará un aviso y podrá entrenarlo desde la interfaz.

### Entrenamiento del modelo
El backend expone un endpoint para entrenar el modelo con los datasets disponibles. La interfaz también ofrece una opción para reentrenar el modelo desde la configuración avanzada.

## 7. Endpoints principales del backend

- GET /api/health: verifica el estado del servidor y el modelo
- POST /api/train: entrena o reentrena el modelo
- GET /api/metrics: devuelve métricas de entrenamiento
- POST /api/chat: recibe una pregunta y devuelve una respuesta

### Ejemplo de uso con curl

```bash
curl http://localhost:5000/api/health
```

```bash
curl -X POST http://localhost:5000/api/chat -H "Content-Type: application/json" -d "{\"mensaje\":\"¿Qué es una variable?\"}"
```

## 8. Funcionamiento interno

El sistema sigue este flujo:

1. El backend carga los archivos JSON del directorio datasets.
2. Se construye un dataset con patrones y respuestas.
3. Se transforma el texto mediante normalización y vectorización TF-IDF.
4. Se entrena un clasificador de regresión logística.
5. Al recibir una pregunta, el sistema la transforma, la clasifica y devuelve una respuesta con un nivel de confianza.
6. Si la confianza es baja, el sistema responde con un mensaje de fallback para pedir una reformulación.

## 9. Dataset y conocimiento

Los datasets se almacenan en la carpeta backend/datasets. Cada archivo JSON contiene intenciones con:
- tag: identificador de la intención
- patterns: preguntas o frases de ejemplo
- responses: respuestas asociadas a esa intención

Esto permite ampliar el conocimiento del chatbot agregando nuevas intenciones, ejemplos y respuestas sin modificar la lógica central.

## 10. Notas importantes

- El modelo actual es un enfoque simple y educativo, no un sistema de IA generativa.
- La respuesta depende de la calidad del dataset y del entrenamiento realizado.
- Para mejorar el rendimiento, conviene agregar más ejemplos y categorías específicas.
- El frontend guarda conversaciones locales en el navegador mediante localStorage.

## 11. Futuras mejoras

- Integrar un modelo más avanzado de NLP o lenguaje grande
- Añadir autenticación y persistencia de conversaciones en servidor
- Mejorar la gestión de contexto y memoria conversacional
- Soportar respuestas más completas y contextualizadas

## 12. Créditos

Camila Bueno
Leornor Yumi


