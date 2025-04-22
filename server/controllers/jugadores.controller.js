import axios from 'axios';

export const buscarJugadores = async (req, res) => {
  const { nombre } = req.query;
  if (!nombre) return res.status(400).json({ error: 'Falta el nombre a buscar' });

  try {
    const response = await axios.get(`https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(nombre)}`);
    const jugadores = response.data.player || [];

    //mostrar solo jugadores de fútbol
    const jugadoresFiltrados = jugadores.filter(j => j.strSport === 'Soccer');


    res.json(jugadoresFiltrados);
  } catch (error) {
    console.error('Error buscando jugadores:', error.message);
    res.status(500).json({ error: 'Error al buscar jugadores' });
  }
};

// Buscar valor de mercado en Transfermarkt
export const obtenerInfoJugador = async (req, res) => {
  const { idJugador } = req.params; 

  if (!idJugador) return res.status(400).json({ error: 'Falta el ID del jugador' });
  try {
    // Primera petición: obtener el idTransferMkt desde TheSportsDB
    const response = await axios.get(`https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${idJugador}`);
    const jugador = response.data.players[0];
    const idTFMK = response.data.players[0]?.idTransferMkt; // id de Transfermarkt

    if (!jugador) return res.status(404).json({ error: 'Jugador no encontrado' });

    if (!idTFMK) return { error: 'No se encontró el id de Transfermarkt' };

    // Segunda petición: obtener el valor de mercado desde Transfermarkt API
    const marketValueResponse = await axios.get(`https://transfermarkt-api.fly.dev/players/${idTFMK}/market_value`);
    const marketValue = marketValueResponse.data?.marketValue;

    if (!marketValue) return { error: 'No se encontró el valor de mercado' };

    return res.json({ jugador, marketValue });
  } catch (error) {
    console.error('Error al obtener jugador:', error.message);
    return { error: 'Error al obtener jugador' };
  }
};


