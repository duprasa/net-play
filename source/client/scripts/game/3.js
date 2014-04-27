var target = 600851475143;
var largestFactor;

for(var i = Math.ceil(target/2);i > 1;i--) {
	if(target % i == 0) {
		largestFactor = i;
		console.log("Found it! It's : " + i);
		break;
	}
}


//Attempt 2

var target = 600851475143;
var largestFactor;

getLargestPrime(2,target,target);

function getLargestPrime(n,currentTarget,target) {
	for(var n = n; n < Math.sqrt(target); n++) {
		if(currentTarget % n == 0) {
			largestFactor = n;
			console.log(n);
			getLargestPrime(n,currentTarget/n,target)
			break;
		}
	}
}