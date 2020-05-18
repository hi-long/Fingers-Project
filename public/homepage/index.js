$(document).scroll((event) => {
	var $nav = $(".navbar");
	$nav.toggleClass("scrolled", $(event.currentTarget).scrollTop() > $nav.height());
});

$(".square-container").on("mouseenter", ".content", (event) => {
	$("i", $(event.currentTarget)).show();
})

$(".square-container").on("mouseleave", ".content", (event) => {
	$("i", $(event.currentTarget)).hide();
})

$("#back-btn").attr("href", "/");
$("#forward-btn").attr("href", "/setting");

// --------------------- //
// FOLLOW HANDLING		 //
// --------------------- //
var followBtn = $("#follow-btn"),
	numberOfFollowers = $("#n-o-followers"),
	userId = $("h1").attr("data-user-id");	

followBtn.on("click", () => {
	let followed = followBtn.text();
	console.log(followed);
	if(followed == "Follow"){
		followBtn.text("Followed");
		axios.put(`/${userId}`, {followed : false})
		.then((response) => {
			followBtn.css("background-color", "cadetblue");
			numberOfFollowers.text(parseInt(numberOfFollowers.text()) + 1);
		})
		.catch((error) => {
			console.log(error);
		});
	} else if(followed == "Followed") {
		followBtn.text("Follow");
		axios.put(`/${userId}`, {followed : true})
		.then((response) => {
			followBtn.css("background-color", "green");
			numberOfFollowers.text(parseInt(numberOfFollowers.text()) - 1);
		})
		.catch((error) => {
			console.log(error);
		});
	}
})

const fDivFollowBtn = $(".fDiv-follow-btn");
fDivFollowBtn.on("click", (event) => {
	let followBtn = $(event.currentTarget),
		userId = followBtn.parent().attr("data-user-id");
	let followed = followBtn.text();
	console.log(followed);
	if(followed == "Follow"){
		followBtn.text("Followed");
		axios.put(`/${userId}`, {followed : false})
		.then((response) => {
			followBtn.css("background-color", "cadetblue");
		})
		.catch((error) => {
			console.log(error);
		});
	} else if(followed == "Followed") {
		followBtn.text("Follow");
		axios.put(`/${userId}`, {followed : true})
		.then((response) => {
			followBtn.css("background-color", "green");
		})
		.catch((error) => {
			console.log(error);
		});
	}
})

// TOGGLE FOLLOWERS DIV
const followersDiv = $(".followers-div"),
	  escapeBtn = $("#escape-btn");

numberOfFollowers.on("click", () => {
	followersDiv.addClass("followers-div-toggle");
	$(".main").attr('disabled', true);
})

escapeBtn.on("click", () => {
	followersDiv.removeClass("followers-div-toggle");
	$(".main").removeAttr('disabled');
})