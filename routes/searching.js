var express = require("express"),
	router = express.Router();

var User = require("../models/user")

//--------------------//
// SEARCHING
//--------------------//
router.get("/search/:nickname", async (req, res) => {
	try {
		let users = [];
		var nickname = req.params.nickname;
		const foundUsers = await User.find(
			{
				nickname: new RegExp(nickname)
			})
		users.push(foundUsers);
		const suggestions = await User.find().limit(2).sort({"followers" : "desc"});
		
		suggestions.forEach(suggestion => {
			console.log(suggestion.followers.length);
		})
		res.json(foundUsers);
	}
	catch (err) {
		console.log(err);
	}
})

module.exports = router;
