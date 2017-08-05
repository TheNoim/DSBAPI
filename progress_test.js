const LIB = require('./index');

const USERNAME = process.env.DSBUSERNAME;
const PASSWORD = process.env.PASSWORD;

const lib = new LIB(USERNAME, PASSWORD);

lib.on('progress', function (p) {
	console.log(p);
});

lib.getData().then(() => {
	console.log("F");
});