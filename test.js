const jsome = require('jsome');
const Joi = require('joi');
const USERNAME = process.env.DSBUSERNAME;
const PASSWORD = process.env.PASSWORD;
if (!USERNAME || !PASSWORD) {
    console.error("No USERNAME or no PASSWORD in env.");
    process.exit(1);
}

console.log(`USERNAME: ${USERNAME} | PASSWORD: ${PASSWORD}`);

const LIB = require('./index').default;
const dsb = new LIB(USERNAME, PASSWORD);

const responseSchema = Joi.object().keys({
    "Resultcode": Joi.number().integer().min(0).max(0).required(),
    "ResultMenuItems": Joi.array().length(2).items(Joi.object().keys({
        "Index": Joi.number().integer().required(),
        "Title": Joi.string().required()
    })).required()
}).unknown(true);

async function test() {
    const data = await dsb.fetch(console.log);
    const val = responseSchema.validate(data);
    if (val.error) throw new Error(val.error);
    return {};
}

test().then(jsome).catch(e => {
   console.error(e);
   process.exit(2);
});