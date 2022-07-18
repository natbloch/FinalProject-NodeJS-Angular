const mongoose = require('mongoose');
const config = require('../config/usersdb');

//Client Schema
const AlbumSchema = mongoose.Schema({
  name: {
    type: String
  },
  artist: {
    type: String
  },
  dateadded: {
    type: Date
  },
  genre: {
    type: String
  },
  image: {
    type: String
  },
  description: {
    type: String
  },
  details: {
    type: String
  },
  year: {
    type: Number
  },
  price: {
    type: Number
  },
  availability: {
    type: Number
  }
});

const Album = module.exports = mongoose.model('Album', AlbumSchema);

module.exports.getAllAlbums = (callback) => {
    Album.find({}, null, {sort: {dateadded: -1}},callback);
}

module.exports.getAllAlbumsGenre = (genre, callback) => {
    Album.find({genre:genre}, null, {sort: {dateadded: -1}},callback);
}

module.exports.getAlbumById= (id, callback) => {
    Album.findOne({_id:id}, callback);
}

module.exports.addAlbum = (newAlbum, callback) => {
  newAlbum.save(callback);
}

module.exports.searchAlbumsByNameOrArtist = (input, callback) => {
  let searchcriteria = {"$regex": input, "$options": "i" };
  Album.find({ $or: [{name: searchcriteria}, {artist: searchcriteria}] }, callback);
}
module.exports.searchbase64 = (callback) => {

  Album.find({dateadded: {"$lt": new Date("2017-04-14T00:00:00.000Z")}}, callback);
}
