const express = require('express');
const sqlite3 = require('sqlite3');

const timesheetsRouter = express.Router({mergeParams: true});
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

timesheetsRouter.param('timesheetId', (req, res, next, timesheetId) => {
    db.get("SELECT * FROM Timesheet WHERE id = $id", {$id: timesheetId}, (error, timesheet) => {
        if (error) {
            next(error);
        } else if (timesheet) {
            next();
        } else {
            res.status(404).send();
        }
    });
});

timesheetsRouter.get('/', (req, res, next) => {
    db.get("SELECT * FROM Employee WHERE id = $employeeId", {$employeeId: req.params.employeeId}, (error, employee) => {
        if (error) {
            next(error);
        } else if (!(employee)) {
            res.status(404).send();
        } else {
            db.all("SELECT * FROM Timesheet WHERE employee_id = $employeeId", {$employeeId: req.params.employeeId}, (error, timesheets) => {
                if (error) {
                    next(error);
                } else {
                    res.status(200).send({timesheets: timesheets});
                }
            });
        }
    });
});

timesheetsRouter.post('/', (req, res, next) => {
    if (!(req.body.timesheet.hours && req.body.timesheet.rate && req.body.timesheet.date)) {
        res.status(400).send();
    } else {
        db.get("SELECT * FROM Employee WHERE id = $employeeId", {$employeeId: req.params.employeeId}, (error, employee) => {
            if (error) {
                next(error);
            } else if (!(employee)) {
                res.status(404).send();
            } else {
                db.run("INSERT INTO Timesheet (hours, rate, date, employee_id) VALUES ($hours, $rate, $date, $employeeId)", {$hours: req.body.timesheet.hours, $rate: req.body.timesheet.rate, $date: req.body.timesheet.date, $employeeId: req.params.employeeId}, function(error) {
                    if (error) {
                        next(error);
                    } else {
                        db.get("SELECT * FROM Timesheet WHERE id = $id", {$id: this.lastID}, (error, timesheet) => {
                            res.status(201).send({timesheet: timesheet});
                        });
                    }
                });
            }
        })
    }
});

timesheetsRouter.put('/:timesheetId', (req, res, next) => {
    if (!(req.body.timesheet.hours && req.body.timesheet.rate && req.body.timesheet.date)) {
        res.status(400).send();
    } else {
        db.get("SELECT * FROM Employee WHERE id = $employeeId", {$employeeId: req.params.employeeId}, (error, employee) => {
            if (error) {
                next(error);
            } else if (!(employee)) {
                res.status(404).send();
            } else {
                db.get("SELECT * FROM Timesheet WHERE id = $timesheetId", {$timesheetId: req.params.timesheetId}, (error, timesheet) => {
                    if (error) {
                        next(error);
                    } else if (!(timesheet)) {
                        res.status(404).send();
                    } else {
                        db.run("UPDATE Timesheet SET hours = $hours, rate = $rate, date = $date WHERE id = $timesheetId", {$hours: req.body.timesheet.hours, $rate: req.body.timesheet.rate, $date: req.body.timesheet.date, $timesheetId: req.params.timesheetId}, function(error) {
                            if (error) {
                                next(error);
                            } else {
                                db.get("SELECT * FROM Timesheet WHERE id = $timesheetId", {$timesheetId: req.params.timesheetId}, (error, timesheet) => {
                                    if (error) {
                                        next(error);
                                    } else {
                                        res.status(200).send({timesheet: timesheet});
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
});

timesheetsRouter.delete('/:timesheetId', (req, res, next) => {
    db.get("SELECT * FROM Employee WHERE id = $employeeId", {$employeeId: req.params.employeeId}, (error, employee) => {
        if (error) {
            next(error);
        } else if (!(employee)) {
            res.status(404).send();
        } else {
            db.get("SELECT * FROM Timesheet WHERE id = $timesheetId", {$timesheetId: req.params.timesheetId}, (error, timesheet) => {
                if (error) {
                    next(error);
                } else if (!(timesheet)) {
                    res.status(404).send();
                } else {
                    db.run("DELETE FROM Timesheet WHERE id = $timesheetId", {$timesheetId: req.params.timesheetId}, function(error) {
                        if (error) {
                            next(error);
                        } else {
                            res.status(204).send();
                        }
                    });
                }
            });
        }
    });
});

module.exports = timesheetsRouter;