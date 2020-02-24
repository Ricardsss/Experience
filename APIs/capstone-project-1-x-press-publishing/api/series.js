const express = require('express');
const sqlite3 = require('sqlite3');
const issuesRouter = require('./issues.js');

const seriesRouter = express.Router();
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

seriesRouter.param('seriesId', (req, res, next, seriesId) => {
    db.get("SELECT * FROM Series WHERE id = $seriesId", {$seriesId: seriesId}, (error, series) => {
        if (error) {
            next(error);
        } else if (series) {
            req.series = series;
            next();
        } else {
            res.status(404).send();
        }
    });
});

seriesRouter.use('/:seriesId/issues', issuesRouter);

seriesRouter.get('/', (req, res, next) => {
    db.all("SELECT * FROM Series", (error, series) => {
        if (error) {
            next(error);
        } else {
            res.status(200).send({series: series});
        }
    });
});

seriesRouter.get('/:seriesId', (req, res, next) => {
    res.status(200).send({series: req.series});
});

seriesRouter.post('/', (req, res, next) => {
    if (!(req.body.series.name && req.body.series.description)) {
        res.status(400).send();
    } else {
        db.run("INSERT INTO Series (name, description) VALUES ($name, $description)", {$name: req.body.series.name, $description: req.body.series.description}, function(error) {
            if (error) {
                next(error);
            } else {
                db.get("SELECT * FROM Series WHERE id = $id", {$id: this.lastID}, (error, series) => {
                    res.status(201).send({series: series});
                });
            }
        });
    }
});

seriesRouter.put('/:seriesId', (req, res, next) => {
    if (!(req.body.series.name && req.body.series.description)) {
        res.status(400).send();
    } else {
        db.run("UPDATE Series SET name = $name, description = $description WHERE id = $seriesId", {$name: req.body.series.name, $description: req.body.series.description, $seriesId: req.params.seriesId}, function(error) {
            if (error) {
                next(error);
            } else {
                db.get("SELECT * FROM Series WHERE id = $id", {$id: req.params.seriesId}, (error, series) => {
                    res.status(200).send({series: series});
                })
            }
        });
    }
});

seriesRouter.delete('/:seriesId', (req, res, next) => {
    db.get("SELECT * FROM Issue WHERE series_id = $seriesId", {$seriesId: req.params.seriesId}, (error, issue) => {
        if (error) {
            next(error);
        } else if (issue) {
            res.status(400).send();
        } else {
            db.run("DELETE FROM Series WHERE id = $seriesId", {$seriesId: req.params.seriesId}, function(error) {
                if (error) {
                    next(error);
                } else {
                    res.status(204).send();
                }
            });
        }
    });
});

module.exports = seriesRouter;