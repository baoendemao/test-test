const mongoose = require('mongoose');
const Router = require('koa-router');
const router = new Router();

// 获取所有的文章
router.get('/articles', async (ctx, next) => {
  const Article = mongoose.model('Article');

  const articles = await Article.find({}).sort({
    'meta.createdAt': -1
  });

  ctx.body = {
    articles
  }
});

// 根据id获取某一篇文章
router.get('/articles/:id', async (ctx, next) => {
  const Article = mongoose.model('Article');

  const id = ctx.params.id;
  const article = await Article.findOne({_id: id});

  ctx.body = {
    article
  }
});

module.exports = router;