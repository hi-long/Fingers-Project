export function validateEmail(emailInput, message){
	emailInput.on("input", () => {
		let newEmail = emailInput.val();
		axios.get("/check/email/" + newEmail)
			.then((response) => {
				if(response.data == "invalid") {
					message.html("This email is used before !").css('color', 'cadetblue');
				} else {
					message.html("").css('color', 'green');
					return true;
				}
			})
			.catch((err) => {
				console.log(err);
			})
	})
}

export function validatePassword(passwordInput, confirmation, message){
	(passwordInput, confirmation).on('keyup', function () {
		if (passwordInput.val() == confirmation.val()) {
			message.html('').css('color', 'green');
			return true;
	  	} else {  
   			message.html('Not Matching').css('color', 'cadetblue');
		} 
	});
}

export function validateNickname(nicknameInput) {
	nicknameInput.on("input", () => {
		let newNickname = nicknameInput.val();
		axios.get("/check/nickname/" + newNickname)
			.then((response) => {
				console.log(response.data);
				return response.data;
			})
			.catch((err) => {
				console.log(err);
			})
	})
}