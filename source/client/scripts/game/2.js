var fibonacci = [];

var lastestFib = 1;
var lastFib = 1;
fibonacci.push(1);
while((lastestFib + lastFib) < 4000000) {
	fibonacci.push(lastestFib + lastFib);
	var temp = lastestFib;
	lastestFib = lastFib;
	lastFib = temp + lastFib;
}

var evens = [];

for(var i in fibonacci) {
	if(fibonacci[i] % 2 == 0) {
		evens.push(fibonacci[i]);
	}
}

var sum = 0;
for(var s in evens) {
	sum += evens[s];
}