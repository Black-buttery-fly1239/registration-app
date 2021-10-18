const assert = require("assert");
const reg = require("../regNo");

const pg = require("pg");
const Pool = pg.Pool;

// eslint-disable-next-line no-undef
const connectionString = process.env.DATABASE_URL || "postgresql://codex:codex123@localhost:5432/my_registration";

const pool = new Pool({
	connectionString,
	ssl: {
		rejectUnauthorized: false
	}
});

// eslint-disable-next-line no-undef
describe("The my_registration database", function () {
	// eslint-disable-next-line no-undef
	beforeEach(async function () {
		await pool.query("delete from reg");
	});

	// eslint-disable-next-line no-undef
	it("should be able to set the registation and get them from the database", async function () {
		const theRegs = reg(pool);

		await theRegs.regsAdd("CA 123456");
		assert.deepEqual([{ regnumber: "CA 123456" }], await theRegs.list());
	});

	// eslint-disable-next-line no-undef
	it("should test the duplicate in the database", async function () {
		const theRegs = reg(pool);

		await theRegs.regsAdd("CY 123-987");
		await theRegs.regsAdd("CY 123-987");
		assert.deepEqual([{ regnumber: "CY 123-987" }], await theRegs.list());
	});

  
	// eslint-disable-next-line no-undef
	it("should be able to show the registration number for Malmesbury (CK)", async function () {
		const theRegs = reg(pool);
    
		await theRegs.regsAdd("CK 123456");
		await theRegs.list("CK 123456");
		assert.deepEqual([{ regnumber: "CK 123456" }], await theRegs.show("CK"));
	});
  
	// eslint-disable-next-line no-undef
	it("should be able to show the registration number for Belville (CY)", async function () {
		const theRegs = reg(pool);
    
		await theRegs.regsAdd("CY 123-123");
		assert.deepEqual([{ regnumber: "CY 123-123" }], await theRegs.show("CY"));
	});
  
	// eslint-disable-next-line no-undef
	it("should be able to show the registration number for Cape Town (CA)", async function () {
		const theRegs = reg(pool);
    
		await theRegs.regsAdd("CA 124-124");
		assert.deepEqual([{ regnumber: "CA 124-124" }], await theRegs.show("CA"));
	});
  
	// eslint-disable-next-line no-undef
	it("should be able to show All the registration number in the database", async function () {
		const theRegs = reg(pool);
    
		await theRegs.regsAdd("CA 124-124");
		assert.deepEqual([{ regnumber: "CA 124-124" }], await theRegs.viewAll());
	});
  
	// eslint-disable-next-line no-undef
	it("should able to Reset the database", async function () {
		const theRegs = reg(pool);
  
		await theRegs.regsAdd("CA 123456");
		await theRegs.list("CA 123456");
		assert.equal(0, await theRegs.theReset());
	});
});
