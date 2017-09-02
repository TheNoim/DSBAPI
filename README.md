[![Build Status](https://travis-ci.org/TheNoim/DSBAPI.svg?branch=master)](https://travis-ci.org/TheNoim/DSBAPI)

## Installation

Use your favorite package manager for javascript

```bash
yarn add dsbapi
# Or
npm install dsbapi --save
```

## How to use:

### Read the Documentation

##### [http://noim.me/DSBAPI/dsbapi/3.0.0/](http://noim.me/DSBAPI/dsbapi/3.0.0/)

### In NodeJS

```javascript
const DSB = require('dsbapi');

const dsb = new DSB('USERNAME', 'PASSWORD');

dsb.fetch().then(data => {
    const timetables = DSB.findMethodInData('timetable', data);
    const tiles = DSB.findMethodInData('tiles', data);

    // Work with it
}).catch(e => {
    // An error occurred :(
    console.log(e);
});
```

Or with modern javascript

```javascript
import DSB from 'dsbapi';

const dsb = new DSB('USERNAME', 'PASSWORD')

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
    const dsb = new DSB("USERNAME", "PASSWORD");

    // ... go on
</script>
```
