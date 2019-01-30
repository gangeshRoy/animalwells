module.exports = ValidationClass = function () {
	this.id = 0;
};
ValidationClass.prototype.getRandomInt = function (min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
};
ValidationClass.prototype.generateId = function () {

	var dTime = new Date().getTime();
	var genaratedId;
	var rNum = Math.floor(Math.random() * (9 - 1)) + 1;
	genaratedId = '' + rNum + '' + dTime;
	//console.log(rNum);
	return genaratedId;
};

ValidationClass.prototype.getPassword = function () {
	var rNum = Math.floor(Math.random() * 1000000 + 1);
	return rNum;
};

ValidationClass.prototype.generatePassword = function () {
	var chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var string_length = 14;
	var randomstring = '';
	var charCount = 0;
	var numCount = 0;

	for (var i = 0; i < string_length; i++) {
		if ((Math.floor(Math.random() * 2) == 0) && numCount < 3 || charCount >= 5) {
			var rnum = Math.floor(Math.random() * 10);
			randomstring += rnum;
			numCount += 1;
		} else {
			var rnum = Math.floor(Math.random() * chars.length);
			randomstring += chars.substring(rnum, rnum + 1);
			charCount += 1;
		}
	}
	return randomstring.toLowerCase();
};


