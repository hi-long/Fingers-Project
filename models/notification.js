var mongoose = require("mongoose");

var notificationSchema = new mongoose.Schema({
	post: 
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post"
		},
	follow: 
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Follow"
		},
	comment:
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		},
	like:
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Like"	
		},
	seen: {
		type: Boolean,
		default: false
	},
	date: {
		type: Date,
		default: Date.now()
	}
})

module.exports = mongoose.model("Notification", notificationSchema);