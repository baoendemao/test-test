const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const { resolve } = require('path');

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