var express = require("express"),
	router = express.Router();

var User = require("../models/user")

//--------------------//
// SEARCHING
//--------------------//
router.get("/search/:nickname", async (req, res) => {
	try {
		var nickname = req.params.nickname;
		const foundUsers = await User.find(
			{
				nickname: new RegExp(nickname)
			})
		res.json(foundUsers);
	}
	catch (err) {
		console.log(err);
	}
})

module.exports = router;
