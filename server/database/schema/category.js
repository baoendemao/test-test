const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Mixed, ObjectId } = Schema.Types;

const categorySchema = new Schema({
  name: {
    unique: true,
    type: String
  },
  articles: [{
    type: ObjectId,
    // 每条数据指向的model
    ref: 'Article'
  }],
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

// mongodb在save之前的操作
categorySchema.pre('save', function(next) {
  if (this.isNew) {
    // 当前这条数据是新数据，则更新
    this.meta.updatedAt = this.meta.createdAt = Date.now();
  } else {
    // 当前这条数据不是新数据，则只更新updatedAt
    this.meta.updatedAt = Date.now();
  }
  next()
});

mongoose.model('Category', categorySchema);