import {Router} from 'express';
import { crearSala, unirseASala, obtenerSala } from '../controllers/sala.controller.js';

const router = Router();

router.post('/crear', crearSala);
router.post('/unirse', unirseASala);
router.get('/:codigo', obtenerSala);

export default router;
