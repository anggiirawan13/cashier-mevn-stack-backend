import express from 'express';
import { index, show, store, update, destroy } from './services.js';
import jwtAuth from '../../middlewares/jwtAuth.js';
import roleAuth from '../../middlewares/roleAuth.js';

var router = express.Router();

router.get('/', [jwtAuth(), roleAuth(['admin', 'cashier'])], index);
router.get('/:id', [jwtAuth(), roleAuth(['admin', 'cashier'])], show);
router.post('/', [jwtAuth(), roleAuth(['admin', 'cashier'])], store);
router.put('/:id', [jwtAuth(), roleAuth(['admin', 'cashier'])], update);
router.delete('/:id', [jwtAuth(), roleAuth(['admin', 'cashier'])], destroy);

export default router;