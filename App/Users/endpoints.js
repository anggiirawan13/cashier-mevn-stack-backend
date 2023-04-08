import express from 'express';
import jwtAuth from '../../middlewares/jwtAuth.js';
import roleAuth from '../../middlewares/roleAuth.js';
import { index, details } from './read/services.js';
import store from './store/services.js';
import update from './update/services.js';
import destroy from './destroy/services.js';
import handleHacking from '../../middlewares/hacking.js';

let router = express.Router();
router.get('/', [handleHacking(), jwtAuth(), roleAuth(['admin'])], index);
router.get('/:id', [handleHacking(), jwtAuth(), roleAuth(['admin'])], details);
router.post('/', [handleHacking(), jwtAuth(), roleAuth(['admin'])], store);
router.put('/:id', [handleHacking(), jwtAuth(), roleAuth(['admin'])], update);
router.delete('/:id', [handleHacking(), jwtAuth(), roleAuth(['admin'])], destroy);

export default router;