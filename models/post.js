var mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
	cover: {
		type: String,
		default: "https://images.unsplash.com/photo-1565551069968-949366aa4cac?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80"
	},
	coverId: String,
	description: String,
	song: 
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Song"
		},
	user: 
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
	likes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Like"
		}
	],
	comments: [
      	{
        	type: mongoose.Schema.Types.ObjectId,
         	ref: "Comment"
    	}
   	]
})

module.exports = mongoose.model("Post", postSchema);
