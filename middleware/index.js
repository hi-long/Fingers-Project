const middlewareObj = {
	isSignIn: function isSignedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		res.redirect('/signin');
	}
}

module.exports = middlewareObj;