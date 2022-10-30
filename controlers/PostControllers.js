import PostModel from '../models/Post.js';

export const create = async (request, response) => {
  try {
    const doc = await new PostModel({
      title: request.body.title,
      text: request.body.text,
      imageUrl: request.body.imageUrl,
      tags: request.body.tags,
      user: request.userId,
    });

    const post = await doc.save();
    response.json(post);
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: 'Не удалось создать статью',
    });
  }
};

export const getLastTags = async (request, response) => {
  try {
    const post = await PostModel.find().limit(5).exec();
    const tags = post
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    response.json(tags);
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: 'Не удалось получить статьи', 
    });
  }
};
export const getAll = async (request, response) => {
  try {
    const post = await PostModel.find().populate('user').exec();
    response.json(post);
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const getOne = async (request, response) => {
  try {
    const postId = request.params.id;
    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      },
      (error, doc) => {
        if (error)
          return response.status(500).json({
            message: 'Не удалось вернуть статью',
          });

        if (!doc) {
          return response.status(404).json({
            message: 'Статья не найдена',
          });
        }
        response.json(doc);
      },
    ).populate('user');
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: 'Не удалось получить статью',
    });
  }
};

export const update = async (request, response) => {
  try {
    const postId = request.params.id;
    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: request.body.title,
        text: request.body.text,
        imageUrl: request.body.imageUrl,
        tags: request.body.tags,
        user: request.userId,
      },
    );
    response.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: 'Не удалось обновить статью',
    });
  }
};

export const remove = async (request, response) => {
  try {
    const postId = request.params.id;
    PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (error, doc) => {
        if (error)
          return response.status(500).json({
            message: 'Статья не удалена статью',
          });

        if (!doc) {
          return response.status(404).json({
            message: 'Статья не найдена',
          });
        }
        response.json({
          success: true,
        });
      },
    );
  } catch (error) {
    console.log(error);
    response.status(500).json({
      message: 'Не удалось удалить статью',
    });
  }
};
