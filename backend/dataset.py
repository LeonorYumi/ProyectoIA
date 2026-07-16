

dataset = [
    {"pregunta": "hola", "respuesta": "Hola. Soy tu chatbot educativo de Python. Puedo ayudarte con if, else, for, funciones, listas y variables."},
    {"pregunta": "buenas", "respuesta": "Hola. Soy tu chatbot educativo de Python. ¿Qué tema quieres repasar hoy?"},
    {"pregunta": "buenos dias", "respuesta": "Buenos días. ¿Quieres aprender algo de Python?"},
    {"pregunta": "buenas tardes", "respuesta": "Buenas tardes. ¿En qué tema de Python te ayudo?"},
    {"pregunta": "buenas noches", "respuesta": "Buenas noches. ¿Quieres practicar un concepto de Python?"},
    {"pregunta": "gracias", "respuesta": "De nada. Estoy aquí para ayudarte."},
    {"pregunta": "adios", "respuesta": "Hasta luego. Sigue practicando Python."},
    {"pregunta": "quien eres", "respuesta": "Soy un chatbot educativo de Python."},
    {"pregunta": "como te llamas", "respuesta": "Soy tu chatbot educativo de Python."},
    {"pregunta": "que puedes hacer", "respuesta": "Puedo explicarte variables, condicionales, bucles, funciones, listas y diccionarios."},

    {"pregunta": "que es una variable", "respuesta": "Una variable guarda un valor. Ejemplo: edad = 20\nprint(edad)"},
    {"pregunta": "variable", "respuesta": "Una variable guarda un valor. Ejemplo: edad = 20\nprint(edad)"},
    {"pregunta": "como crear una variable", "respuesta": "Se crea asignando un valor. Ejemplo: nombre = 'Ana'"},

    {"pregunta": "que es if", "respuesta": "if sirve para ejecutar código solo si una condición es verdadera.\nEjemplo:\nedad = 20\nif edad >= 18:\n    print('Eres mayor de edad')"},
    {"pregunta": "if", "respuesta": "if sirve para ejecutar código solo si una condición es verdadera.\nEjemplo:\nedad = 20\nif edad >= 18:\n    print('Eres mayor de edad')"},
    {"pregunta": "que es else", "respuesta": "else se ejecuta cuando la condición del if no se cumple.\nEjemplo:\nedad = 16\nif edad >= 18:\n    print('Mayor')\nelse:\n    print('Menor')"},
    {"pregunta": "else", "respuesta": "else se ejecuta cuando la condición del if no se cumple.\nEjemplo:\nedad = 16\nif edad >= 18:\n    print('Mayor')\nelse:\n    print('Menor')"},
    {"pregunta": "elif", "respuesta": "elif añade otra condición si la anterior no se cumplió.\nEjemplo:\npuntaje = 85\nif puntaje >= 90:\n    print('Excelente')\nelif puntaje >= 70:\n    print('Bueno')\nelse:\n    print('Requiere mejorar')"},

    {"pregunta": "que es un for", "respuesta": "for repite instrucciones varias veces.\nEjemplo:\nfor i in range(3):\n    print(i)"},
    {"pregunta": "for", "respuesta": "for repite instrucciones varias veces.\nEjemplo:\nfor i in range(3):\n    print(i)"},
    {"pregunta": "bucle for", "respuesta": "Un bucle for sirve para repetir código un número conocido de veces.\nEjemplo:\nfor i in range(3):\n    print(i)"},
    {"pregunta": "que es un while", "respuesta": "while repite mientras una condición siga siendo verdadera.\nEjemplo:\ncontador = 0\nwhile contador < 3:\n    print(contador)\n    contador += 1"},
    {"pregunta": "while", "respuesta": "while repite mientras una condición siga siendo verdadera.\nEjemplo:\ncontador = 0\nwhile contador < 3:\n    print(contador)\n    contador += 1"},

    {"pregunta": "que es una funcion", "respuesta": "Una función agrupa instrucciones para reutilizarlas.\nEjemplo:\ndef saludar():\n    print('Hola')\n\nsaludar()"},
    {"pregunta": "funcion", "respuesta": "Una función agrupa instrucciones para reutilizarlas.\nEjemplo:\ndef saludar():\n    print('Hola')\n\nsaludar()"},
    {"pregunta": "def", "respuesta": "def se usa para definir una función.\nEjemplo:\ndef sumar(a, b):\n    return a + b"},
    {"pregunta": "que es return", "respuesta": "return devuelve un valor desde la función.\nEjemplo:\ndef sumar(a, b):\n    return a + b"},

    {"pregunta": "que es una lista", "respuesta": "Una lista guarda varios elementos en un solo lugar.\nEjemplo:\nfrutas = ['manzana', 'pera']\nprint(frutas[0])"},
    {"pregunta": "lista", "respuesta": "Una lista guarda varios elementos en un solo lugar.\nEjemplo:\nfrutas = ['manzana', 'pera']\nprint(frutas[0])"},
    {"pregunta": "como agregar a una lista", "respuesta": "Se usa append().\nEjemplo:\nfrutas = ['manzana']\nfrutas.append('pera')\nprint(frutas)"},

    {"pregunta": "que es un diccionario", "respuesta": "Un diccionario guarda datos en pares clave-valor.\nEjemplo:\npersona = {'nombre': 'Ana', 'edad': 20}\nprint(persona['nombre'])"},
    {"pregunta": "diccionario", "respuesta": "Un diccionario guarda datos en pares clave-valor.\nEjemplo:\npersona = {'nombre': 'Ana', 'edad': 20}\nprint(persona['nombre'])"},

    {"pregunta": "que es python", "respuesta": "Python es un lenguaje fácil de leer y muy usado en programación."},
    {"pregunta": "como empezar en python", "respuesta": "Empieza con variables, condicionales, bucles y funciones. Te puedo explicar cada tema paso a paso."},
    {"pregunta": "ayuda", "respuesta": "Claro. Puedes preguntarme por if, else, for, while, funciones, listas o variables."},
]


def obtener_dataset():
    return dataset


def obtener_preguntas():
    return [item["pregunta"] for item in dataset]


def obtener_respuestas():
    return [item["respuesta"] for item in dataset]