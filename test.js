const USERNAME = process.env.DSBUSERNAME;
const PASSWORD = process.env.PASSWORD;
if (!USERNAME || !PASSWORD) {
    console.error("No USERNAME or no PASSWORD in env.");
    process.exit(1);
}

console.log(`USERNAME: ${USERNAME} | PASSWORD: ${PASSWORD}`);

const LIB = require('./index');
const dsb = new LIB(USERNAME, PASSWORD);

// Stage 1: API V2
dsb.getData().then((data) => {
    if (!data) return Promise.reject('Stage 1 failed.');
    console.log('Stage 1 passed!');
    return Promise.resolve();
}).then(() => {
    // Stage 2: Get UUID
    return dsb.getUUIDV1();
}).then(uuid => {
    if (!uuid) return Promise.reject('Stage 2 failed.');
    console.log('Stage 2 passed!');
    // Stage 3: Get data v1 with uuid
    return dsb.getDataWithUUIDV1(uuid);
}).then(data => {
    if (!data) return Promise.reject('Stage 3 failed.');
    console.log('Stage 3 passed!');
    return Promise.resolve();
}).then(() => {
    // Stage 4: Get api v1
    return dsb.getDataV1();
}).then(data => {
    if (!data) return Promise.reject('Stage 4 failed.');
    console.log('Stage 4 passed!');
    return Promise.resolve();
}).then(() => {
    console.log('All stages passed!');
    process.exit(0);
}).catch(e => {
    console.error(`Something went wrong.`);
    console.error(e);
    process.exit(2);
});