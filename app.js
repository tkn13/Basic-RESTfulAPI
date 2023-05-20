const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');

const articleSchema = new mongoose.Schema({
    title : String,
    content : String
});

const Article = mongoose.model('Articles', articleSchema);

const port = 3000;

app.route('/articles')
    .get((req, res)=>{
        Article.find({})
        .then(doc=>{
            res.send(doc)
        })
        .catch(err =>{
            res.send(err);
        })
    })
    .post((req, res)=>{    
        const newArticle = new Article({
            title : req.body.title,
            content : req.body.content
        });
        newArticle.save()
        .exec()
        .then(()=>{
            res.send("Save successfully");
        })
        .catch(err =>{
            res.send(err);
        })
    })
    .delete((req, res)=>{
        Article.deleteMany({})
        .exec()
        .then(()=>{
            res.send("Delete successfully");
        })
        .catch(err =>{
            res.send(err);
        })
    });

app.route('/articles/:articleTitle')
    .get((req, res)=>{
        Article.findOne({title : req.params.articleTitle})
        .then(doc=>{
            if(doc){
                res.send(doc);
            }
            else{
                res.send("Article not found")
            }
        })
        .catch(err=>{
            res.send(err);
        })
    })
    .put((req, res)=>{
        Article.replaceOne(
            {title : req.params.articleTitle},
            {title : req.body.title, content : req.body.content})
        .exec()
        .then(()=>{
            res.send("put successfully");
        })
        .catch(err=>{
            res.send(err);
        })
        
    })

    .patch((req,res)=>{
        Article.updateOne(
            {title : req.params.articleTitle},
            {$set : req.body}
        )
        .exec()
        .then(()=>{
            res.send("patch successfully");
        })
        .catch(err=>{
            res.send(err);
        })
    })
    .delete((req,res)=>{
        Article.deleteOne({title: req.params.articleTitle})
        .exec()
        .then(()=>{
            res.send("delete successfully");
        })
        .catch(err=>{
            res.send(err);
        })
    })


app.listen(port, function(){
    console.log(`Server started on port ${port}`);
})