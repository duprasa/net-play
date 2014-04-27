function isPalindrome(number) {
	if(typeof number !== 'number') {
		return NaN;
	}

	//Array of numbers which composes initial number
	var array = (number + '').split('');

	//Used to determine palindromes later
	var len;

	//Deal with exceptions
	if(array.length === 1) {
		return true;
	}
	if(array.length === 0) {
		return false;
	}


	//remove middle number if number isn't even in digits.
	if(array.length % 2 !== 0) {
		//Splicing!
		array.splice(Math.floor(array.length/2),1);
	}

	var isPalindrome = true;
	var len = array.length;
	//Compare
	for(var i = 0; i < len / 2; i++) {
		if(array[i] !== array[len - 1 - i]) {
			isPalindrome = false;
			break;
		}
	}

	return isPalindrome;

}

var palindromes = [];

for(var a = 999; a > 99; a--) {
	for(var b = 999; b > 99; b--) {
		if(isPalindrome(a * b)) {
			palindromes.push(a*b);
		}
	}
}

var biggest = 0;
for(var p in palindromes) {
	if(palindromes[p] > biggest) {
		biggest = palindromes[p];
	}
}

console.log(biggest);


