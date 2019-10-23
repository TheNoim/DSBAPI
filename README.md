![Build Status](https://wdp9fww0r9.execute-api.us-west-2.amazonaws.com/production/badge/TheNoim/DSBAPI) [![Greenkeeper badge](https://badges.greenkeeper.io/TheNoim/DSBAPI.svg)](https://greenkeeper.io/)

## Installation

Use your favorite package manager for javascript

```bash
yarn add dsbapi
# Or
npm install dsbapi --save
```

_Note: Requires `node >= 8`_

## How to use:

### Read the Documentation

##### [https://noim.me/DSBAPI/](https://noim.me/DSBAPI/)

### In NodeJS

```javascript
const DSB = require('dsbapi');

const dsb = new DSB('USERNAME', 'PASSWORD');

dsb.fetch()
	.then(data => {
		const timetables = DSB.findMethodInData('timetable', data);
		const tiles = DSB.findMethodInData('tiles', data);

		// Work with it
	})
	.catch(e => {
		// An error occurred :(
		console.log(e);
	});
```

Or with modern javascript

```javascript
import DSB from 'dsbapi';

const dsb = new DSB('USERNAME', 'PASSWORD');

async function getMyShit() {
	const data = await dsb.fetch();
	const timetables = DSB.findMethodInData('timetable', data);
	const tiles = DSB.findMethodInData('tiles', data);

	// YEAH
}

getMyShit();
```

### Fetch V1

The old iPhone API is not active anymore. You need to use the new fetch() method. After you got the data with the fetch() method you can find the timetables with the findMethodInData method. Look at the example above.

### Browser

It will probably not work in the browser. The dsb does not set cors, so you are not able to use this module on the client side of your website. You can only use it on the backend.
