const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Mixed = Schema.Types.Mixed;
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
const MAX_LOGIN_ATTEMPTS = 5;           // 密码重试次数
const LOCK_TIME = 2 * 60 * 60 * 1000;   // 账号的锁定时间间隔

const userSchema = new Schema({
  id: String,            // 用户id
  username: {            // 用户名
    unique: true,        // 用户名唯一，不可重复
    type: String         
  },
  email: {               // 邮箱
    unique: true,
    type: String
  },
  password: {            // 密码
    unique: true,
    type: String
  },
  loginAttempts: {
    type: Number,
    required: true,
    default: 0
  },
  lockUntil: Number,      // 锁定的时间，毫秒
  meta: {
    // 创建时间
    createdAt: {
      type: Date,
      default: Date.now()
    },
    // 更新时间
    updatedAt: {
      type: Date,
      default: Date.now()
    },
  }
});

// isLocked字段不会存到数据库中
userSchema.virtual('isLocked').get(() => {
  // 判断账号有没有被锁定，且锁定时间是否超过了当前的时间
  // 如果超过了锁定的时间，则可以取消锁定。 否则，账号则继续锁定
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// mongodb在save之前的操作
userSchema.pre('save', next => {
  if (this.isNew) {
    // 当前这条数据是新数据，则更新
    this.meta.updatedAt = this.meta.createdAt = Date.now();
  } else {
    // 当前这条数据不是新数据，则只更新updatedAt
    this.meta.updatedAt = Date.now();
  }
  next()
});

// 在密码保存之前，将密码变成hash
userSchema.pre('save', next => {
  if (!this.isModifed('password')) {
    return next();
  }

  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err)

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      this.password = hash;

      next();
    });
  });

  next();
});

userSchema.methods = {
  // 比较密码是否匹配
  comparePassword: (_password, password) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(_password, password, (err, isMatch) => {
        if (!err) resolve(isMatch);
        else reject(err);
      });
    });
  },
  // 每次密码出错，+1
  // 如果超过了登录尝试次数，则锁定账号
  incLoginAttempts: (user) => {
    return new Promise((resolve, reject) => {
      // 如果已被锁定，且过了锁定期，则可以解除锁定
      if (this.lockUntil && this.lockUntil < Date.now()) {
        // 解除锁定
        this.update({
          $set: {
            loginAttempts: 1
          },
          $unset: {
            lockUntil: 1
          }
        }, (err) => {
          if (!err) resolve(true);
          else reject(err);
        });
      } else {
        let updates = {
          $inc: {
            loginAttempts: 1
          }
        };

        // 如果尝试次数超过了且当前账号没被锁定，则需要锁定该账号
        if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS &&
          !this.isLocked) {
          updates.$set = {
            // 锁定时间lockUntil = 当前时间 + 要锁定的时间段
            lockUntil: Date.now() + LOCK_TIME
          }
        }

        this.update(updates, err => {
          if (!err) resolve(true);
          else reject(err);
        });
      }
    });
  }
};

mongoose.model('User', userSchema);