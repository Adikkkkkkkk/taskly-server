import 'dotenv/config';
import { db } from './lib/dbConnect.js';

const users = [
	/* поле с юзерами */
	{
		username: 'yakushin03',
		email: 'aboba228@mail.com',
		password:
			'$2b$10$vD5yRWdxLp1j6riuSi/Ozu71x145viXeGC7AHT5R0WcycGalmYTae' /* Захешированное слово admin */,
		avatar: 'https://g.codewithnathan.com/default-user.png',
		createdAt: new Date().toISOString() /* хранит дату создания */,
		updatedAt: new Date().toISOString() /* Хранит дату обновления */,
	},
	{
		username: 'mikhailov02',
		email: 'katya_one_love@mail.com',
		password:
			'$2b$10$vD5yRWdxLp1j6riuSi/Ozu71x145viXeGC7AHT5R0WcycGalmYTae' /* Захешированное слово admin */,
		avatar: 'https://g.codewithnathan.com/default-user.png',
		createdAt: new Date().toISOString() /* хранит дату создания */,
		updatedAt: new Date().toISOString() /* Хранит дату обновления */,
	},
];

const tasks = [
	{
		name: 'Прочитать книгу "Atomic Habits"',
		description: 'Закончить чтение книги "Atomic Habits" Джеймса Клира',
		priority: 'не срочно',
		due: new Date().toISOString(),
		status: 'открыта',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
	{
		name: 'Изучить стек MERN',
		description:
			'Изучить стек MERN и создать с его помощью полнофункциональное приложение',
		priority: 'срочно',
		due: new Date().toISOString(),
		status: 'открыта',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	},
];

try {
	// Добавление пользователей
	let collection = db.collection('users');
	console.log('[seed]', 'Добавляем пользователей...');
	const result = await collection.insertMany(users);
	console.log(result.insertedIds);
	console.log('[seed]', 'Добавление пользователей завершено');
	// Добавление задач
	tasks[0].owner = result.insertedIds[0];
	tasks[1].owner = result.insertedIds[1];
	collection = db.collection('tasks');
	console.log('[seed]', 'Добавляем задачи...');
	await collection.insertMany(tasks);
	console.log('[seed]', 'Добавление задач завершено');
	console.log('[seed]', 'Все завершено');
} catch (error) {
	console.log('[seed]', 'Ошибка: ', error);
}
process.exit();
