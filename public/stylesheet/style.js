import {timeConverter} from '/mediaPlayer/converter.js'

// const swup = new Swup();
/* ----------------- */
/*  NAVBAR			 */
/* ----------------- */
$(document).scroll(function () {
	var $nav = $(".navbar");
	$nav.toggleClass("scrolled", $(this).scrollTop() > $nav.height());
});

$(".navigation-btn a").on("mouseenter mouseleave", () => $(this).fadeToggle('quick'));

/* ----------------- */
/*  CONVERT TIME	 */
/* ----------------- */

let notificationsDate = $(".noti-date");
for(let i = 0; i < notificationsDate.length; i ++){
	let notification = notificationsDate[i];
	let notiDate = notification.textContent;
	notification.textContent = (timeConverter(parseInt(notiDate)));
}

/*  TOGGLE		 */
let notis = $(".noti"),
	numberOfUnseenNotis = $("#n-o-unseen");

if(numberOfUnseenNotis.text() == 0){
	$(".fa-bell").removeClass("rotating");
} else {
	$(".fa-bell").addClass("rotating");
}

// SEEN NOTIFICATION
notis.on("click", function(){
	var notiId = $(this).attr("data-noti-id");
	axios.put(`/noti/${notiId}`, {})
		.then((response) => {
		})
		.catch((error) => {
			console.log(error);
		});	
})

// CONTENT
$(".square-container").on("mouseenter", ".content", function(){
	$("i", this).show();
})

$(".square-container").on("mouseleave", ".content", function(){
	$("i", this).hide();
})
/* ----------------- */
/*  SEARCH TAB		 */
/* ----------------- */
var searchDiv = $("#search-div"),
	search = $("#search-input"),
	result = $("#result"),
	user = $(".one-user");

searchDiv.on("mouseenter", function(){
	search.css({
		"width": "240px",
		"padding": "0 6px"
	})
	result.css({
		width: "100%"
	})
	$("#search-btn").css({
		"background": "white",
		"color": "black"
	})
})

searchDiv.on("mouseleave", () => {
	if(search.val() == ""){
		search.css({
			"width": "0px",
			"padding": "0"
		})
		result.css({
			width: "0px"
		})
		$("#search-btn").css({
			"background": "#2f3640",
			"color": "#e84118"
		})
	}
})

search.on("input", function(event){
	var text = ($(this)).val();
	axios.get('/search/' + text)
		.then((response) => {
			// handle success
			result.empty();
			var foundUsers = response.data;
			if(foundUsers.length == 0){
				result.append("   No result found!  ");
			}
			foundUsers.forEach((user) => {
				var id = user._id,
					cover = user.cover,
					nickname = user.nickname;
				var userDiv = 
					'<div class="user-found">' + 
						'<a href="/' + id + '">' + 
							'<div class="row">' + 
								'<div class="col-2 cover"><img src="' + cover + '"></div>' + 
								'<div class="col-6 username"><p>' + nickname + '</p></div>' + 
							'</div>' + 
						'</a>' + 
					'</div>';
				result.append(userDiv);
			})
		})
		.catch(function (error) {
			// handle error
			console.log(error);
		})
})

/* ----------------- */
/*  ASSISTIVE TOUCH  */
/* ----------------- */
var assitiveTouch = $(".assistive-touch"),
    ulti = $(".ulti"),
    toHome = $("#home"),
    toCreation = $("#creation"),
    toSetting = $("#setting"),
    toDiscover = $("#discover");

var showing = false;

ulti.css("display", "none");

assitiveTouch.draggable();

assitiveTouch.on("mouseenter mouseleave", () => {
    showing = !showing;
    if(showing){
        toHome.css({
            "top": "-110%"
        });
        toCreation.css({
            "left": "-110%"
        })
        toSetting.css({
            "top": "110%"
        })
        toDiscover.css({
            "left": "110%"
        })
    }
    else {
        $(".inner").css({
            "top": "0",
            "bottom": "0",
            "left": "0",
            "right": "0"
        })
    }
})

/* ----------------- */
/*  CONTACT US		 */
/* ----------------- */
const triggerBtn = $(".trigger-btn");
let toggleBtns = $(".toggle-btn");

triggerBtn.on("click", () => {
	console.log("clicked");
	toggleBtns.toggleClass("toggle");
})
