export function timeConverter(time){
	const dd = Math.floor(time / 1000 / 60 / 60 / 24);
	const hh = Math.floor(time / 1000 / 60 / 60);
	const mm = Math.floor(time / 1000 / 60);
	if (dd >= 1){
		return dd + 'd ago';
	}
	else if (hh >= 1 && hh < 24) {
		return hh + 'h ago';
	}
	else if (mm >= 1 && mm < 60) {
		return mm + 'm ago';
	}
}