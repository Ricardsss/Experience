const express = require('express');
const sqlite3 = require('sqlite3');

const menuItemsRouter = express.Router({mergeParams: true});
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

menuItemsRouter.param('menuItemId', (req, res, next, menuItemId) => {
    db.get("SELECT * FROM MenuItem WHERE id = $menuItemId", {$menuItemId: menuItemId}, (error, menuItem) => {
        if (error) {
            next(error);
        } else if (menuItem) {
            next();
        } else {
            res.status(404).send();
        }
    });
});

menuItemsRouter.get('/', (req, res, next) => {
    db.all("SELECT * FROM MenuItem WHERE menu_id = $menuId", {$menuId: req.params.menuId}, (error, menuItems) => {
        if (error) {
            next(error);
        } else {
            res.status(200).send({menuItems: menuItems});
        }
    })
});

menuItemsRouter.post('/', (req, res, next) => {
    if (!(req.body.menuItem.name && req.body.menuItem.description && req.body.menuItem.inventory && req.body.menuItem.price)) {
        res.status(400).send();
    } else {
        db.run("INSERT INTO MenuItem (name, description, inventory, price, menu_id) VALUES ($name, $description, $inventory, $price, $menuId)", {$name: req.body.menuItem.name, $description: req.body.menuItem.description, $inventory: req.body.menuItem.inventory, $price: req.body.menuItem.price, $menuId: req.params.menuId}, function(error) {
            if (error) {
                next(error);
            } else {
                db.get("SELECT * FROM MenuItem WHERE id = $menuItemId", {$menuItemId: this.lastID}, (error, menuItem) => {
                    if (error) {
                        next(error);
                    } else {
                        res.status(201).send({menuItem: menuItem});
                    }
                });
            }
        });
    }
});

menuItemsRouter.put('/:menuItemId', (req, res, next) => {
    if (!(req.body.menuItem.name && req.body.menuItem.description && req.body.menuItem.inventory && req.body.menuItem.price)) {
        res.status(400).send();
    } else {
        db.run("UPDATE MenuItem SET name = $name, description = $description, inventory = $inventory, price = $price WHERE id = $menuItemId", {$name: req.body.menuItem.name, $description: req.body.menuItem.description, $inventory: req.body.menuItem.inventory, $price: req.body.menuItem.price, $menuItemId: req.params.menuItemId}, function(error) {
            if (error) {
                next(error);
            } else {
                db.get("SELECT * FROM MenuItem WHERE id = $menuItemId", {$menuItemId: req.params.menuItemId}, (error, menuItem) => {
                    if (error) {
                        next(error);
                    } else {
                        res.status(200).send({menuItem: menuItem});
                    }
                });
            }
        });
    }
});

menuItemsRouter.delete('/:menuItemId', (req, res, next) => {
    db.run("DELETE FROM MenuItem WHERE id = $menuItemId", {$menuItemId: req.params.menuItemId}, function(error) {
        if (error) {
            next(error);
        } else {
            res.status(204).send();
        }
    });
});

module.exports = menuItemsRouter;