import {Router} from 'express';
import { buscarJugadores, obtenerInfoJugador } from '../controllers/jugadores.controller.js';

const playerRoutes = Router();

playerRoutes.get('/buscar', buscarJugadores);
playerRoutes.get('/info/:idJugador', obtenerInfoJugador);

export default playerRoutes;
