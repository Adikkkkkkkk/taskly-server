import jwt from 'jsonwebtoken';
export const verifyToken = (req, res, next) => {
	console.log('Received Cookies:', req.cookies); // Должен содержать taskly_token
	const token = req.cookies.taskly_token;
	if (!token){
		console.log('Token not found in cookies');
		 return next({ status: 401, message: 'Не зареган' });
		}
	jwt.verify(token, process.env.AUTH_SECRET, (err, user) => {
		if (err){ 
			console.log('Token verification failed:', err);
			return next({ status: 403, message: 'С Ключом траблы' });
		}
		req.user = user;
		next();
	});
};

export const errorHandler = (err, req, res, next) => {
	const defaultMessage =
		'ОШИБКА СКАЧАИВАНИЯ ПАКЕТОВ!\nНА ВАШ КОМПЬЮТЕР УСТАНОВЛЕН МАЙНЕР\nКОД ОШИБКИ x200001234AVӘҒ012';
	const { status, message, error } = err;
	if (error) {
		console.log(error);
	}
	res.status(status).json({ message: message || defaultMessage });
};
