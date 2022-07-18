const express = require('express');
const router = express.Router();
const config = require('../config/usersdb');
const Album = require('../models/album');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const page = path.join(__dirname + '/../public/pageforaddingalbums/addalbum.htm');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
const async = require('async');

router.get('/', (req, res) => {
  res.render('index');
});

//Get the form page for adding new albums (not part of the project)
/*router.get('/formpage', (req, res) => {
  res.status(200).sendFile(page);
});*/



//Get the albums for the main page
  router.get('/getallalbums/:page', (req, res) =>{
    let pageviewed = req.params.page;
    Album.getAllAlbums((err,albums) =>{
      if(err) throw err;
      if(pageviewed == 0){
        let jsonresp =albums;
        let imgarray =[];
        for(i=0;i<jsonresp.length;i++){
          let base64img=path.join(__dirname + '/../public/img/'+jsonresp[i].image);
          imgarray.push(base64img);
        }

        function readAsync(file, callback) {
            fs.readFile(file, 'utf8', callback);
        }

        async.map(imgarray, readAsync, function(err, results) {
          if(err) return (err);
          for(var i in results){
            jsonresp[i].image = results[i];
          }
          res.json(jsonresp);
        });
      }else if(pageviewed == 1){
        //Get the albums for the webpage A: the 23 first
        let jsonresp =albums.slice(0,22);
        let imgarray =[];
        for(i=0;i<jsonresp.length;i++){
          let base64img=path.join(__dirname + '/../public/img/'+jsonresp[i].image);
          imgarray.push(base64img);
        }

        function readAsync(file, callback) {
            fs.readFile(file, 'utf8', callback);
        }

        async.map(imgarray, readAsync, function(err, results) {
          if(err) return (err);
          for(var i in results){
            jsonresp[i].image = results[i];
          }
          res.json(jsonresp);
        });
      }else if (pageviewed == 2) {
        //Get the albums for the webpage B: the remaining
        let jsonresp =albums.slice(23);
        let imgarray =[];
        for(i=0;i<jsonresp.length;i++){
          let base64img=path.join(__dirname + '/../public/img/'+jsonresp[i].image);
          imgarray.push(base64img);
        }

        function readAsync(file, callback) {
            fs.readFile(file, 'utf8', callback);
        }

        async.map(imgarray, readAsync, function(err, results) {
          if(err) return (err);
          for(var i in results){
            jsonresp[i].image = results[i];
          }
          res.json(jsonresp);
        });
      }
    });
  });

//Get All Albums of a genre
router.get('/getallalbumsgenre/:genre', (req, res) =>{
  let genre = req.params.genre;
  Album.getAllAlbumsGenre(genre, (err,albums) =>{
    if(err) throw err;
      let jsonresp =albums;
      let imgarray =[];
      for(i=0;i<jsonresp.length;i++){
        let base64img=path.join(__dirname + '/../public/img/'+jsonresp[i].image);
        imgarray.push(base64img);
      }

      function readAsync(file, callback) {
          fs.readFile(file, 'utf8', callback);
      }

      async.map(imgarray, readAsync, function(err, results) {
        if(err) return (err);
        for(var i in results){
          jsonresp[i].image = results[i];
        }
        res.json(jsonresp);
      });
  });
});


//Search an album from the research bar

router.post('/search', (req,res) => {
  let research = req.body.research;
  Album.searchAlbumsByNameOrArtist(research, (err, albums) =>{
    if(err) throw err;
    let jsonresp = albums;
    let imgarray =[];
    for(i=0;i<jsonresp.length;i++){
      let base64img=path.join(__dirname + '/../public/img/'+jsonresp[i].image);
      imgarray.push(base64img);
    }

    function readAsync(file, callback) {
        fs.readFile(file, 'utf8', callback);
    }

    async.map(imgarray, readAsync, function(err, results) {
      if(err) return (err);
      for(var i in results){
        jsonresp[i].image = results[i];
      }
      res.json(jsonresp);
    });


  });
});


//Get an Album from its Id
router.get('/search/:id', (req,res) => {
  let albumid = req.params.id;
  Album.getAlbumById(albumid, (err, album) =>{
    if(err) throw err;
    let jsonresp = album;
    let base64img=path.join(__dirname + '/../public/img/'+jsonresp.image);

    //function readAsync(file, callback) {
      fs.readFile(base64img, 'utf8', function(err, result) {
        if(err) return (err);
        jsonresp.image = result;
        res.json(jsonresp);
      });
    //}

  });
});

module.exports = router;
