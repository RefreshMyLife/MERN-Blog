import { body } from 'express-validator';

export const registerValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('fullName', 'Укажите имя').isLength({ min: 5 }),
  body('password', 'Пароль должен быть не меньше 6 символов').isLength({ min: 6 }),
  body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL(),
];

export const loginValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть не меньше 6 символов').isLength({ min: 6 }),
];

export const postCreateValidation = [
  body('title', 'Введите заголовок').isLength({ min: 5 }).isString(),
  body('text', 'Введите текст').isLength({ min: 6 }).isString(),
  body('tags', 'Неверный формат тэгов').optional().isString(),
  body('imageUrl', 'Пароль должен быть не меньше 6 символов').optional().isString(),
];
