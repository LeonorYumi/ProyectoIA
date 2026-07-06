# dataset.py
# Preguntas y respuestas de entrenamiento del chatbot
# Cada respuesta tiene varias preguntas asociadas (incluida la palabra clave sola)
# para que el modelo reconozca distintas formas de preguntar lo mismo

dataset = [

    # Variables
    {"pregunta": "que es una variable", "respuesta": "Una variable es un espacio donde se guarda un dato. Ejemplo: edad = 20"},
    {"pregunta": "variable en python", "respuesta": "Una variable es un espacio donde se guarda un dato. Ejemplo: edad = 20"},
    {"pregunta": "variable", "respuesta": "Una variable es un espacio donde se guarda un dato. Ejemplo: edad = 20"},
    {"pregunta": "para que sirve una variable", "respuesta": "Sirve para guardar información y poder reutilizarla más adelante en el código"},
    {"pregunta": "como declarar una variable", "respuesta": "Se declara escribiendo nombre = valor. Ejemplo: x = 10"},
    {"pregunta": "como crear una variable", "respuesta": "Se declara escribiendo nombre = valor. Ejemplo: x = 10"},

    # Tipos de datos
    {"pregunta": "tipos de datos", "respuesta": "Los tipos principales son int, float, str, bool, list y dict"},
    {"pregunta": "cuales son los tipos de datos", "respuesta": "Los tipos principales son int, float, str, bool, list y dict"},
    {"pregunta": "que tipos de datos existen", "respuesta": "Los tipos principales son int, float, str, bool, list y dict"},
    {"pregunta": "que es int", "respuesta": "int es el tipo de dato para números enteros, como 5 o -3"},
    {"pregunta": "que es un int", "respuesta": "int es el tipo de dato para números enteros, como 5 o -3"},
    {"pregunta": "que es float", "respuesta": "float es el tipo de dato para números decimales, como 3.14"},
    {"pregunta": "que es un float", "respuesta": "float es el tipo de dato para números decimales, como 3.14"},
    {"pregunta": "que es str", "respuesta": "str es el tipo de dato para texto, siempre entre comillas"},
    {"pregunta": "que es un str", "respuesta": "str es el tipo de dato para texto, siempre entre comillas"},
    {"pregunta": "que es bool", "respuesta": "bool es el tipo de dato que solo puede ser True o False"},
    {"pregunta": "que es un bool", "respuesta": "bool es el tipo de dato que solo puede ser True o False"},

    # Operadores
    {"pregunta": "operadores en python", "respuesta": "Los operadores básicos son +, -, *, /, //, % y **"},
    {"pregunta": "operadores matematicos", "respuesta": "Los operadores básicos son +, -, *, /, //, % y **"},
    {"pregunta": "operadores", "respuesta": "Los operadores básicos son +, -, *, /, //, % y **"},
    {"pregunta": "que es el modulo", "respuesta": "El operador % devuelve el residuo de una división. Ejemplo: 10 % 3 = 1"},
    {"pregunta": "modulo", "respuesta": "El operador % devuelve el residuo de una división. Ejemplo: 10 % 3 = 1"},
    {"pregunta": "que es la division entera", "respuesta": "El operador // divide y descarta los decimales del resultado. Ejemplo: 10 // 3 = 3"},
    {"pregunta": "que es la potencia", "respuesta": "El operador ** eleva un número a una potencia. Ejemplo: 2 ** 3 = 8"},

    # Condicionales
    {"pregunta": "que es if", "respuesta": "if ejecuta un bloque de código solo si una condición es verdadera"},
    {"pregunta": "para que sirve if", "respuesta": "if ejecuta un bloque de código solo si una condición es verdadera"},
    {"pregunta": "if", "respuesta": "if ejecuta un bloque de código solo si una condición es verdadera"},
    {"pregunta": "que es else", "respuesta": "else ejecuta un bloque de código cuando la condición del if es falsa"},
    {"pregunta": "else", "respuesta": "else ejecuta un bloque de código cuando la condición del if es falsa"},
    {"pregunta": "que es elif", "respuesta": "elif permite agregar una condición adicional después de un if"},
    {"pregunta": "elif", "respuesta": "elif permite agregar una condición adicional después de un if"},
    {"pregunta": "diferencia entre elif y else", "respuesta": "elif evalúa una condición nueva, else se ejecuta si ninguna condición anterior se cumplió"},

    # Bucles
    {"pregunta": "que es un for", "respuesta": "for es un bucle que repite instrucciones una cantidad determinada de veces"},
    {"pregunta": "para que sirve el for", "respuesta": "for es un bucle que repite instrucciones una cantidad determinada de veces"},
    {"pregunta": "for", "respuesta": "for es un bucle que repite instrucciones una cantidad determinada de veces"},
    {"pregunta": "que es un while", "respuesta": "while repite instrucciones mientras una condición siga siendo verdadera"},
    {"pregunta": "while", "respuesta": "while repite instrucciones mientras una condición siga siendo verdadera"},
    {"pregunta": "diferencia entre for y while", "respuesta": "for se usa cuando sabes cuántas veces repetir, while cuando depende de una condición"},
    {"pregunta": "que es range", "respuesta": "range genera una secuencia de números, útil para recorrer con un for"},
    {"pregunta": "como uso range", "respuesta": "range genera una secuencia de números, útil para recorrer con un for"},
    {"pregunta": "range", "respuesta": "range genera una secuencia de números, útil para recorrer con un for"},

    # Funciones
    {"pregunta": "que es una funcion", "respuesta": "Una función es un bloque de código reutilizable que se ejecuta al llamarla"},
    {"pregunta": "para que sirve una funcion", "respuesta": "Una función es un bloque de código reutilizable que se ejecuta al llamarla"},
    {"pregunta": "funcion", "respuesta": "Una función es un bloque de código reutilizable que se ejecuta al llamarla"},
    {"pregunta": "como se define una funcion", "respuesta": "Con la palabra def seguida del nombre. Ejemplo: def saludar():"},
    {"pregunta": "def", "respuesta": "Con la palabra def seguida del nombre. Ejemplo: def saludar():"},
    {"pregunta": "que es return", "respuesta": "return devuelve un valor desde una función y termina su ejecución"},
    {"pregunta": "return", "respuesta": "return devuelve un valor desde una función y termina su ejecución"},
    {"pregunta": "que son los parametros de una funcion", "respuesta": "Los parámetros son los valores que una función recibe para trabajar con ellos"},
    {"pregunta": "diferencia entre parametro y argumento", "respuesta": "El parámetro es el nombre en la definición, el argumento es el valor real que se envía"},

    # Listas
    {"pregunta": "que es una lista", "respuesta": "Una lista es una colección ordenada de elementos entre corchetes []"},
    {"pregunta": "como se crea una lista", "respuesta": "Una lista es una colección ordenada de elementos entre corchetes []"},
    {"pregunta": "lista", "respuesta": "Una lista es una colección ordenada de elementos entre corchetes []"},
    {"pregunta": "como accedo a un elemento de una lista", "respuesta": "Con un índice entre corchetes. Ejemplo: lista[0]"},
    {"pregunta": "como agrego un elemento a una lista", "respuesta": "Con append(). Ejemplo: lista.append(5)"},
    {"pregunta": "append", "respuesta": "append() agrega un elemento al final de la lista. Ejemplo: lista.append(5)"},
    {"pregunta": "como elimino un elemento de una lista", "respuesta": "Con remove() para borrar por valor o pop() para borrar por índice"},
    {"pregunta": "remove", "respuesta": "remove() elimina el primer elemento que coincida con el valor dado. Ejemplo: lista.remove(3)"},
    {"pregunta": "pop", "respuesta": "pop() elimina y devuelve un elemento según su posición. Sin índice, elimina el último"},

    # Diccionarios
    {"pregunta": "que es un diccionario", "respuesta": "Un diccionario guarda datos en pares de clave y valor, entre llaves {}"},
    {"pregunta": "como se crea un diccionario", "respuesta": "Un diccionario guarda datos en pares de clave y valor, entre llaves {}"},
    {"pregunta": "diccionario", "respuesta": "Un diccionario guarda datos en pares de clave y valor, entre llaves {}"},
    {"pregunta": "como accedo a un diccionario", "respuesta": "Usando la clave entre corchetes. Ejemplo: persona['nombre']"},

    # Cadenas
    {"pregunta": "que es una cadena", "respuesta": "Una cadena (str) es texto entre comillas, como 'hola' o 'mundo'"},
    {"pregunta": "como concatenar cadenas", "respuesta": "Se puede usar el operador + o f-strings, como f'Hola {nombre}'"},
    {"pregunta": "como unir texto en python", "respuesta": "Se puede usar el operador + o f-strings, como f'Hola {nombre}'"},
    {"pregunta": "concatenar", "respuesta": "Se puede usar el operador + o f-strings, como f'Hola {nombre}'"},
    {"pregunta": "metodos de cadenas", "respuesta": "Algunos son upper(), lower(), split(), replace() y strip()"},
    {"pregunta": "upper", "respuesta": "upper() convierte el texto a mayúsculas. Ejemplo: 'hola'.upper() = 'HOLA'"},
    {"pregunta": "lower", "respuesta": "lower() convierte el texto a minúsculas. Ejemplo: 'HOLA'.lower() = 'hola'"},
    {"pregunta": "strip", "respuesta": "strip() elimina espacios en blanco al inicio y al final de un texto"},
    {"pregunta": "replace", "respuesta": "replace() reemplaza un fragmento de texto por otro. Ejemplo: 'Hola'.replace('Hola', 'Chau')"},

    # Python general
    {"pregunta": "que es python", "respuesta": "Python es un lenguaje de programación de alto nivel, fácil de leer"},
    {"pregunta": "quien creo python", "respuesta": "Python fue creado por Guido van Rossum en 1991"},
    {"pregunta": "para que sirve python", "respuesta": "Se usa en desarrollo web, inteligencia artificial, análisis de datos y automatización"},

    # Saludos y despedidas
    {"pregunta": "hola", "respuesta": "¡Hola! Soy tu asistente de Python. ¿Qué tema quieres repasar?"},
    {"pregunta": "buenos dias", "respuesta": "¡Buenos días! ¿En qué tema de Python te ayudo hoy?"},
    {"pregunta": "buenas tardes", "respuesta": "¡Buenas tardes! ¿En qué tema de Python te ayudo hoy?"},
    {"pregunta": "buenas noches", "respuesta": "¡Buenas noches! ¿En qué tema de Python te ayudo hoy?"},
    {"pregunta": "gracias", "respuesta": "¡De nada! Sigue practicando"},
    {"pregunta": "adios", "respuesta": "¡Hasta luego! Nos vemos pronto"},
]


def obtener_dataset():
    return dataset


def obtener_preguntas():
    return [item["pregunta"] for item in dataset]


def obtener_respuestas():
    return [item["respuesta"] for item in dataset]