const express = require('express');
const Category = require('../database/models/Category');
const asyncMiddleware = require("../middleware/asyncMiddleware");
const ErrorResponse = require("../model/ErrorResponse");
const SuccessResponse = require("../model/SuccessResponse");

// Add Category
exports.createNewCategory = asyncMiddleware(async(req, res, next) => {
    const { category_name, category_desc } = req.body;
    const category = new Category({ category_name, category_desc });
    const res_category = await category.save();
    res.status(200).json(new SuccessResponse(200, res_category))
})

// All Category
exports.getAllCategories = asyncMiddleware(async(req, res, next) => {
    const categories = await Category.find().select('-updatedAt -createdAt -__v');
    if (!categories.length) {
        return next(new ErrorResponse(404, 'No categories'));
    }
    res.status(200).json(new SuccessResponse(200, categories))
})

// Update Category
exports.updateCategory = asyncMiddleware(async(req, res, next) => {
    const { id } = req.params;
    if (!id.trim()) {
        return next(new ErrorResponse(400, "Id is empty"));
    }
    const updatedCategory = await Category.findOneAndUpdate({ _id: id }, req.body, { new: true });
    if (!updatedCategory) {
        return next(new ErrorResponse(400, 'Can not updated'))
    }
    res.status(200).json(new SuccessResponse(200, updatedCategory))
})

// Delete Category
exports.deleteCategory = asyncMiddleware(async(req, res, next) => {
    const { id } = req.params;
    if (!id.trim()) {
        return next(new ErrorResponse(400, "Id is empty"));
    }
    const deleteCategory = await Category.findByIdAndDelete(id);
    if (!deleteCategory) {
        return next(new ErrorResponse(400, 'Can not delete'))
    }
    res.status(200).json(new SuccessResponse(200));
})