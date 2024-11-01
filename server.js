import express from 'express'; // Импорт Express для создания сервера
import 'dotenv/config'; // Импорт конфигурации для доступа к переменным окружения
import connectDB from './lib/dbConnect.js'; // Подключение к базе данных
import userRouter from './routes/user.route.js'; // Импорт роутов пользователей
import { errorHandler } from './lib/middleware.js'; // Импорт обработчика ошибок
import authRouter from './routes/auth.route.js'; // Импорт роутов для аутентификации
import cookieParser from 'cookie-parser'; // Импорт middleware для парсинга cookie
import cors from 'cors'; // CORS для передачи между портами
import fileUpload from 'express-fileupload'; // Получение изображения в Express
import cldRouter from './routes/cloudinary.route.js'; // Маршрут клаудинари
import taskRouter from './routes/task.route.js'; // Работа с задачами

const app = express(); // Создание приложения Express
const PORT = process.env.PORT || 3000; // Определяем порт, на котором будет сервер

// Подключаем middleware для работы с JSON, файлов и cookie
app.use(express.json()); // Позволяет серверу парсить JSON в запросах
app.use(cookieParser()); // Позволяет серверу парсить cookie
app.use(fileUpload()); // Работа с файлами

// Настраиваем CORS
app.use(
	cors({
		origin: process.env.CLIENT_URL,
		credentials: true,
	})
);

// Подключаем роутеры
app.use('/surprise/v1/users', userRouter);
app.use('/surprise/v1/auth', authRouter);
app.use('/surprise/v1/image', cldRouter);
app.use('/surprise/v1/tasks', taskRouter);

// Подключаем базу данных при запуске сервера
connectDB();

app.get('/', (req, res) => {
	res.status(200).json({ message: 'Welcome to Taskly API'});
	});
	

// Обработка нестандартных маршрутов — если ни один из роутов не подходит
app.use('*', (req, res) => {
	res.status(404).json({ message: 'табалмай жүрмін брат' }); // Возвращаем 404 для всех несуществующих маршрутов
});

// Обработка ошибок
app.use(errorHandler); // Обработчик ошибок, если что-то пошло не так

// Запуск сервера на порту 8000
app.listen(PORT, '0.0.0.0',  () => {
	console.log(`Сервер готов вкалывать на порту ${PORT}`);
});
