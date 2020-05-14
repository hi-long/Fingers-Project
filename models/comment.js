var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
	user:
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
	date: 
		{
			type: Date,
			default: Date.now()
		},
	content: String
})

module.exports = mongoose.model("Comment", commentSchema);