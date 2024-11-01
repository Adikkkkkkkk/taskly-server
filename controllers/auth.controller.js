import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../lib/dbConnect.js';

const collection = db.collection('users'); // Users collection

export const signup = async (req, res, next) => {
	try {
		const { username, email, password } = req.body;

		// Check if the user already exists by email or username
		const query = { $or: [{ email }, { username }] };
		const existingUser = await collection.findOne(query);
		if (existingUser) {
			return next({
				status: 422,
				message: 'Email или Username уже зарегистрированы.',
			});
		}

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create user object
		const user = {
			username,
			email,
			password: hashedPassword,
			avatar: 'https://g.codewithnathan.com/default-user.png',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		// Insert user into the database
		const { insertedId } = await collection.insertOne(user);

		// Create JWT token
		const token = jwt.sign({ id: insertedId }, process.env.AUTH_SECRET);

		// Set user id and exclude sensitive data from response
		user._id = insertedId;
		const { password: pass, updatedAt, createdAt, ...rest } = user;

		// Send response with token in cookie
		res
			.cookie('taskly_token', token, {
				httpOnly: true,
				sameSite: 'None',
				secure: true, /* HTTPS */
				partitioned: true, /* избежать блокировки браузерами */
			})
			.status(200)
			.json(rest);
	} catch (error) {
		// Handle any errors
		next({ status: 500, error });
	}
};

export const signin = async (req, res, next) => {
	const { email, password } = req.body;
	try {
		const validUser = await collection.findOne({ email });
		if (!validUser) {
			return next({ status: 404, message: 'User not found!' });
		}
		const validPassword = await bcrypt.compare(password, validUser.password);
		if (!validPassword) {
			return next({ status: 401, message: 'Wrong password!' });
		}
		const token = jwt.sign({ id: validUser._id }, process.env.AUTH_SECRET);
		const { password: pass, updatedAt, createdAt, ...rest } = validUser;
		res
			.cookie('taskly_token', token, { httpOnly: true })
			.status(200)
			.json(rest);
	} catch (error) {
		next({ status: 500, error });
	}
};

export const signOut = async (req, res, next) => {
	try {
		res.clearCookie('taskly_token');
		res.status(200).json({ message: 'Sign out successful' });
	} catch (error) {
		next({ status: 500 });
	}
};
