import express from 'express';
import { create, remove, removeAll, all, uploadImage } from '../controllers/userController.js';

export const router = express.Router();

router.post('/create', uploadImage, create);
router.get('/all', all);
router.delete('/remove/:id', remove);
router.delete('/all', removeAll);
