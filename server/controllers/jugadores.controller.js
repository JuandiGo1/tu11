
import axios from 'axios';

export const buscarJugadores = async (req, res) => {
  const { nombre } = req.query;
  if (!nombre) return res.status(400).json({ error: 'Falta el nombre a buscar' });

  try {
    const response = await axios.get(`https://www.thesportsdb.com/api/v1/json/1/searchplayers.php?p=${encodeURIComponent(nombre)}`);
    const jugadores = response.data.player || [];

    //mostrar solo jugadores de fútbol
    const jugadoresFiltrados = jugadores.filter(j => j.strSport === 'Soccer');

    res.json(jugadoresFiltrados);
  } catch (error) {
    console.error('Error buscando jugadores:', error.message);
    res.status(500).json({ error: 'Error al buscar jugadores' });
  }
};
