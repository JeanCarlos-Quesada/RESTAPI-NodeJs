const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require('bcrypt');

let Schema = mongoose.Schema;

//create a schema
let employeesSchema = new Schema({
    identification: {
        type: String,
        unique: true,
        require: [true, 'The indentification is require']
    },
    name: {
        type: String,
        require: [true, 'The name is require']
    },
    phone: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        require: [true, 'The email is require']
    },
    credentials: {
        userName: {
            type: String,
            unique: true,
            require: [true, 'The user name is require']
        },
        password: {
            type: String,
            require: [true, 'The passworde is require'],
        }
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

//compare encrypted password with plain text
employeesSchema.methods.comparePassword = function(password, callback) {
    return callback(null, bcrypt.compare(password, this.password));
}

//validate unique spaces
employeesSchema.plugin(uniqueValidator, { message: 'is a unique space' });

module.exports = mongoose.model('Employees', employeesSchema);