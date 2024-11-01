import { db } from '../lib/dbConnect.js'; // Подключение к базе данных
import { ObjectId } from 'mongodb'; // Импорт ObjectId для работы с идентификаторами MongoDB
import bcrypt from 'bcrypt'; // Импорт хеширования паролей

const collection = db.collection('users'); // Выбираем коллекцию пользователей

// Получение пользователя по ID
export const getUser = async (req, res, next) => {
	try {
		const query = { _id: new ObjectId(req.params.id) };
		const user = await collection.findOne({
			_id: new ObjectId(req.params.id),
		}); /* req.params.id: это значение параметра id, переданного в URL (например, /users/12345).
		ObjectId(req.params.id): преобразует строку в формат идентификатора MongoDB. */
		if (!user) {
			/* Если юзер не найден */
			return res.status(404).json({ message: 'User not found' });
		}
		res.status(200).json(user);
	} catch (error) {
		next({
			status: 500,
			error,
		}); /* Отправка кода ошибки прописанной в middleware */
	}
};

// Обновление пользователя
export const updateUser = async (req, res, next) => {
	if (req.user.id !== req.params.id) {
		return next({
			status: 401,
			message: 'You can only update your own account',
		});
	}
	try {
		if (req.body.password) {
			/* Если в запросе есть пароль, хешируем его */
			req.body.password = await bcrypt.hash(req.body.password, 10);
		}
		const updatedUser = await collection.findOneAndUpdate(
			{ _id: new ObjectId(req.params.id) }, // Поиск пользователя по ID
			{ $set: { ...req.body, updatedAt: new Date().toISOString() } }, // Обновляем данные пользователя
			{ returnDocument: 'after' }
		);
		res.status(200).json(updatedUser.value); // Возвращаем обновлённого пользователя
	} catch (error) {
		res.status(500).json({ error: 'Failed to update user' });
	}
};

// Удаление пользователя
export const deleteUser = async (req, res, next) => {
	if (req.user.id !== req.params.id) {
		return next({
			status: 401,
			message: 'You can only deletes your own account',
		});
	}
	try {
		await collection.deleteOne({ _id: new ObjectId(req.params.id) }); // Удаление пользователя по ID
		res.status(200).json({ message: 'User deleted successfully' });
	} catch (error) {
		res.status(500).json({ error: 'Failed to delete user' });
	}
};

// Тестовая функция для получения всех пользователей
export const test = async (req, res) => {
	try {
		const results = await collection
			.find({})
			.toArray(); /* find({}): находит всех пользователей в коллекции (передаём пустой объект, что означает "найти всех"). */
		res.status(200).json(results);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch users' });
	}
};
