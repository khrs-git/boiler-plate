const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    Image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
});

userSchema.pre('save', function(next) {
    var user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if (err) return next(err);
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

userSchema.methods.comparePassword = function(plainPassword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
            if (err) return reject(err);
            resolve(isMatch);
        });
    });
};

userSchema.methods.generateToken = async function() {
    var user = this;
    var token = jwt.sign(user._id.toHexString(), 'secretToken');

    var oneHourInSeconds = 60 * 60;
    var tokenExp = Math.floor(Date.now() / 1000) + oneHourInSeconds;

    user.token = token;
    user.tokenExp = tokenExp;

    try {
        const savedUser = await user.save();
        return savedUser;
    } catch (err) {
        throw err;
    }
};

userSchema.statics.findByToken = function(token) {
    var user = this;

    return new Promise((resolve, reject) => {
        jwt.verify(token, 'secretToken', (err, decoded) => {
            if (err) {
                return reject(err);
            }
            user.findOne({ "_id": decoded, "token": token })
                .then(foundUser => {
                    resolve(foundUser);
                })
                .catch(dbErr => {
                    reject(dbErr);
                });
        });
    });
};

const User = mongoose.model('user', userSchema);
module.exports = { User };