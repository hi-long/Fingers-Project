var mongoose = require("mongoose");

var followSchema = new mongoose.Schema({
	from:
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
	to: 
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		}
})

module.exports = mongoose.model("Follow", followSchema);