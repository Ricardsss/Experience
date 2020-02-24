const express = require('express');
const sqlite3 = require('sqlite3');

const artistsRouter = express.Router();
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

artistsRouter.param('artistId', (req, res, next, artistId) => {
    db.get("SELECT * FROM Artist WHERE id = $artistId", {$artistId: artistId}, (error, artist) => {
        if (error) {
            next(error);
        } else if (artist) {
            req.artist = artist;
            next();
        } else {
            res.status(404).send();
        }
    });
});

artistsRouter.get('/', (req, res, next) => {
    db.all("SELECT * FROM Artist WHERE is_currently_employed = 1", (error, artists) => {
        if (error) {
            next(error);
        } else {
            res.status(200).send({artists: artists});
        }
    });
});

artistsRouter.get('/:artistId', (req, res, next) => {
    res.status(200).send({artist: req.artist});
});

artistsRouter.post('/', (req, res, next) => {
    if (!(req.body.artist.name && req.body.artist.dateOfBirth && req.body.artist.biography)) {
        res.status(400).send();
    } else {
        const isCurrentlyEmployed = req.body.artist.isCurrentlyEmployed === 0 ? 0 : 1;
        db.run("INSERT INTO Artist (name, date_of_birth, biography, is_currently_employed) VALUES ($name, $dateOfBirth, $biography, $isCurrentlyEmployed)", {$name: req.body.artist.name, $dateOfBirth: req.body.artist.dateOfBirth, $biography: req.body.artist.biography, $isCurrentlyEmployed: isCurrentlyEmployed}, function(error) {
            if (error) {
                next(error);
            } else {
                db.get("SELECT * FROM Artist WHERE id = $id", {$id: this.lastID}, (error, artist) => {
                    res.status(201).send({artist: artist});
                });
            }
        });
    }
});

artistsRouter.put('/:artistId', (req, res, next) => {
    if (!(req.body.artist.name && req.body.artist.dateOfBirth && req.body.artist.biography)) {
        res.status(400).send();
    } else {
        db.run("UPDATE Artist SET name = $name, date_of_birth = $dateOfBirth, biography = $biography, is_currently_employed = $isCurrentlyEmployed WHERE id = $artistId", {$name: req.body.artist.name, $dateOfBirth: req.body.artist.dateOfBirth, $biography: req.body.artist.biography, $isCurrentlyEmployed: req.body.artist.isCurrentlyEmployed, $artistId: req.params.artistId}, function(error) {
            if (error) {
                next(error);
            } else {
                db.get("SELECT * FROM Artist WHERE id = $id", {$id: req.params.artistId}, (error, artist) => {
                    res.status(200).send({artist: artist});
                });
            }
        });
    }
});

artistsRouter.delete('/:artistId', (req, res, next) => {
    db.run("UPDATE Artist SET is_currently_employed = 0 WHERE id = $artistId", {$artistId: req.params.artistId}, function(error) {
        if (error) {
            next(error);
        } else {
            db.get("SELECT * FROM Artist WHERE id = $artistId", {$artistId: req.params.artistId}, (error, artist) => {
                res.status(200).send({artist: artist});
            });
        }
    });
});

module.exports = artistsRouter;