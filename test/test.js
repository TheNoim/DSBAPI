const { describe, it } = require('mocha');
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;

// Load .env for testing purpose
require('dotenv').config();

chai.should();

describe('Library', function() {
	const DSB = require('../dist/cjs/index');

	it('should return a function', function() {
		DSB.should.be.a('function');
	});

	it('should have findMethodInData()', function() {
		DSB.should.have.property('findMethodInData');
		assert.isFunction(DSB.findMethodInData);
	});
});

describe('DSB Instance', function() {
	const DSB = require('../dist/cjs/index');
	const dsb = new DSB(process.env.DSBUSERNAME, process.env.PASSWORD);

	it('should be a instanceof DSB', function() {
		expect(dsb).to.be.an.instanceOf(DSB);
	});

	it('should have the right values', function() {
		expect(dsb).to.have.property('username', process.env.DSBUSERNAME);
		expect(dsb).to.have.property('password', process.env.PASSWORD);
	});

	it('should have fetch()', function() {
		assert.isDefined(dsb.fetch);
		assert.isFunction(dsb.fetch);
	});
});

describe('functions', function() {
	const DSB = require('../dist/cjs/index');
	const dsb = new DSB(process.env.DSBUSERNAME, process.env.PASSWORD);

	it('should not throw', function(done) {
		dsb.fetch()
			.then(() => {
				done();
			})
			.catch(e => {
				done(e);
			});
	});

	it('should return a object', async function() {
		const data = await dsb.fetch();
		assert.isObject(data);
	});

	it('should have Resultcode and should be 0', async function() {
		const data = await dsb.fetch();
		expect(data).to.have.property('Resultcode', 0);
	});

	it('should have ResultMenuItems and should be an array', async function() {
		const data = await dsb.fetch();
		expect(data).to.have.property('ResultMenuItems');
		assert.isArray(data['ResultMenuItems']);
	});

	it('should extract data and not throw', async function() {
		const data = await dsb.fetch();
		expect(() => DSB.findMethodInData('timetable', data)).to.not.throw();
		expect(() => DSB.findMethodInData('tiles', data)).to.not.throw();
		expect(() => DSB.findMethodInData('news', data)).to.not.throw();
	});

	it('should be at least one a object', async function() {
		const data = await dsb.fetch();
		const timetables = DSB.findMethodInData('timetable', data);
		const tiles = DSB.findMethodInData('tiles', data);
		const news = DSB.findMethodInData('news', data);
		if (
			!(
				typeof timetables === 'object' ||
				typeof tiles === 'object' ||
				typeof news === 'object'
			)
		)
			throw new Error(
				'Method timetable, tiles and news are all not an object.'
			);
	});
});
