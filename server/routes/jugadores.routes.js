import {Router} from 'express';
import { buscarJugadores } from '../controllers/jugadores.controller.js';

const routerJug = Router();

routerJug.get('/buscar', buscarJugadores);

export default routerJug;
