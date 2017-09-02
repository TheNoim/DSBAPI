const jsome = require('jsome');
const Joi = require('joi');
const USERNAME = process.env.DSBUSERNAME;
const PASSWORD = process.env.PASSWORD;
if (!USERNAME || !PASSWORD) {
    console.error("No USERNAME or no PASSWORD in env.");
    process.exit(1);
}

console.log(`USERNAME: ${USERNAME} | PASSWORD: ${PASSWORD}`);

const DSB = require('./index.es');
const dsb = new DSB(USERNAME, PASSWORD);

const responseSchema = Joi.object().keys({
    "Resultcode": Joi.number().integer().min(0).max(0).required(),
    "ResultMenuItems": Joi.array().length(2).items(Joi.object().keys({
        "Index": Joi.number().integer().required(),
        "Title": Joi.string().required()
    }).unknown(true)).required()
}).unknown(true);

async function test() {
    const data = await dsb.fetch(console.log);
    const val = responseSchema.validate(data);
    if (val.error) throw new Error(val.error);
    console.log("Passed very basic validation. Try to extract important data.");
    DSB.findMethodInData('timetable', data);
    DSB.findMethodInData('news', data);
    DSB.findMethodInData('tiles', data);
}

test().then(() => {
    console.log("Test passed.");
    process.exit(0);
}).catch(e => {
   console.error(e);
   process.exit(2);
});