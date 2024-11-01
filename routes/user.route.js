import express from 'express';

import {
	test,
	getUser,
	updateUser,
	deleteUser,
} from '../controllers/user.controller.js'; /* Импортируем функции для работы с юзерами */

import { verifyToken } from '../lib/middleware.js';

const router = express.Router(); /* Создаём новый маршрутизатор */

// Определение маршрутов

router.get('/', verifyToken, test);
router.get('/:id', verifyToken, getUser); /* маршрут для айди юзера */
router.patch(
	'/update/:id',
	verifyToken,
	updateUser
); /* патч запрос для обновления данных о юзере */
router.delete(
	'/delete/:id',
	verifyToken,
	deleteUser
); /* делит запрос для удаления юзера */

export default router;
