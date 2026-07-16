import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import InteractiveOwl from './components/InteractiveOwl';
import './App.css';

const STORAGE_KEY = 'polibot_conversaciones_v1';
const API_BASE = 'http://localhost:5000/api';

const mensajeBienvenida = () => ([
  {
    tipo: 'bot',
    contenido: 'Bienvenido al asistente educativo. Estoy listo para ayudarte con preguntas académicas. ¿En qué puedo colaborar hoy?',
    timestamp: new Date().toISOString(),
  },
]);

const generarId = () => `conv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const crearConversacion = () => ({
  id: generarId(),
  titulo: 'Nueva conversación',
  mensajes: mensajeBienvenida(),
  actualizadoEn: Date.now(),
});

const cargarConversacionesGuardadas = () => {
  try {
    const crudo = localStorage.getItem(STORAGE_KEY);
    const parseado = crudo ? JSON.parse(crudo) : [];
    if (Array.isArray(parseado) && parseado.length > 0) return parseado;
  } catch (error) {
    console.error('No se pudo leer el historial guardado:', error);
  }
  return [crearConversacion()];
};

function App() {
  const [conversaciones, setConversaciones] = useState(() => cargarConversacionesGuardadas());
  const [conversacionActivaId, setConversacionActivaId] = useState(() => conversaciones[0]?.id);
  const [mensajes, setMensajes] = useState(() => conversaciones[0]?.mensajes || mensajeBienvenida());
  const [preguntaActual, setPreguntaActual] = useState('');
  const [cargando, setCargando] = useState(true);
  const [metricas, setMetricas] = useState(null);
  const [modeloEntrenado, setModeloEntrenado] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState('');
  const [robotState, setRobotState] = useState('idle');
  const [servidorDisponible, setServidorDisponible] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const finalDelChat = useRef(null);

  useEffect(() => {
    verificarServidor();
  }, []);

  useEffect(() => {
    if (finalDelChat.current) {
      finalDelChat.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [mensajes]);

  useEffect(() => {
    if (!conversacionActivaId) return;

    setConversaciones(prev => {
      const actualizadas = prev.map(conv => {
        if (conv.id !== conversacionActivaId) return conv;

        const primerMensajeUsuario = mensajes.find(m => m.tipo === 'usuario');
        const titulo = primerMensajeUsuario
          ? primerMensajeUsuario.contenido.slice(0, 42) + (primerMensajeUsuario.contenido.length > 42 ? '…' : '')
          : 'Nueva conversación';

        return { ...conv, mensajes, titulo, actualizadoEn: Date.now() };
      });

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(actualizadas));
      } catch (error) {
        console.error('No se pudo guardar el historial:', error);
      }

      return actualizadas;
    });
  }, [conversacionActivaId, mensajes]);

  const verificarServidor = async () => {
    try {
      setErrorMensaje('');
      const respuesta = await axios.get(`${API_BASE}/health`);
      setServidorDisponible(true);
      if (respuesta.data.modelo_cargado) {
        setModeloEntrenado(true);
        await cargarMetricas();
      } else {
        setModeloEntrenado(false);
      }
    } catch (error) {
      setServidorDisponible(false);
      setErrorMensaje('No se pudo conectar con el backend. Verifica que el servidor esté corriendo en el puerto 5000.');
      console.error('Error al verificar el servidor:', error);
    } finally {
      setCargando(false);
    }
  };

  const cargarMetricas = async () => {
    try {
      const respuesta = await axios.get(`${API_BASE}/metrics`);
      setMetricas(respuesta.data);
    } catch (error) {
      console.error('Error al cargar métricas:', error);
    }
  };

  const enviarPregunta = async (event) => {
    event.preventDefault();

    const textoPregunta = preguntaActual.trim();
    if (!textoPregunta) return;

    const mensajeUsuario = {
      tipo: 'usuario',
      contenido: textoPregunta,
      timestamp: new Date().toISOString(),
    };

    setMensajes(prev => [...prev, mensajeUsuario]);
    setPreguntaActual('');
    setCargando(true);
    setRobotState('thinking');
    setErrorMensaje('');

    try {
      const respuesta = await axios.post(`${API_BASE}/chat`, { mensaje: textoPregunta });
      const mensajeBot = {
        tipo: 'bot',
        contenido: respuesta.data.respuesta,
        confianza: respuesta.data.confianza,
        timestamp: new Date().toISOString(),
      };
      setMensajes(prev => [...prev, mensajeBot]);
      setRobotState('happy');
      setTimeout(() => setRobotState('idle'), 2500);
    } catch (error) {
      setMensajes(prev => [...prev, {
        tipo: 'bot',
        contenido: 'No fue posible procesar la pregunta en este momento. Intenta de nuevo.',
        timestamp: new Date().toISOString(),
      }]);
      setRobotState('idle');
      console.error('Error al consultar:', error);
    } finally {
      setCargando(false);
    }
  };

  const limpiarChat = () => {
    setMensajes([{ tipo: 'bot', contenido: 'Conversación reiniciada. ¿En qué más puedo ayudarte?', timestamp: new Date().toISOString() }]);
  };

  const iniciarNuevaConversacion = () => {
    const nueva = crearConversacion();
    setConversaciones(prev => {
      const actualizadas = [nueva, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(actualizadas));
      } catch (error) {
        console.error('No se pudo guardar el historial:', error);
      }
      return actualizadas;
    });
    setConversacionActivaId(nueva.id);
    setMensajes(nueva.mensajes);
    setErrorMensaje('');
    setSidebarOpen(false);
  };

  const cambiarConversacion = (id) => {
    if (id === conversacionActivaId) return;
    const conv = conversaciones.find(c => c.id === id);
    if (!conv) return;
    setConversacionActivaId(id);
    setMensajes(conv.mensajes);
    setErrorMensaje('');
    setSidebarOpen(false);
  };

  const eliminarConversacion = (id, event) => {
    event.stopPropagation();
    setConversaciones(prev => {
      const restantes = prev.filter(c => c.id !== id);
      const finales = restantes.length > 0 ? restantes : [crearConversacion()];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(finales));
      } catch (error) {
        console.error('No se pudo guardar el historial:', error);
      }

      if (id === conversacionActivaId) {
        setConversacionActivaId(finales[0].id);
        setMensajes(finales[0].mensajes);
      }

      return finales;
    });
  };

  const conversacionesOrdenadas = [...conversaciones].sort((a, b) => b.actualizadoEn - a.actualizadoEn);

  return (
    <div className="app-container">
      <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? 'Cerrar panel' : 'Panel'}
      </button>

      <aside className={`nav-col ${sidebarOpen ? 'open' : ''}`}>
        <div className="nav-brand">
          <div className="nav-brand-icon">
            <InteractiveOwl state="idle" size={34} showStatus={false} />
          </div>
          <div>
            <h2>PoliBot</h2>
            <p>Asistente Educativo</p>
          </div>
        </div>

        <div className="section-card nav-status-card">
          <h3>Rendimiento</h3>
          {servidorDisponible ? (
            <>
              <div className="metric-row">
                <span>Exactitud:</span>
                <strong>{metricas ? ((metricas.accuracy || metricas.accuracy_train || 0) * 100).toFixed(1) + '%' : '0.0%'}</strong>
              </div>
              <div className="metric-bar-container">
                <div className="metric-bar" style={{ width: `${metricas ? (metricas.accuracy || metricas.accuracy_train || 0) * 100 : 0}%` }}></div>
              </div>
              <div className="metric-row">
                <span>Muestras de ent.:</span>
                <strong>{metricas ? metricas.n_ejemplos : 'N/A'}</strong>
              </div>
              <div className="metric-row" style={{ marginTop: '4px' }}>
                <span>Estado:</span>
                <span className={`badge-${modeloEntrenado ? 'active' : 'inactive'}`}>{modeloEntrenado ? 'Activo' : 'Inactivo'}</span>
              </div>
            </>
          ) : (
            <div className="no-metrics">
              <p>Esperando ejecución...</p>
              <span className="badge-inactive">Inactivo</span>
            </div>
          )}
        </div>
      </aside>

      <section className="scene-col">
        <div className={`scene-status-badge ${robotState}`}>
          <span className="status-dot" />
          {robotState === 'thinking' ? 'PoliBúho pensando' : 'PoliBúho activo'}
        </div>

        <div className="scene-card history-scene-card">
          <div className="scene-backdrop history-backdrop">
            <div className="scene-moon" />
            <div className="scene-owl-watermark">
              <InteractiveOwl state={robotState} size={230} showStatus={false} />
            </div>

            <div className="history-overlay">
              <button type="button" className="btn-secondary btn-new-chat" onClick={iniciarNuevaConversacion}>
                + Nueva conversación
              </button>

              <div className="nav-history">
                <div className="nav-history-header">
                  <h3>Historial</h3>
                  <span className="nav-history-hint">Se guarda en este navegador</span>
                </div>
                <div className="nav-history-list">
                  {conversacionesOrdenadas.map(conv => (
                    <div key={conv.id} className={`history-item ${conv.id === conversacionActivaId ? 'active' : ''}`} onClick={() => cambiarConversacion(conv.id)}>
                      <span className="history-item-title">{conv.titulo}</span>
                      <button type="button" className="history-item-delete" onClick={(event) => eliminarConversacion(conv.id, event)} aria-label="Eliminar conversación">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="chat-col">
        <header className="chat-header">
          <div className="header-robot-wrapper">
            <InteractiveOwl state={robotState} size={44} showStatus={false} />
          </div>
          <div className="header-text">
            <h1>Asistente Educativo</h1>
            <p>Aprendizaje asistido por IA · Todas las materias</p>
          </div>
          {modeloEntrenado && metricas && (
            <div className="header-badge">
              Modelo: {((metricas.accuracy || metricas.accuracy_train || 0) * 100).toFixed(1)}% Acc
            </div>
          )}
        </header>

        {errorMensaje && (
          <div className="error-banner">
            <span>[!]</span> {errorMensaje}
          </div>
        )}

        <section className="messages-container">
          {mensajes.map((msg, index) => (
            <div key={index} className={`message-bubble ${msg.tipo === 'usuario' ? 'user' : 'bot'}`}>
              <div className="bubble-content">
                <p>{msg.contenido}</p>
              </div>
            </div>
          ))}
          {cargando && (
            <div className="message-bubble bot">
              <div className="bubble-content">
                <p className="escribiendo">Procesando, un momento...</p>
              </div>
            </div>
          )}
          <div ref={finalDelChat} />
        </section>

        <footer className="footer-area">
          <form onSubmit={enviarPregunta} className="input-area">
            <input
              type="text"
              value={preguntaActual}
              onChange={(event) => setPreguntaActual(event.target.value)}
              placeholder={servidorDisponible ? 'Escribe tu pregunta...' : 'Esperando al servidor...'}
              disabled={cargando || !servidorDisponible}
              className="input-pregunta"
            />
            <button type="submit" disabled={cargando || !servidorDisponible || !preguntaActual.trim()} className="btn-send">
              Enviar
            </button>
            <button type="button" onClick={limpiarChat} className="btn-clear">
              Limpiar
            </button>
          </form>
          {modeloEntrenado && metricas && (
            <div className="footer-metrics">
              Métricas activas: {((metricas.accuracy || metricas.accuracy_train || 0) * 100).toFixed(1)}% Exactitud | Dataset: {metricas.n_ejemplos} ejemplos
            </div>
          )}
        </footer>
      </main>
    </div>
  );
}

export default App;