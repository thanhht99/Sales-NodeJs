const mongoose = require('mongoose');

const { Schema } = mongoose;
const CategorySchema = new Schema({
    category_name: {
        type: String,
        required: [true, "Category Name is required"],
        unique: true,
    },
    category_desc: {
        type: String,
        required: [true, "Category Desc is required"]
    }
});
module.exports = mongoose.model('Category', CategorySchema);