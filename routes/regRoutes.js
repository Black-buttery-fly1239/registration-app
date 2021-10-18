/* eslint-disable no-mixed-spaces-and-tabs */
module.exports = function regRoutes(theRegs) {

	var regNumberX = /(^[A-Z]{2}[\s][0-9]{3}[-\s][0-9]{2}$)|(^[A-Z]{2}[\s][0-9]{6}$)|(^[A-Z]{2}[\s][0-9]{3}[-\s][0-9]{3}$)/i;

	async function displayReg(req, res) {
		try {

			res.render("index", {
				amaReg: await theRegs.list(),
			});

		} catch (error) {
			console.log(error);
		}
	}

	async function addReg(req, res) {
		try {
			const regAdd = req.body.theUser;

			if (regAdd) {
				if (await theRegs.checkReg(regAdd) < 1) {

					if (regNumberX.test(regAdd)) {
						await theRegs.regsAdd(regAdd, req);
						req.flash("info", "Registation successfully added!!");
					} else {
						req.flash("error", "Please enter a valid format -CA 123-34/ CK 123456/ CY 456-765!!");
					}

				} else {
					req.flash("error", "Registration already exist!");
				}

			} else {
				req.flash("error", "Please enter a registration number!!");

			}

			res.redirect("/");
		} catch (error) {
			console.log(error);
		}
	}


	async function viewReg(req, res) {
		try {

			res.render("index", {
				amaReg: await theRegs.viewAll(),

			});

		} catch (error) {
			console.log(error);
		}

	}

	async function letReset(req, res) {
		try {
			await theRegs.theReset();
			if (await theRegs.theReset()) {
				req.flash("info", "Database have been succefully reset!!");
			}
			res.redirect("/");

		} catch (error) {
			console.log(error);
		}
	}

	async function showReg(req, res) {
		try {
			const { city } = req.body;
			if (!req.body.city) {
				req.flash("error", "Please select town");
			}
			else {
				var citySelect = await theRegs.show(city, req);
				if (citySelect.length == 0) {
					req.flash("error", "No match registration!!");
				}
			}

			res.render("index", {
				amaReg: citySelect
			});

		} catch (error) {
			console.log(error);
		}
	}

	async function regUrl(req, res) {
		try {
			const regList = req.params.reg;

			res.render("reg_Number", {
				theReg: regList
			});

		} catch (error) {
			console.log(error);
		}

	}

	return {
		addReg,
		regUrl,
		showReg,
		viewReg,
		letReset,
		displayReg,
	};
};