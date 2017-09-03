import {describe, it} from 'mocha';
import chai from 'chai';
const expect = chai.expect;
const assert = chai.assert;

chai.should();

describe('Library', function () {

	describe('Not Transpiled', function () {
		const DSB = require('../index');

		it("should return a function", function () {
			DSB.should.be.a('function');
		});

		it("should have findMethodInData()", function () {
			DSB.should.have.property('findMethodInData');
			assert.isFunction(DSB.findMethodInData);
		});
	});

	describe('Transpiled', function () {
		const DSB = require('../index.es');

		it("should return a function", function () {
			DSB.should.be.a('function');
		});

		it("should have findMethodInData()", function () {
			DSB.should.have.property('findMethodInData');
			assert.isFunction(DSB.findMethodInData);
		});
	});
});


describe('DSB Instance', function () {

	describe('Not Transpiled', function () {
		const DSB = require('../index');
		const dsb = new DSB(process.env.DSBUSERNAME, process.env.PASSWORD);

		it("should be a instanceof DSB", function () {
			expect(dsb).to.be.an.instanceOf(DSB);
		});

		it("should have the right values", function () {
			expect(dsb).to.have.property('username', process.env.DSBUSERNAME);
			expect(dsb).to.have.property('password', process.env.PASSWORD);
		});

		it("should have fetch()", function () {
			assert.isDefined(dsb.fetch);
			assert.isFunction(dsb.fetch);
		});

		it("should have fetchV1()", function () {
			assert.isDefined(dsb.fetchV1);
			assert.isFunction(dsb.fetchV1);
		});
	});

	describe('Transpiled', function () {
		const DSB = require('../index.es');
		const dsb = new DSB(process.env.DSBUSERNAME, process.env.PASSWORD);

		it("should be a instanceof DSB", function () {
			expect(dsb).to.be.an.instanceOf(DSB);
		});

		it("should have the right values", function () {
			expect(dsb).to.have.property('username', process.env.DSBUSERNAME);
			expect(dsb).to.have.property('password', process.env.PASSWORD);
		});

		it("should have fetch()", function () {
			assert.isDefined(dsb.fetch);
			assert.isFunction(dsb.fetch);
		});

		it("should have fetchV1()", function () {
			assert.isDefined(dsb.fetchV1);
			assert.isFunction(dsb.fetchV1);
		});
	});

});

describe('functions', function () {

	describe('Not Transpiled', function () {
		const DSB = require('../index');
		const dsb = new DSB(process.env.DSBUSERNAME, process.env.PASSWORD);

		it("should not throw", function (done) {
			dsb.fetch().then(() => {
				done();
			}).catch(e => {
				done(e);
			});
		});

		it("should return a object", async function () {
			const data = await dsb.fetch();
			assert.isObject(data);
		});

		it("should have Resultcode and should be 0", async function () {
			const data = await dsb.fetch();
			expect(data).to.have.property('Resultcode', 0);
		});

		it("should have ResultMenuItems and should be an array", async function () {
			const data = await dsb.fetch();
			expect(data).to.have.property('ResultMenuItems');
			assert.isArray(data["ResultMenuItems"]);
		});

		it("should extract data and not throw", async function () {
			const data = await dsb.fetch();
			expect(() => DSB.findMethodInData('timetable', data)).to.not.throw();
			expect(() => DSB.findMethodInData('tiles', data)).to.not.throw();
			expect(() => DSB.findMethodInData('news', data)).to.not.throw();
		});

		it("should be at least one a object", async function () {
			const data = await dsb.fetch();
			const timetables = DSB.findMethodInData('timetable', data);
			const tiles = DSB.findMethodInData('tiles', data);
			const news = DSB.findMethodInData('news', data);
			if (!(typeof timetables === 'object' || typeof tiles === 'object' || typeof news === 'object')) throw new Error("Method timetable, tiles and news are all not an object.");
		});

	});

	describe('Transpiled', function () {
		const DSB = require('../index.es');
		const dsb = new DSB(process.env.DSBUSERNAME, process.env.PASSWORD);

		it("should not throw", function (done) {
			dsb.fetch().then(() => {
				done();
			}).catch(e => {
				done(e);
			});
		});

		it("should return a object", async function () {
			const data = await dsb.fetch();
			assert.isObject(data);
		});

		it("should have Resultcode and should be 0", async function () {
			const data = await dsb.fetch();
			expect(data).to.have.property('Resultcode', 0);
		});

		it("should have ResultMenuItems and should be an array", async function () {
			const data = await dsb.fetch();
			expect(data).to.have.property('ResultMenuItems');
			assert.isArray(data["ResultMenuItems"]);
		});

		it("should extract data", async function () {
			const data = await dsb.fetch();
			expect(() => DSB.findMethodInData('timetable', data)).to.not.throw();
			expect(() => DSB.findMethodInData('tiles', data)).to.not.throw();
			expect(() => DSB.findMethodInData('news', data)).to.not.throw();
		});

		it("should be at least one a object", async function () {
			const data = await dsb.fetch();
			const timetables = DSB.findMethodInData('timetable', data);
			const tiles = DSB.findMethodInData('tiles', data);
			const news = DSB.findMethodInData('news', data);
			if (!(typeof timetables === 'object' || typeof tiles === 'object' || typeof news === 'object')) throw new Error("Method timetable, tiles and news are all not a object.");
		});
	});

});

describe("functions v1", function () {
	describe('Not Transpiled', function () {
		const DSB = require('../index');
		const dsb = new DSB(process.env.DSBUSERNAME, process.env.PASSWORD);

		it("should not throw", function (done) {
			dsb.fetchV1().then(() => {
				done();
			}).catch(e => {
				done(e);
			})
		});

		it("should return an object", async function () {
			const data = await dsb.fetchV1();
			assert.isObject(data);
		});

		it("should be at least one an array", async function () {
			const data = await dsb.fetchV1();
			if (!(Array.isArray(data.timetables) || Array.isArray(data.tiles) || Array.isArray(data.news))) throw new Error("timetables, tiles and news are all not an array.");
		});
	});

	describe('Transpiled', function () {
		const DSB = require('../index.es');
		const dsb = new DSB(process.env.DSBUSERNAME, process.env.PASSWORD);

		it("should not throw", function (done) {
			dsb.fetchV1().then(() => {
				done();
			}).catch(e => {
				done(e);
			})
		});

		it("should return an object", async function () {
			const data = await dsb.fetchV1();
			assert.isObject(data);
		});

		it("should be at least one an array", async function () {
			const data = await dsb.fetchV1();
			if (!(Array.isArray(data.timetables) || Array.isArray(data.tiles) || Array.isArray(data.news))) throw new Error("timetables, tiles and news are all not an array.");
		});
	});
});