const mongoose = require('mongoose');
const express = require('express')
const { Schema } = mongoose;
const RoleSchema = new Schema({

    role_name: {
        type: String,
        required: [true, "Role Name is required"],
        unique: true,
    },
    role_desc: {
        type: String,
        required: [true, "Role Desc is required"]
    }
}, {
    timestamps: true
});

RoleSchema.pre("save", async function(next) {
    next();
})

module.exports = mongoose.model('Role', RoleSchema);