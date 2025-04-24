import {Router} from 'express';
import { crearSala, unirseASala, obtenerSala, salirDeSala } from '../controllers/sala.controller.js';

const router = Router();

router.post('/crear', crearSala);
router.post('/unirse', unirseASala);
router.get('/:codigo', obtenerSala);
router.post('/salir', salirDeSala);

export default router;
