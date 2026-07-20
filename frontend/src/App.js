import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import InteractiveOwl from './components/InteractiveOwl';
import './App.css';

const STORAGE_KEY = 'polibot_conversaciones_v1';
const DEV_MODE_KEY = 'polibot_modo_dev';

const mensajeBienvenida = () => ([
  {
    tipo: 'bot',
    contenido: 'Bienvenido al asistente educativo. Estoy programado para resolver tus consultas académicas de distintas materias. ¿En qué puedo ayudarte hoy?',
    timestamp: new Date().toISOString()
  }
]);

const generarId = () => `conv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const crearConversacion = () => ({
  id: generarId(),
  titulo: 'Nueva conversación',
  mensajes: mensajeBienvenida(),
  actualizadoEn: Date.now()
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
  const [cargando, setCargando] = useState(false);
  const [metricas, setMetricas] = useState(null);
  const [modeloEntrenado, setModeloEntrenado] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false); // toggle del panel lateral en móvil
  const [configOpen, setConfigOpen] = useState(false); // desplegable de hiperparámetros

  // Modo desarrollador: oculto para el usuario normal, se activa haciendo
  // clic 5 veces seguidas sobre el ícono del búho en el panel lateral.
  const [modoDesarrollador, setModoDesarrollador] = useState(
    () => localStorage.getItem(DEV_MODE_KEY) === 'true'
  );
  const clicksMarcaRef = useRef(0);
  const clicksTimeoutRef = useRef(null);

  const [robotState, setRobotState] = useState('idle');
  const [epochs, setEpochs] = useState(100);
  const [lr, setLr] = useState(0.01);

  const finalDelChat = useRef(null);
  const API_BASE = 'http://localhost:5000/api';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mensajes]);

  const verificarServidor = async () => {
    try {
      setErrorMensaje('');
      const respuesta = await axios.get(`${API_BASE}/health`);

      if (respuesta.data.modelo_cargado === true) {
        setModeloEntrenado(true);
        await cargarMetricas();
      } else {
        setModeloEntrenado(false);
      }
    } catch (error) {
      setErrorMensaje(
        'Error de conexión: No se pudo establecer comunicación con el servidor. Verifique el estado de Flask.'
      );
      console.error('Error:', error);
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

  const entrenarModelo = async () => {
    setCargando(true);
    setRobotState('thinking');
    setErrorMensaje('');

    try {
      await axios.post(`${API_BASE}/train`, {
        epochs: Number(epochs),
        learning_rate: Number(lr)
      });

      const nuevoMensaje = {
        tipo: 'bot',
        contenido: 'Modelo entrenado exitosamente. El sistema se encuentra listo para procesar peticiones.',
        timestamp: new Date().toISOString()
      };

      setMensajes(prev => [...prev, nuevoMensaje]);
      setModeloEntrenado(true);
      setRobotState('happy');

      await cargarMetricas();
      setTimeout(() => setRobotState('idle'), 3000);

    } catch (error) {
      setErrorMensaje('Excepción en el proceso: Error al entrenar el modelo. Reintente el proceso.');
      setRobotState('idle');
      console.error('Error:', error);
    } finally {
      setCargando(false);
    }
  };

  const enviarPregunta = async (e) => {
    e.preventDefault();

    if (!preguntaActual.trim()) return;

    if (!modeloEntrenado) {
      setErrorMensaje('El asistente aún no está disponible. Intenta de nuevo en unos minutos.');
      return;
    }

    const mensajeUsuario = {
      tipo: 'usuario',
      contenido: preguntaActual,
      timestamp: new Date().toISOString()
    };

    setMensajes(prev => [...prev, mensajeUsuario]);
    setPreguntaActual('');
    setCargando(true);
    setRobotState('thinking');
    setErrorMensaje('');

    try {
      const respuesta = await axios.post(`${API_BASE}/chat`, {
        pregunta: preguntaActual
      });

      const mensajeBot = {
        tipo: 'bot',
        contenido: respuesta.data.respuesta,
        confianza: respuesta.data.confianza,
        timestamp: new Date().toISOString()
      };

      setMensajes(prev => [...prev, mensajeBot]);
      setRobotState('happy');

      setTimeout(() => setRobotState('idle'), 2500);

    } catch (error) {
      const mensajeError = {
        tipo: 'bot',
        contenido: 'Error en la petición de consulta. Por favor, reenvíe su pregunta.',
        timestamp: new Date().toISOString()
      };
      setMensajes(prev => [...prev, mensajeError]);
      setRobotState('idle');
      console.error('Error:', error);
    } finally {
      setCargando(false);
    }
  };

  const limpiarChat = () => {
    setMensajes([
      {
        tipo: 'bot',
        contenido: 'Conversación reiniciada. ¿En qué más puedo ayudarte?',
        timestamp: new Date().toISOString()
      }
    ]);
  };

  // Historial de conversaciones
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

  const eliminarConversacion = (id, e) => {
    e.stopPropagation();

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

  //Modo desarrollador oculto

  const manejarClicMarca = () => {
    clicksMarcaRef.current += 1;

    if (clicksTimeoutRef.current) clearTimeout(clicksTimeoutRef.current);
    clicksTimeoutRef.current = setTimeout(() => {
      clicksMarcaRef.current = 0;
    }, 1500);

    if (clicksMarcaRef.current >= 5) {
      clicksMarcaRef.current = 0;
      setModoDesarrollador(prev => {
        const nuevo = !prev;
        localStorage.setItem(DEV_MODE_KEY, String(nuevo));
        if (!nuevo) setConfigOpen(false);
        return nuevo;
      });
    }
  };

  const conversacionesOrdenadas = [...conversaciones].sort(
    (a, b) => b.actualizadoEn - a.actualizadoEn
  );

  return (
    <div className="app-container three-col">
      {/* Botón de control móvil para abrir el panel lateral */}
      <button
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? 'Cerrar panel' : 'Panel'}
      </button>

      {/* COLUMNA 1: NAV + HISTORIAL + CONFIGURACIÓN (oculta) */}
      <aside className={`nav-col ${sidebarOpen ? 'open' : ''}`}>
        <div className="nav-brand">
          <div
            className="nav-brand-icon"
            onClick={manejarClicMarca}
            title=""
          >
            <InteractiveOwl state="idle" size={34} showStatus={false} />
          </div>
          <div>
            <h2>PoliBot</h2>
            <p>Asistente Educativo{modoDesarrollador && <span className="dev-badge">DEV</span>}</p>
          </div>
        </div>

        {modoDesarrollador && (
          <div className="nav-section">
            <button
              type="button"
              className="nav-collapse-toggle"
              onClick={() => setConfigOpen(!configOpen)}
            >
              <span>Configuración avanzada</span>
              <span className={`chevron ${configOpen ? 'open' : ''}`}>⌄</span>
            </button>

            {configOpen && (
              <div className="section-card nav-config-card">
                <div className="input-group">
                  <label>Épocas:</label>
                  <input
                    type="number"
                    value={epochs}
                    onChange={(e) => setEpochs(e.target.value)}
                    disabled={cargando}
                  />
                </div>
                <div className="input-group">
                  <label>Learning Rate (LR):</label>
                  <input
                    type="number"
                    step="0.001"
                    value={lr}
                    onChange={(e) => setLr(e.target.value)}
                    disabled={cargando}
                  />
                </div>

                {!modeloEntrenado ? (
                  <button
                    onClick={entrenarModelo}
                    disabled={cargando}
                    className="btn-secondary btn-train"
                  >
                    {cargando ? 'Entrenando...' : 'Entrenar Modelo'}
                  </button>
                ) : (
                  <button
                    onClick={entrenarModelo}
                    disabled={cargando}
                    className="btn-secondary btn-retrain"
                  >
                    {cargando ? 'Re-entrenando...' : 'Re-entrenar Modelo'}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        <div className="section-card nav-status-card">
          <h3>Rendimiento</h3>
          {modeloEntrenado && metricas ? (
            <>
              <div className="metric-row">
                <span>Exactitud:</span>
                <strong>{metricas.exactitud}%</strong>
              </div>
              <div className="metric-bar-container">
                <div
                  className="metric-bar"
                  style={{ width: `${metricas.exactitud}%` }}
                ></div>
              </div>
              <div className="metric-row">
                <span>Muestras de ent.:</span>
                <strong>{metricas.preguntas_entrenamiento}</strong>
              </div>
              <div className="metric-row" style={{ marginTop: '4px' }}>
                <span>Estado:</span>
                <span className="badge-active">Estable</span>
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

      {/* COLUMNA 2: ESCENARIO DEL BÚHO + HISTORIAL */}
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
              <button
                type="button"
                className="btn-secondary btn-new-chat"
                onClick={iniciarNuevaConversacion}
              >
                + Nueva conversación
              </button>

              <div className="nav-history">
                <div className="nav-history-header">
                  <h3>Historial</h3>
                  <span className="nav-history-hint">Se guarda en este navegador</span>
                </div>
                <div className="nav-history-list">
                  {conversacionesOrdenadas.map(conv => (
                    <div
                      key={conv.id}
                      className={`history-item ${conv.id === conversacionActivaId ? 'active' : ''}`}
                      onClick={() => cambiarConversacion(conv.id)}
                    >
                      <span className="history-item-title">{conv.titulo}</span>
                      <button
                        type="button"
                        className="history-item-delete"
                        onClick={(e) => eliminarConversacion(conv.id, e)}
                        aria-label="Eliminar conversación"
                      >
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

      {/* COLUMNA 3: CHAT */}
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
              Modelo: {metricas.exactitud}% Acc
            </div>
          )}
        </header>

        {errorMensaje && (
          <div className="error-banner">
            <span>[!]</span> {errorMensaje}
          </div>
        )}

        <section className="messages-container">
          {mensajes.map((msg, idx) => (
            <div
              key={idx}
              className={`message-bubble ${msg.tipo === 'usuario' ? 'user' : 'bot'}`}
            >
              <div className="bubble-content">
                <div>
                  <p>{msg.contenido}</p>
                </div>
              </div>
            </div>
          ))}
          {cargando && !modeloEntrenado && (
            <div className="message-bubble bot">
              <div className="bubble-content">
                <p className="escribiendo">Preparando al asistente, un momento...</p>
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
              onChange={(e) => setPreguntaActual(e.target.value)}
              placeholder={
                modeloEntrenado
                  ? "Escribe tu pregunta..."
                  : "El asistente se está preparando..."
              }
              disabled={cargando || !modeloEntrenado}
              className="input-pregunta"
            />
            <button
              type="submit"
              disabled={cargando || !modeloEntrenado || !preguntaActual.trim()}
              className="btn-send"
            >
              Enviar
            </button>
            <button
              type="button"
              onClick={limpiarChat}
              className="btn-clear"
            >
              Limpiar
            </button>
          </form>
          {modeloEntrenado && metricas && (
            <div className="footer-metrics">
              Métricas activas: {metricas.exactitud}% Exactitud | Dataset: {metricas.preguntas_entrenamiento} intenciones
            </div>
          )}
        </footer>
      </main>
    </div>
  );
}

export default App;