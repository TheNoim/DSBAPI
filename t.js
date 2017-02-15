/**
 * Created by nilsbergmann on 15.02.17.
 */
const DSB = require('./index');
const path = require('path');
const dsb = new DSB(326781, 'MCG-Plan', path.join(__dirname, 'cache.json'));
dsb.getData().then(Data => {
    console.log(JSON.stringify(Data));
}).catch(console.error);