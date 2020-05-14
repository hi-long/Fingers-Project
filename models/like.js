var mongoose = require("mongoose");

var likeSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	date: {
		type: Date,
		default: Date.now()
	}
})

module.exports = mongoose.model("Like", likeSchema);