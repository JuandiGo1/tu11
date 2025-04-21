
const salasActivas = new Map(); // Guarda salas y sus jugadores conectados

export default function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log('🔌 Nuevo cliente conectado:', socket.id);

    // El cliente quiere unirse a una sala
    socket.on('unirseSala', ({ codigoSala, nickname, avatar }) => {
      console.log(`🎮 ${nickname} quiere unirse a la sala ${codigoSala}`);

      socket.join(codigoSala); // Se une a una sala en socket.io

      // Guardamos al jugador en nuestra estructura de datos
      if (!salasActivas.has(codigoSala)) {
        salasActivas.set(codigoSala, []);
      }

      const jugadores = salasActivas.get(codigoSala);
      jugadores.push({ id: socket.id, nickname, avatar });
      salasActivas.set(codigoSala, jugadores);

      // Notificamos a todos en la sala que llegó un nuevo jugador
      io.to(codigoSala).emit('jugadorUnido', { nickname, avatar, jugadores });
    });

    // Cuando se selecciona un jugador para el equipo
    socket.on('jugadorSeleccionado', ({ codigoSala, jugador }) => {
      // Transmitimos a todos en la sala que se ha seleccionado un jugador
      io.to(codigoSala).emit('jugadorSeleccionado', jugador);
    });

    // Cuando alguien se desconecta
    socket.on('disconnect', () => {
      console.log('⛔ Cliente desconectado:', socket.id);

      // Quitarlo de todas las salas
      for (const [codigoSala, jugadores] of salasActivas.entries()) {
        const actualizados = jugadores.filter(j => j.id !== socket.id);
        if (actualizados.length === 0) {
          salasActivas.delete(codigoSala); // borra la sala si queda vacía
        } else {
          salasActivas.set(codigoSala, actualizados);
          io.to(codigoSala).emit('jugadorDesconectado', { id: socket.id });
        }
      }
    });
  });
}
