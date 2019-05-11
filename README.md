![Build Status](https://action-badges.now.sh/TheNoim/DSBAPI) [![Greenkeeper badge](https://badges.greenkeeper.io/TheNoim/DSBAPI.svg)](https://greenkeeper.io/)

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

##### [http://noim.me/DSBAPI/dsbapi/](http://noim.me/DSBAPI/dsbapi/)

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

### Browser

Install it or download the index.browser.js file from the dist/ folder.

##### Note:

It will probably not work in a normal browser client because of CORS policy

```html
<script src="location/to/index.browser.js"></script>
<script>
	const dsb = new DSB('USERNAME', 'PASSWORD');

	// ... go on
</script>
```
