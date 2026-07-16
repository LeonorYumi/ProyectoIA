

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {

  const [mensajes, setMensajes] = useState([
    {
      tipo: 'bot',
      contenido: 'Hola, soy tu asistente educativo. Puedo ayudarte con preguntas sobre Programación en Python. ¿Qué deseas saber?',
      timestamp: new Date()
    }
  ]);

  const [preguntaActual, setPreguntaActual] = useState('');
  const [cargando, setCargando] = useState(false);

  const [metricas, setMetricas] = useState(null);

  const [modeloEntrenado, setModeloEntrenado] = useState(false);

  const [errorMensaje, setErrorMensaje] = useState('');

  const finalDelChat = useRef(null);

  const API_BASE = 'http://localhost:5000/api';

  useEffect(() => {

    verificarServidor();

    if (finalDelChat.current) {
      finalDelChat.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [mensajes]);

  
  const verificarServidor = async () => {
    try {
      const respuesta = await axios.get(`${API_BASE}/estado`);
      
      if (respuesta.data.modelo === 'Entrenado') {
        setModeloEntrenado(true);
  
        await cargarMetricas();
      } else {
        setModeloEntrenado(false);
      }
    } catch (error) {
      setErrorMensaje(
        ' No se puede conectar con el servidor. ¿Está Flask corriendo en http://localhost:5000?'
      );
      console.error('Error:', error);
    }
  };


  const cargarMetricas = async () => {
    try {
      const respuesta = await axios.get(`${API_BASE}/metricas`);
      setMetricas(respuesta.data);
    } catch (error) {
      console.error('Error al cargar métricas:', error);
    }
  };

 
  const entrenarModelo = async () => {
    setCargando(true);
    setErrorMensaje('');

    try {
      const respuesta = await axios.post(`${API_BASE}/entrenar`);

      const nuevoMensaje = {
        tipo: 'bot',
        contenido: '✓ Modelo entrenado correctamente. Ahora puedo responder tus preguntas.',
        timestamp: new Date()
      };

      setMensajes(prev => [...prev, nuevoMensaje]);
      setModeloEntrenado(true);
      
      await cargarMetricas();

    } catch (error) {
      setErrorMensaje('Error al entrenar el modelo. Intenta de nuevo.');
      console.error('Error:', error);
    } finally {
      setCargando(false);
    }
  };


   
  const enviarPregunta = async (e) => {
    e.preventDefault();


    if (!preguntaActual.trim()) return;

    if (!modeloEntrenado) {
      setErrorMensaje('Primero debes entrenar el modelo. Haz clic en "Entrenar Modelo".');
      return;
    }

    const mensajeUsuario = {
      tipo: 'usuario',
      contenido: preguntaActual,
      timestamp: new Date()
    };

    setMensajes(prev => [...prev, mensajeUsuario]);
    setPreguntaActual('');
    setCargando(true);
    setErrorMensaje('');

    try {
  
      const respuesta = await axios.post(`${API_BASE}/chatbot`, {
        pregunta: preguntaActual
      });

  
      const mensajeBot = {
        tipo: 'bot',
        contenido: respuesta.data.respuesta,
        confianza: respuesta.data.confianza,
        timestamp: new Date()
      };

      setMensajes(prev => [...prev, mensajeBot]);

    } catch (error) {

      const mensajeError = {
        tipo: 'bot',
        contenido: 'Lo siento, hubo un error. Intenta de nuevo.',
        timestamp: new Date()
      };
      setMensajes(prev => [...prev, mensajeError]);
      console.error('Error:', error);
    } finally {
      setCargando(false);
    }
  };


  const limpiarChat = () => {
    setMensajes([
      {
        tipo: 'bot',
        contenido: 'Historial borrado. ¿Hay algo más que quieras saber?',
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="contenedor-principal">

      <header className="encabezado">
        <div className="info-encabezado">
          <h1>. Chatbot Educativo</h1>
          <p>Asistente IA para Programación en Python</p>
        </div>
        <div className="botones-encabezado">
          {!modeloEntrenado && (
            <button
              onClick={entrenarModelo}
              disabled={cargando}
              className="boton boton-entrenar"
            >
              {cargando ? ' Entrenando...' : ' Entrenar Modelo'}
            </button>
          )}
          {modeloEntrenado && metricas && (
            <div className="metricas-mini">
              <span>✓ Modelo: {metricas.exactitud}% preciso</span>
            </div>
          )}
        </div>
      </header>

      <div className="area-chat">
        <div className="historial-mensajes">
          {mensajes.map((msg, idx) => (
            <div
              key={idx}
              className={`mensaje ${msg.tipo === 'usuario' ? 'usuario' : 'bot'}`}
            >
              <div className="contenido-mensaje">
                {msg.tipo === 'usuario' ? '👤' : '🤖'}
              </div>
              <div className="burbuja-mensaje">
                <p>{msg.contenido}</p>
              </div>
            </div>
          ))}
          {cargando && (
            <div className="mensaje bot">
              <div className="contenido-mensaje">🤖</div>
              <div className="burbuja-mensaje">
                <p className="escribiendo">Escribiendo...</p>
              </div>
            </div>
          )}
          <div ref={finalDelChat} />
        </div>
      </div>

      {errorMensaje && (
        <div className="error-banner">
          {errorMensaje}
        </div>
      )}

      <footer className="pie-chat">
        <form onSubmit={enviarPregunta} className="formulario">
          <input
            type="text"
            value={preguntaActual}
            onChange={(e) => setPreguntaActual(e.target.value)}
            placeholder={
              modeloEntrenado
                ? "Escribe tu pregunta aquí..."
                : "Primero entrena el modelo..."
            }
            disabled={cargando || !modeloEntrenado}
            className="input-pregunta"
          />
          <button
            type="submit"
            disabled={cargando || !modeloEntrenado || !preguntaActual.trim()}
            className="boton boton-enviar"
          >
            Enviar
          </button>
          <button
            type="button"
            onClick={limpiarChat}
            className="boton boton-limpiar"
          >
            Limpiar
          </button>
        </form>
      </footer>

      {modeloEntrenado && metricas && (
        <div className="panel-metricas">
          <p>Exactitud: {metricas.exactitud}% | Preguntas: {metricas.preguntas_entrenamiento}</p>
        </div>
      )}
    </div>
  );
}

export default App;
