const express = require("express");
const employeesController = require("../controllers/employeesControllers");
const router = express.Router();

const { authenticationToken } = require('../server/middlewares/authentication')

module.exports = function() {
    router.get("/employees", authenticationToken, employeesController.getAll);
    router.get("/employees/:id", authenticationToken, employeesController.getById);
    router.post("/employees", authenticationToken, employeesController.post);
    router.put("/employees/:id", authenticationToken, employeesController.put);
    router.delete("/employees/:id", authenticationToken, employeesController.delete);
    router.get("/logIn", employeesController.logIn);

    return router;
};