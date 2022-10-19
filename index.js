import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';

import { loginValidation, registerValidation, postCreateValidation } from './validations/auth.js';
import { UserControllers, PostControllers } from './controlers/index.js';
import { handleValiidationErrors, checkAuth } from './middleware/index.js';

mongoose
  .connect(
    //                                                       ↓ указываем бд и монго ДБ автоматически создаёт бд
    'mongodb+srv://admin:admin@cluster0.xao92rk.mongodb.net/blog?retryWrites=true&w=majority',
  )
  .then(() => {
    console.log('MONGO DB OK');
  })
  .catch((err) => {
    console.log('DB error', err);
  });

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// request - запрос с фронта (от клиента)
// response - ответ на запрос клиента
app.get('/', (request, response) => {
  response.send('Fighting for peace is like fucking  for virginity Kirill sosat');
});

app.post('/auth/login', loginValidation, handleValiidationErrors, UserControllers.login);

app.get('/auth/me', checkAuth, UserControllers.getMe);

app.post('/upload', checkAuth, upload.single('image'), (request, response) => {
  response.json({
    url: `/uploads/${request.file.originalname}`,
  });
});

app.post(
  '/auth/register',
  registerValidation,
  handleValiidationErrors,
  UserControllers.registration,
);

app.get('/posts', PostControllers.getAll);

app.get('/posts/:id', PostControllers.getOne);

app.post(
  '/posts',
  checkAuth,
  postCreateValidation,
  handleValiidationErrors,
  PostControllers.create,
);

app.patch('/posts/:id', checkAuth, handleValiidationErrors, PostControllers.update);

app.delete('/posts/:id', checkAuth, PostControllers.remove);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server OK');
});
