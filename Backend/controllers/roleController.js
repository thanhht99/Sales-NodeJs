const express = require('express');
const Role = require("../database/models/Role");
const asyncMiddleware = require("../middleware/asyncMiddleware");
const ErrorResponse = require("../model/ErrorResponse");
const SuccessResponse = require("../model/SuccessResponse");

// Add Role
exports.createNewRole = asyncMiddleware(async(req, res, next) => {
    const { role_name, role_desc } = req.body;
    const newRole = new Role({ role_name, role_desc });
    const role = await newRole.save();
    res.status(201).json(new SuccessResponse(201, role))
});

// All Role
exports.getAllRoles = asyncMiddleware(async(req, res, next) => {
    const roles = await Role.find().select('-updatedAt -createdAt -__v');
    if (!roles.length) {
        return next(new ErrorResponse(404, 'No roles'));
    }
    res.status(200).json(new SuccessResponse(200, roles))
});

// Role Update
exports.updateRole = asyncMiddleware(async(req, res, next) => {
    const { id } = req.params;
    if (!id.trim()) {
        return next(new ErrorResponse(400, "Id is empty"));
    }
    const updatedRole = await Role.findOneAndUpdate({ _id: id }, req.body, { new: true });
    if (!updatedRole) {
        return next(new ErrorResponse(400, 'Can not updated'))
    }
    res.status(200).json(new SuccessResponse(200, updatedRole))
});

// Role Delete
exports.deleteRole = asyncMiddleware(async(req, res, next) => {
    const { id } = req.params;
    if (!id.trim()) {
        return next(new ErrorResponse(400, "Id is empty"));
    }
    const deleteRole = await Role.findByIdAndDelete(id);
    if (!deleteRole) {
        return next(new ErrorResponse(400, 'Can not delete'))
    }
    res.status(200).json(new SuccessResponse(200, 'Delete success'));
})