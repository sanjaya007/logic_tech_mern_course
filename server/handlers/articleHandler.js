const moment = require("moment/moment");
const ArticleModel = require("../models/Article");
const { imageValidation, uploadImage } = require("../utils");

const getArticles = async (req, res) => {
  try {
    const articles = await ArticleModel.find();

    const finalArticles = [];
    articles.forEach((article) => {
      finalArticles.push({
        title: article.title,
        description: article.description,
        author: article.author,
        image: article.image,
        createdAt: article.createdAt,
      });
    });
    finalArticles.forEach((article) => {
      article.createdAt = moment(article.createdAt).fromNow();
    });
    console.log(finalArticles);

    res.json({
      success: true,
      data: finalArticles,
    });
  } catch (error) {
    console.log(error);
  }
};

const addArticle = async (req, res) => {
  try {
    const body = req.body;
    const imageFile = req.files.image;

    if (!imageValidation(imageFile.mimetype, res)) {
      return false;
    }

    const imageFileName = uploadImage("uploads", imageFile);

    const article = new ArticleModel({
      title: body.title,
      description: body.description,
      author: body.author,
      image: "uploads/" + imageFileName,
    });

    article.save();

    res.json({
      success: true,
      message: "Article created successfully!",
    });
  } catch (error) {
    console.log(error);
  }
};

const editArticle = async (req, res) => {
  try {
    let imageFileName = null;
    const id = req.params.id;
    const body = req.body;

    if (req.files) {
      const imageFile = req.files.image;
      if (!imageValidation(imageFile.mimetype, res)) {
        return false;
      }

      imageFileName = uploadImage("uploads", imageFile);
    }

    const editArticle = await ArticleModel.findByIdAndUpdate(
      { _id: id },
      {
        title: body.title,
        description: body.description,
        author: body.author,
        image: imageFileName ? "uploads/" + imageFileName : null,
      }
    );

    res.json({
      success: true,
      message: "Article updated successfully!",
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteArticle = async (req, res) => {
  const id = req.params.id;

  const deleteArticle = await ArticleModel.findByIdAndRemove({ _id: id });

  res.json({
    success: true,
    message: "Article deleted successfully!",
  });
};

module.exports = {
  getArticles,
  addArticle,
  editArticle,
  deleteArticle,
};
