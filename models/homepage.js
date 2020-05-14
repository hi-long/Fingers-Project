var mongoose = require("mongoose");

var homepageSchema = new mongoose.Schema({
	posts: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Post"
	}],
	Notifications: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Notification"
	}]
})

module.exports = mongoose.model("Homepage", homepageSchema);