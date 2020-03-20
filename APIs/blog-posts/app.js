const express = require("express");
const fetch = require("node-fetch");
const app = express();
const PORT = process.env.PORT || 3000;

const request = async (posts, tag) => {
    const response = await fetch(`https://hatchways.io/api/assessment/blog/posts?tag=${tag}`);
    const jsonResponse = await response.json();
    for (let i = 0; i < jsonResponse.posts.length; i++) {
        if (!posts.some(post => {
            return post.id === jsonResponse.posts[i].id;
        })) {
            posts.push(jsonResponse.posts[i])
        }
    }
};

const requests = async (posts, tags) => {
    for (let i = 0; i < tags.length; i++) {
        await request(posts, tags[i]);
    }
};

const sortAscending = (posts, filter) => {
    if (filter === "") {
        posts.sort(function(a, b) {
            return a["id"] - b["id"];
        });
    } else {
        posts.sort(function(a, b) {
            return a[filter] - b[filter];
        });
    }
};

const sortDescending = (posts, filter) => {
    if (filter === "") {
        posts.sort(function(a, b) {
            return b["id"] - a["id"];
        });
    } else {
        posts.sort(function(a, b) {
            return b[filter] - a[filter];
        })
    }
};

const sortPosts = (posts, filter, direction) => {
    if (direction === "" || direction === "asc") {
        sortAscending(posts, filter);
    } else {
        sortDescending(posts, filter);
    }
};

const sendPosts = async (res, posts, tags, sortBy, direction) => {
    await requests(posts, tags);
    sortPosts(posts, sortBy, direction);
    res.status(200).send({posts: posts});
};

app.get("/ping", (req, res, next) => {
    res.status(200).send({success: true});
});

app.get("/posts", (req, res, next) => {
    if (!req.query.tags) {
        res.status(400).send({error: "Tags parameter is required"});
    } else {
        if (req.query.sortBy && ["id", "reads", "likes", "popularity"].indexOf(req.query.sortBy) <= -1) {
            res.status(400).send({error: "sortBy parameter is invalid"});
        } else if (req.query.direction && ["desc", "asc"].indexOf(req.query.direction) <= -1) {
            res.status(400).send({error: "direction parameter is invalid"});
        } else {
            let sortBy = "";
            let direction = "";
            if (req.query.sortBy) {
                sortBy = req.query.sortBy;
            }
            if (req.query.direction) {
                direction = req.query.direction;
            }
            const posts = []
            let tags = req.query.tags.split(",");
            sendPosts(res, posts, tags, sortBy, direction);
        }
    }
});

app.listen(PORT, () => {
    console.log("Server running on port: " + PORT);
});