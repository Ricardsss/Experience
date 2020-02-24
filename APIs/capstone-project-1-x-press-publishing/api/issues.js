const express = require('express');
const sqlite3 = require('sqlite3');

const issuesRouter = express.Router({mergeParams: true});
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

issuesRouter.param('issueId', (req, res, next, issueId) => {
    db.get("SELECT * FROM Issue WHERE id = $issueId", {$issueId: issueId}, (error, issue) => {
        if (error) {
            next(error);
        } else if (issue) {
            req.issue = issue;
            next();
        } else {
            res.status(404).send();
        }
    });
});

issuesRouter.get('/', (req, res, next) => {
    db.all("SELECT * FROM Issue WHERE series_id = $seriesId", {$seriesId: req.params.seriesId}, (error, issues) => {
        if (error) {
            next(error);
        } else {
            res.status(200).send({issues: issues});
        }
    });
});

issuesRouter.post('/', (req, res, next) => {
    if (!(req.body.issue.name && req.body.issue.issueNumber && req.body.issue.publicationDate && req.body.issue.artistId)) {
        res.status(400).send();
    } else {
        db.get("SELECT * FROM Artist WHERE id = $artistId", {$artistId: req.body.issue.artistId}, (error, artist) => {
            if (error) {
                next(error);
            } else if (!(artist)) {
                res.status(400).send();
            } else {
                db.run("INSERT INTO Issue (name, issue_number, publication_date, artist_id, series_id) VALUES ($name, $issueNumber, $publicationDate, $artistId, $seriesId)", {$name: req.body.issue.name, $issueNumber: req.body.issue.issueNumber, $publicationDate: req.body.issue.publicationDate, $artistId: req.body.issue.artistId, $seriesId: req.params.seriesId}, function(error) {
                    if (error) {
                        next(error);
                    } else {
                        db.get("SELECT * FROM Issue WHERE id = $id", {$id: this.lastID}, (error, issue) => {
                            res.status(201).send({issue: issue});
                        })
                    }
                });
            }
        });
    }
});

issuesRouter.put('/:issueId', (req, res, next) => {
    if (!(req.body.issue.name && req.body.issue.issueNumber && req.body.issue.publicationDate && req.body.issue.artistId)) {
        res.status(400).send();
    } else {
        db.get("SELECT * FROM Artist WHERE id = $artistId", {$artistId: req.body.issue.artistId}, (error, artist) => {
            if (error) {
                next(error);
            } else if (!(artist)) {
                res.status(400).send();
            } else {
                db.run("UPDATE Issue SET name = $name, issue_number = $issueNumber, publication_date = $publicationDate, artist_id = $artistId WHERE id = $issueId", {$name: req.body.issue.name, $issueNumber: req.body.issue.issueNumber, $publicationDate: req.body.issue.publicationDate, $artistId: req.body.issue.artistId, $issueId: req.params.issueId}, function(error) {
                    if (error) {
                        next(error);
                    } else {
                        db.get("SELECT * FROM Issue WHERE id = $id", {$id: req.params.issueId}, (error, issue) => {
                            res.status(200).send({issue: issue});
                        })
                    }
                });
            }
        });
    }
});

issuesRouter.delete('/:issueId', (req, res, next) => {
    db.run("DELETE FROM Issue WHERE id = $issueId", {$issueId: req.params.issueId}, function(error) {
        if (error) {
            next(error);
        } else {
            res.status(204).send();
        }
    });
});

module.exports = issuesRouter;