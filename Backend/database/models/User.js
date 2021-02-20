const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

mongoose.set("runValidators", true);

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: [6, "Name musts have more than 6 characters"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        minlength: [10, "Email musts have more than 10 characters"],
        validate: [validateEmail, 'Please fill a valid email address'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password musts have more than 6 characters"]
    },
    role: {
        type: String,
        enum: ["admin", "guest", "saler", "support"],
        default: "guest"
    },
    verifyCode: {
        type: Number,
        required: [true, "Verify Code is required"],
    },
    isActive: {
        type: Boolean,
        default: false
    }
}, {
    toJSON: { virtuals: true },
    timestamps: true,
});

UserSchema.pre("save", async function(next) {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

UserSchema.virtual("role_detail", {
    ref: "Role",
    foreignField: "role_name",
    localField: "role",
    justOne: true

})

// UserSchema.pre("findOneAndUpdate", async function() {
//     const salt = await bcrypt.genSalt(12);
//     this._update.password = await bcrypt.hash(this._update.password, salt);

// })

UserSchema.statics.comparePassword = async function(password, hashPassword) {
    return await bcrypt.compare(password, hashPassword)
}

module.exports = mongoose.model('User', UserSchema);