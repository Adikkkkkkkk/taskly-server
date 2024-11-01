// импортируем 1: MongoClient - класс с методами для подключения бд, 2: ServerApiVersion - объект для указания версии API
import { MongoClient, ServerApiVersion } from 'mongodb';
// Деструктуризируем две переменные и помещаем в них MONGODB_URI - плдключение к бд, MONGODB_DATABASE - имя бд
const { MONGODB_URI, MONGODB_DATABASE } = process.env;

// Создаем новый экземпляр MongoClient c параметрами
const client = new MongoClient(MONGODB_URI, {
	/*  MONGODB_URI - подключение к базе данных */
	// Настройка API сервера
	serverApi: {
		version: ServerApiVersion.v1,
		// Не дает пользоваться устаревшими функциями
		strict: true,
		// Выводит ошибки при исп старой версии апи
		deprecationErrors: true,
	},
});

// Асинхронная функция подключения к бд
async function connectDB() {
	try {
		// Ждёт подключения к MongoDB
		await client.connect();
		// Отправляет команду пинг - проверка подключения к бд
		await client.db().command({ ping: 1 });
		console.log('Connected to MongoDB successfully!');
	} catch (err) {
		// Сообщение при ошибке подключения
		console.error('MongoDB connection error:', err);
	}
}

export const db =
	client.db(
		MONGODB_DATABASE
	); /* db экспортируется как объект базы данных, чтобы можно было использовать его в других частях приложения. Он ссылается на базу данных с именем, указанным в MONGODB_DATABASE. */
export default connectDB; /* экспорт функции подключения */
