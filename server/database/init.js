const mongoose = require('mongoose');
const db = 'mongodb://localhost/pet-smile';
const glob = require('glob');
const { resolve } = require('path');

mongoose.Promise = global.Promise;

// 初始化schema
exports.initSchemas = () => {
  glob.sync(resolve(__dirname, './schema/', '**/*.js')).forEach(require);
}

// 数据库连接
exports.connect = () => {
  let maxConnectTimes = 0;

  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV !== 'production') {
        mongoose.set('debug', true);
    }

    mongoose.connect(db, { useNewUrlParser: true })

    // 当数据库断开的时候，尝试重新连接
    mongoose.connection.on('disconnected', () => {
      maxConnectTimes++;
      if (maxConnectTimes < 5) {
        console.log('disconnected, try to reconnect')
        mongoose.connect(db);
      } else {
        throw new Error('mongo database is broken');
      }
    });

    // 数据库连接出错的时候
    mongoose.connection.on('error', err => {
      maxConnectTimes++;
      if (maxConnectTimes < 5) {
        console.log('encounter error, try to reconnect')
        mongoose.connect(db);
      } else {
      throw new Error('mongo database is broken');
      }
    });

    mongoose.connection.once('open', () => {
      /*
      const Dog = mongoose.model('Dog', {
        name: String
      })
      const dog_1 = new Dog({name: '哈士奇'});
      dog_1.save().then(() => {
        console.log('存储成功')
      })
      */
      
      resolve();
      console.log('MongoDB connected successfully');
    });
  });
}