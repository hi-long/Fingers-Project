var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	password: String,
	username: 
		{
			type: String,
			unique: true,
			require: true
		},
	nickname: 
		{
			type: String,
			unique: true,
			require: true
		},
	description: String,
	cover: 
		{
			type: String,
			default: "https://res.cloudinary.com/lofstrange/image/upload/v1589332279/xcpiueyuogtob2jizie1.jpg"
		},
	coverId: {
			type: String,
			default: "https://res.cloudinary.com/lofstrange/image/upload/v1589332279/xcpiueyuogtob2jizie1.jpg"
		},
	posts: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post"
		}
	],
	notifications: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Notification"		
		}
	],
	followers: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		}
	],
	followings: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		}
	],
	totalLikes: Number,
	fame: String,
	resetPasswordToken: String,
	resetPasswordExpires: Date
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);