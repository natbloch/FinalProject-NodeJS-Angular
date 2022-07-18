const express = require('express');
const router = express.Router();
const Album = require('../models/album');


//Get the 23 albums for the landing page
  router.get('/', (req, res) =>{
    Album.getAllAlbums((err,albums) =>{
      if(err) throw err;
        res.render('index', {albums: albums.slice(0,23)});
    });
  });


module.exports = router;
