const Employees = require('../models/employees');
const bcrypt = require('bcrypt');
const JWT = require("jsonwebtoken");

//get all
exports.getAll = async(req, res) => {
    Employees.find({ isActive: true })
        .exec((err, employeesDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    error: err
                });
            } else if (employeesDB == null) {
                return res.status(404).json({
                    ok: false,
                    error: "Employees is empty"
                });
            }

            res.json({
                ok: true,
                employees: employeesDB
            });
        })
}

//get by id
exports.getById = async(req, res) => {
    let id = req.params.id;

    if (id == null || id == undefined) {
        return res.status(400).json({
            ok: false,
            error: 'id is require'
        });
    }

    Employees.findById(id, (err, employeesDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        } else if (employeesDB == null) {
            return res.status(404).json({
                ok: false,
                error: "Employees not found"
            });
        }

        res.json({
            ok: true,
            employees: employeesDB
        });
    });
}

//post
exports.post = async(req, res) => {
    let body = req.body;
    if (body == null || body == undefined) {
        return res.status(400).json({
            ok: false,
            error: 'Bad Request'
        });
    }

    //create a new employee
    let employee = new Employees({
        identification: body.identification,
        name: body.name.toUpperCase(),
        phone: body.phone,
        email: body.email,
        credentials: body.credentials,
    });


    //encrypt password with bcrypt
    employee.credentials.password = bcrypt.hashSync(employee.credentials.password, 10);

    employee.save((err, employeesDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            employee: employeesDB
        })
    });
}

//put
exports.put = async(req, res) => {
    let id = req.params.id;
    let employee = req.body;
    if (employee == null || employee == undefined) {
        return res.status(400).json({
            ok: false,
            error: 'Bad Request'
        });
    } else if (id == null || id == undefined) {
        return res.status(400).json({
            ok: false,
            error: 'id is require'
        });
    }

    //remove credentials to not update on database
    delete employee.credentials;

    employee.name = employee.name.toUpperCase();

    Employees.findByIdAndUpdate(id, employee, (err, employeesDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            employee: employeesDB
        })
    });
}

//delete
exports.delete = async(req, res) => {
    let id = req.params.id;
    if (id == null || id == undefined) {
        return res.status(400).json({
            ok: false,
            error: 'id is require'
        });
    }

    Employees.findByIdAndDelete(id, (err, employeesDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            message: "Employee removed"
        })
    });
}

//LogIn with JTW
exports.logIn = async(req, res) => {
    let userName = req.query.userName;
    let email = req.query.email;
    let password = req.query.password;

    Employees.findOne({
            $or: [
                { 'credentials.userName': userName },
                { email: email }
            ]
        })
        .exec((err, employeesDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (employeesDB == null) {
                return res.status(404).json({
                    ok: false,
                    err: "Employee not found"
                });
            }

            //compare the password sent with the password encrypted
            employeesDB.comparePassword(password, (err, match) => {
                if (!match) {
                    return res.status(404).json({
                        ok: false,
                        message: "password invalid"
                    });
                }

                //create JWT
                let token = JWT.sign({
                    employeeId: employeesDB._id,
                    employeeName: employeesDB.name
                }, 'ASIKOBDASHDASIDBAJSKLBDIOPBASDASJKDBNKJASDGHWADBUUAISNDNMSABDUIOPWADNAS', { expiresIn: '2h' }); //JWT SEED / expireTime

                //return JWT
                return res.json({
                    ok: true,
                    employeesDB,
                    token
                });
            });

            return res.json({
                ok: true,
                error: err
            })
        });
}