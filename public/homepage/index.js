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
	followersDiv = $("#followers-div"),
	escapeBtn = $("#escape-btn"),
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

numberOfFollowers.on("click", () => {
	followersDiv.toggleClass("followers-div-show");
})

escapeBtn.on("click", () => {	
	followersDiv.toggleClass("followers-div-show");
})
