var mongoose = require("mongoose");

var songSchema = new mongoose.Schema({
	sounds: [],
	theme: [],
	effects: [],
	time: []
})

module.exports = mongoose.model("Song", songSchema);