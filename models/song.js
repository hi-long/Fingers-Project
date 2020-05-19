var mongoose = require("mongoose");

var songSchema = new mongoose.Schema({
	canvasSize: {
		width: Number,
		height: Number,
	},
	sounds: [],
	theme: [],
	effects: [],
	time: []
})

module.exports = mongoose.model("Song", songSchema);