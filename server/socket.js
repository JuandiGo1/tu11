import Sala from './models/Sala.js';
import { agregarJugadorASala } from './utils/salasUtils.js';

const salasActivas = new Map(); // En memoria para conexiones

export default function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log('🔌 Nuevo cliente conectado:', socket.id);

    // Unirse a una sala
    socket.on('unirseSala', async ({ codigoSala, nickname, avatar }) => {
      console.log(`🎮 ${nickname} quiere unirse a la sala ${codigoSala}`);

      try {
        const { sala, error, status } = await agregarJugadorASala(codigoSala, { nickname, avatar });

        if (!sala) {
          socket.emit('errorSala', error || 'La sala no existe');
          return;
        }

        if (sala.jugadores.length >= 2) {
          socket.emit('errorSala', 'La sala ya está llena');
          return;
        }

        // Join room socket.io
        socket.join(codigoSala);

        // Agregar jugador a memoria
        if (!salasActivas.has(codigoSala)) {
          salasActivas.set(codigoSala, []);
        }
        const jugadoresConectados = salasActivas.get(codigoSala);
        jugadoresConectados.push({ id: socket.id, nickname, avatar });
        salasActivas.set(codigoSala, jugadoresConectados);

        // Emitir actualización de jugadores
        io.to(codigoSala).emit('jugadorUnido', {
          nickname,
          avatar,
          jugadores: jugadoresConectados
        });

        // Si ya hay 2, avisar que el juego puede comenzar
        if (sala.jugadores.length === 2) {
          io.to(codigoSala).emit('juegoListo');
        }

      } catch (err) {
        console.error('❌ Error en unirseSala:', err);
        socket.emit('errorSala', 'Error interno del servidor');
      }
    });

    // Cuando se selecciona un jugador
    socket.on('jugadorSeleccionado', async ({ codigoSala, jugador, turno }) => {
      try {
        // Aquí puedes hacer la lógica de turnos, actualizar Mongo, etc.
        io.to(codigoSala).emit('jugadorSeleccionado', { jugador, turno });
      } catch (err) {
        console.error('❌ Error seleccionando jugador:', err);
      }
    });

    // Desconexión
    socket.on('disconnect', () => {
      console.log('⛔ Cliente desconectado:', socket.id);

      for (const [codigoSala, jugadores] of salasActivas.entries()) {
        const actualizados = jugadores.filter(j => j.id !== socket.id);

        if (actualizados.length === 0) {
          salasActivas.delete(codigoSala); // Eliminar sala si no hay jugadores
        } else {
          salasActivas.set(codigoSala, actualizados);
          io.to(codigoSala).emit('jugadorDesconectado', { id: socket.id });
        }
      }
    });
  });
}
