#  Chatbot Educativo con IA - Proyecto Académico
## Fundamentos de Inteligencia Artificial


--

## 1️⃣ PROPUESTA DEL PROYECTO

### Título
**"Chatbot Educativo con IA para Asistencia en Programación Python"**

### Descripción General
Un sistema de chatbot inteligente que responde preguntas sobre conceptos fundamentales de Programación en Python utilizando técnicas simples de procesamiento de lenguaje natural (NLP). El sistema está diseñado para asistir estudiantes en la comprensión de temas básicos como variables, bucles, funciones y estructuras de datos.

### Justificación
- **Aplicación Real:** Los chatbots educativos son herramientas crecientes en educación digital
- **Accesibilidad:** Proporciona ayuda disponible 24/7 a estudiantes
- **Aprendizaje Práctico:** Permite aplicar conceptos de IA en un contexto educativo relevante
- **Simpleza:** Usa técnicas de NLP accesibles para estudiantes de nivel intermedio

---

## 2️⃣ OBJETIVO GENERAL

Desarrollar un sistema de chatbot educativo con inteligencia artificial que sea capaz de procesar preguntas en lenguaje natural sobre Programación en Python y proporcionar respuestas relevantes y precisas mediante técnicas de aprendizaje automático.

---

## 3️⃣ OBJETIVOS ESPECÍFICOS

1. **Entrenar un modelo NLP** utilizando TF-IDF (Term Frequency-Inverse Document Frequency) en un dataset de preguntas y respuestas educativas

2. **Calcular similitud semántica** entre preguntas del usuario y preguntas de entrenamiento usando Cosine Similarity

3. **Crear una API REST** con Flask que exponga el modelo a través de endpoints HTTP

4. **Desarrollar una interfaz gráfica** con React que permita a usuarios interactuar con el chatbot

5. **Mostrar métricas del modelo** incluyendo exactitud, confianza de respuestas y parámetros de entrenamiento

6. **Permitir configuración de parámetros** del modelo NLP (stop words, número de features, etc.)

7. **Implementar control de calidad** mostrando el nivel de confianza de cada respuesta



## 5️⃣ ARQUITECTURA DEL SISTEMA

```
┌─────────────────────────────────────────────────────┐
│            APLICACIÓN CHATBOT EDUCATIVO             │
└─────────────────────────────────────────────────────┘
                          │
                ┌─────────┴──────────┐
                │                    │
       ┌────────▼────────┐  ┌────────▼────────┐
       │   FRONTEND      │  │    BACKEND      │
       │   (React)       │  │   (Flask)       │
       │                 │  │                 │
       │ • App.js        │  │ • app.py        │
       │ • App.css       │  │ • model.py      │
       │ • index.js      │  │ • dataset.py    │
       └────────┬────────┘  └────────┬────────┘
                │                    │
                └────────┬───────────┘
                         │
                    HTTP REQUESTS
                    (Axios/Fetch)
                         │
                ┌────────▼────────┐
                │   API REST      │
                │  (Flask)        │
                │                 │
                │ /api/chatbot    │
                │ /api/entrenar   │
                │ /api/metricas   │
                │ /api/estado     │
                │ /api/salud      │
                └────────┬────────┘
                         │
            ┌────────────┴──────────────┐
            │                           │
       ┌────▼─────┐            ┌────────▼────┐
       │  MODELO  │            │   DATASET   │
       │   (IA)   │            │  (20 Q&A)   │
       │          │            │             │
       │TF-IDF    │            │preguntas    │
       │Cosine    │            │respuestas   │
       │Sim       │            │categorías   │
       └──────────┘            └─────────────┘
```

---

## 6️⃣ TECNOLOGÍAS RECOMENDADAS

### Backend
| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| **Python** | 3.9+ | Lenguaje principal |
| **Flask** | 2.3.2 | Framework web ligero |
| **Flask-CORS** | 4.0.0 | Permitir solicitudes desde React |
| **scikit-learn** | 1.3.0 | Algoritmos de ML (TF-IDF, Cosine Similarity) |
| **NLTK** | 3.8.1 | Procesamiento de lenguaje natural |
| **NumPy** | 1.24.3 | Operaciones numéricas |
| **joblib** | 1.3.1 | Guardar/cargar modelos |

### Frontend
| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| **React** | 18.2.0 | Framework UI |
| **Axios** | 1.4.0 | Cliente HTTP |
| **React-Scripts** | 5.0.1 | Herramientas de construcción |
| **CSS3** | Nativo | Estilos |

### ¿Por qué estas tecnologías?
- **Simples:** Fáciles de aprender y documentadas
- **Poderosas:** Capaces de resolver el problema
- **Educativas:** Ampliamente usadas en educación
- **Gratuitas:** Open source, sin costo
- **Locales:** Se ejecutan sin dependencias externas

---

## 7️⃣ ESTRUCTURA DE CARPETAS

```
chatbot-educativo/
│
├── backend/
│   ├── app.py              # Servidor Flask (API principal)
│   ├── model.py            # Clase del modelo de IA
│   ├── dataset.py          # Dataset de preguntas y respuestas
│   ├── requirements.txt    # Dependencias Python
│   └── modelo_chatbot.pkl  # Modelo entrenado (se crea al ejecutar)
│
├── frontend/
│   ├── package.json        # Dependencias React
│   ├── public/
│   │   └── index.html      # HTML principal
│   └── src/
│       ├── index.js        # Punto de entrada React
│       ├── index.css       # Estilos globales
│       ├── App.js          # Componente principal
│       └── App.css         # Estilos del componente
│
└── README.md               # Este archivo

```

