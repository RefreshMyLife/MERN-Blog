import UserModel from '../models/User.js';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const registration = async (request, response) => {
  try {
    const password = request.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      fullName: request.body.fullName,
      email: request.body.email,
      passwordHash: hash,
      avatarUrl: request.body.avatarUrl,
    });

    const user = await doc.save();
    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      },
    );
    const { passwordHash, ...userData } = user._doc;

    response.json({ ...userData, token });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: 'Не удалось создать пользователя',
    });
  }
};

export const login = async (request, response) => {
  try {
    const user = await UserModel.findOne({ email: request.body.email });
    if (!user) {
      return response.status(404).json({
        message: 'Пользователь не найден',
      });
    }
    const isValidPass = await bcrypt.compare(request.body.password, user._doc.passwordHash);
    if (!isValidPass) {
      return response.status(404).json({
        message: 'Неверный логин или пароль',
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      },
    );
    const { passwordHash, ...userData } = user._doc;

    response.json({ ...userData, token });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: 'Не удалось авторизоваться',
    });
  }
};

export const getMe = async (request, response) => {
  try {
    const user = await UserModel.findById(request.userId);

    if (!user) {
      return response.status(500).json({
        message: 'Неудалось найти  пользователя',
      });
    }

    const { passwordHash, ...userData } = user._doc;
    response.json({ ...userData });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: 'Неудалось найти информацию пользователя',
    });
  }
};
