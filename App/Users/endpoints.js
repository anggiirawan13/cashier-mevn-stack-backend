import express from 'express';
import { index, show, store, update, removeU, removeUser } from './services.js';

var router = express.Router();

router.get('/', index);
router.get('/:id', show);
router.post('/', store);
router.put('/:id', update);
router.delete('/:id', removeUser);

export default router;