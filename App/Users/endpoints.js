import express from 'express';
import { index, show, store, update, destroy } from './services.js';

var router = express.Router();

router.get('/', index);
router.get('/:id', show);
router.post('/', store);
router.put('/:id', update);
router.delete('/:id', destroy);

export default router;