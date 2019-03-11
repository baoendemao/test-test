const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const { resolve } = require('path');
const mongoose = require('mongoose');
const { connect, initSchemas } = require('./database/init');
const router = require('./routes');

// 数据库连接
(async () => {
  await connect();
  initSchemas();
  /*
  let Article = mongoose.model('Article');
  let articles = await Article.find({})
  console.log('articles: ====')
  console.log(articles)
  */
})();

app
  .use(router.routes())
  .use(router.allowedMethods());

// views中间件的集成, 将模板挂在到了context上下文
app.use(views(resolve(__dirname, 'views'), {
	extension: 'pug'
}));

// async await
app.use(async (ctx, next) => {
	await ctx.render('index', {
		name: 'this is name',
		desp: 'this is desp'
	});
});


app.listen(8888);