const express = require('express');
const bodyParser = require("body-parser");
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);

app.route('/articles')
    .get(function(req, res){
        Article.find(function(err, foundArticles){
            if(err){
                res.send(err);
            }
            else{
                res.send(foundArticles);
            }
        });
    })
    .post(function(req, res){
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save(function(err){
            if(err){
                res.send(err);
            }
            else{
                res.send("Successfully Added a new article");
            }
        });
    })
    .delete(function(req, res){
        Article.deleteMany({}, function(err){
            if(err){
                res.send(err);
            }
            else{
                res.send("Successfully Deleted all article");
            }
        });
    });

// Request targeting a specific article 

app.route("/articles/:articleTitle")
    .get(function(req, res){
        Article.findOne({title: req.params.articleTitle}, 
            function(err, foundArticles){
                if(foundArticles){
                    res.send(foundArticles);
                }
                else{
                    res.send("No articles matching that title");
                }
        });
    })
    .put(function(req, res){
        Article.update(
            {title: req.params.articleTitle},
            {title: req.query.title, content: req.query.content},
            function(err){
                if(!err){
                res.send('Successfully updated the article "'+ req.query.title + '".' );
                }
            }
        );
    })
    .patch(function(req, res){
        Article.update(
            {title: req.params.articleTitle},
            {$set: req.query},
            function(err){
                if(!err){
                    res.send("Successfully updated the article");
                }
                else{
                    res.send(err);
                }
            })
    });
    

var port = 5501;
app.listen(port, function() {
    console.log("Server started on port " + port + ".");
});