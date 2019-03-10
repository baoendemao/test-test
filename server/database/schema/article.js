const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Mixed = Schema.Types.Mixed;

const articleSchema = new Schema({
    id: String,            // 文章id
    title: String,         // 文章标题
    content: String,       // 文章内容
    tags: Array,           // 所属标签
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

mongoose.model('Article', articleSchema);