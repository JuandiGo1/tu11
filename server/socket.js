import Sala from './models/Sala.js';
import { agregarJugadorASala } from './utils/salasUtils.js';

const salasActivas = new Map(); // En memoria para conexiones

export default function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log('🔌 Nuevo cliente conectado:', socket.id);

    // Unirse a una sala
    socket.on('unirseSala', async ({ codigoSala, jugador }) => {

      console.log(`🎮 ${jugador.nickname} quiere unirse a la sala ${codigoSala}`);

      try {
        const sala = await Sala.findOne({ codigo: codigoSala });
        

        if (!sala) {
          socket.emit('errorSala', error || 'La sala no existe');
          return;
        }

        const jugadorYaEnSala = sala.jugadores.some(j => j.nickname === jugador.nickname);
        if (jugadorYaEnSala) {
          socket.emit('errorSala', 'Ya estás en la sala');
          return;
        }

        if (sala.jugadores.length >= 2) {
          socket.emit('errorSala', 'La sala ya está llena');
          return;
        }

        const { sala: salaActualizada, error, status } = await agregarJugadorASala(codigoSala, jugador);


        // Join room socket.io
        socket.join(codigoSala);
        if(salaActualizada.jugadores.length === 2) {
          io.to(codigoSala).emit('juegoListo');
          console.log(`Evento juegoListo emitido a la sala ${codigoSala}`)
        }

        // Agregar jugador a memoria
        if (!salasActivas.has(codigoSala)) {
          salasActivas.set(codigoSala, []);
        }
        const jugadoresConectados = salasActivas.get(codigoSala);
        jugadoresConectados.push({ id: socket.id, nickname: jugador.nickname, avatar: jugador.avatar });
        salasActivas.set(codigoSala, jugadoresConectados);

        // Emitir actualización de jugadores
        io.to(codigoSala).emit('jugadorUnido', {
          nickname: jugador.nickname,
          avatar: jugador.avatar,
          jugadores: jugadoresConectados
        });

        

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
    socket.on('disconnect', async () => {
      console.log('⛔ Cliente desconectado:', socket.id);

      try {
        for (const [codigoSala, jugadores] of salasActivas.entries()) {
          // Buscar al jugador desconectado en la sala
          const jugadorDesconectado = jugadores.find(j => j.id === socket.id);

          if (jugadorDesconectado) {
            // Eliminar al jugador de la lista en memoria
            const jugadoresActualizados = jugadores.filter(j => j.id !== socket.id);
            salasActivas.set(codigoSala, jugadoresActualizados);

            // Buscar la sala en la base de datos
            const sala = await Sala.findOne({ codigo: codigoSala });

            if (sala) {
              // Eliminar al jugador de la sala en la base de datos
              sala.jugadores = sala.jugadores.filter(j => j.nickname !== jugadorDesconectado.nickname);

              // Si no quedan jugadores, eliminar la sala
              if (sala.jugadores.length === 0) {
                await Sala.deleteOne({ codigo: codigoSala });
                salasActivas.delete(codigoSala); // Eliminar la sala de memoria
                console.log(`🗑️ Sala ${codigoSala} eliminada porque no quedan jugadores`);
              } else {
                // Guardar los cambios en la sala
                await sala.save();
                console.log(`👤 Jugador ${jugadorDesconectado.nickname} salió de la sala ${codigoSala}`);
              }

              // Emitir evento de jugador desconectado a los demás jugadores
              io.to(codigoSala).emit('jugadorDesconectado', {
                nickname: jugadorDesconectado.nickname,
                jugadores: jugadoresActualizados
              });
            }
          }
        }
      } catch (err) {
        console.error('❌ Error al manejar la desconexión:', err);
      }
    });
  });
}
