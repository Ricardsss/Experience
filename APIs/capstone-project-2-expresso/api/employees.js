const express = require('express');
const sqlite3 = require('sqlite3');
const timesheetsRouter = require('./timesheets.js');

const employeesRouter = express.Router();
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

employeesRouter.param('employeeId', (req, res, next, employeeId) => {
    db.get("SELECT * FROM Employee WHERE id = $employeeId", {$employeeId: employeeId}, (error, employee) => {
        if (error) {
            next(error);
        } else if (employee) {
            req.employee = employee;
            next();
        } else {
            res.status(404).send();
        }
    });
});

employeesRouter.use('/:employeeId/timesheets', timesheetsRouter);

employeesRouter.get('/', (req, res, next) => {
    db.all("SELECT * FROM Employee WHERE is_current_employee = 1", (error, employees) => {
        if (error) {
            next(error);
        } else {
            res.status(200).send({employees: employees});
        }
    });
});

employeesRouter.get('/:employeeId', (req, res, next) => {
    res.status(200).send({employee: req.employee});
});

employeesRouter.post('/', (req, res, next) => {
    if (!(req.body.employee.name && req.body.employee.position && req.body.employee.wage)) {
        res.status(400).send();
    } else {
        const isCurrentEmployee = req.body.employee.isCurrentEmployee === 0 ? 0 : 1;
        db.run("INSERT INTO Employee (name, position, wage, is_current_employee) VALUES ($name, $position, $wage, $isCurrentEmployee)", {$name: req.body.employee.name, $position: req.body.employee.position, $wage: req.body.employee.wage, $isCurrentEmployee: isCurrentEmployee}, function(error) {
            if (error) {
                next(error);
            } else {
                db.get("SELECT * FROM Employee WHERE id = $id", {$id: this.lastID}, (error, employee) => {
                    if (error) {
                        next(error);
                    } else {
                        res.status(201).send({employee: employee});
                    }
                });
            }
        });
    }
});

employeesRouter.put('/:employeeId', (req, res, next) => {
    if (!(req.body.employee.name && req.body.employee.position && req.body.employee.wage)) {
        res.status(400).send();
    } else {
        db.get("SELECT * FROM Employee WHERE id = $id", {$id: req.params.employeeId}, (error, employee) => {
            if (error) {
                next(error);
            } else if (!(employee)) {
                res.status(404).send();
            } else {
                db.run("UPDATE Employee SET name = $name, position = $position, wage = $wage WHERE id = $id", {$name: req.body.employee.name, $position: req.body.employee.position, $wage: req.body.employee.wage, $id: req.params.employeeId}, function(error) {
                    if (error) {
                        next(error);
                    } else {
                        db.get("SELECT * FROM Employee WHERE id = $id", {$id: req.params.employeeId}, (error, employee) => {
                            if (error) {
                                next(error);
                            } else {
                                res.status(200).send({employee: employee});
                            }
                        });
                    }
                })
            }
        });
    }
});

employeesRouter.delete('/:employeeId', (req, res, next) => {
    db.get("SELECT * FROM Employee WHERE id = $id", {$id: req.params.employeeId}, (error, employee) => {
        if (error) {
            next(error);
        } else {
            db.run("UPDATE Employee SET is_current_employee = 0 WHERE id = $id", {$id: req.params.employeeId}, function(error) {
                if (error) {
                    next(error);
                } else {
                    db.get("SELECT * FROM Employee WHERE id = $id", {$id: req.params.employeeId}, (error, employee) => {
                        if (error) {
                            next(error);
                        } else {
                            res.status(200).send({employee: employee});
                        }
                    });
                }
            });
        }
    });
});

module.exports = employeesRouter;