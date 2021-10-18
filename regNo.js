module.exports = function regno(pool) {



	async function regsAdd(maReg) {
		let newReg = maReg.toUpperCase();
		if (maReg) {
			var checkReg = await pool.query("select regNumber from reg where regNumber = $1", [newReg]);
			var road = maReg.substring(0, 2);

			if (checkReg.rowCount < 1) {
				var town_id = await regSelectId(road);
				await pool.query("insert into reg(regNumber, theRegCode) values($1, $2)", [newReg, town_id]);
			}

		}
	}

	async function checkReg(reg){
		var regCheck = await pool.query("select regNumber from reg where  regNumber = $1", [reg]);
		return regCheck.rowCount;
	}

	async function list() {
		var theReg = await pool.query("select regNumber from reg");
		console.log(theReg.rows);
		return theReg.rows;

	}

	async function show(city) {

		if (city) {
			var codes = await regSelectId(city);
			var theShow = await pool.query("select regNumber from reg where theRegCode = $1", [codes]);
			return theShow.rows;
		}
		return [];
	}

	async function viewAll() {
		var showAll = await pool.query("select regNumber from reg");
		return showAll.rows;
	}

	async function regSelectId(regId) {
		if (regId) {
			var reg = regId.toUpperCase();
			var cReg = await pool.query("select id from town where codes = $1", [reg]);
			return cReg.rows[0].id;
		}
	}

	async function theReset() {
		const letReset = await pool.query("delete from reg");
		return letReset.rows;
	}

	return {
		theReset,
		regsAdd,
		regSelectId,
		list,
		viewAll,
		show,
		checkReg
	};


};