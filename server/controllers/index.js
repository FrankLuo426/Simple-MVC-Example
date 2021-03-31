/* eslint-disable no-trailing-spaces */
/* eslint-disable spaced-comment */
/* eslint-disable no-tabs */
/* eslint-disable indent */
// pull in our models. This will automatically load the index.js from that folder
const models = require('../models/index.js');

const Cat = models.Cat.CatModel;
const Dog = models.Dog.DogModel;

// default fake data so that we have something to work with until we make a real Cat
const defaultData = {
	name: 'unknown',
	bedsOwned: 0,
};
const defaultDogData = {
	name: 'unknown',
	age: 0,
	breed: 'unknown',
};

let lastAdded = new Cat(defaultData);
let lastAddedDog = new Dog(defaultDogData);
//console.dir(lastAdded);

const hostIndex = (req, res) => {
	res.render('index', {
		currentName: lastAdded.name,
		title: 'Home',
		pageName: 'Home Page',
	});
};

const readAllCats = (req, res, callback) => {
	Cat.find(callback).lean();
};
const readAllDogs = (req, res, callback) => {
	Dog.find(callback).lean();
};

const readCat = (req, res) => {
	const name1 = req.query.name;

	const callback = (err, doc) => {
		if (err) {
			return res.status(500).json({
				err,
			});
		}

		return res.json(doc);
	};

	Cat.findByName(name1, callback);
};

const readDog = (req, res) => {
	const name1 = req.query.name;

	const callback = (err, doc) => {
		if (err) {
			return res.status(500).json({
				err,
			});
		}

		return res.json(doc);
	};

	Dog.findByName(name1, callback);
};

const hostPage1 = (req, res) => {
	const callback = (err, docs) => {
		if (err) {
			return res.status(500).json({
				err,
			});
		}

		return res.render('page1', {
			cats: docs,
		});
	};

	readAllCats(req, res, callback);
};

const hostPage2 = (req, res) => {
	const callback = (err, docs) => {
		if (err) {
			return res.status(500).json({
				err,
			});
		}

		return res.render('page1', {
			dogs: docs,
		});
	};
	readAllDogs(req, res, callback);
};

const hostPage3 = (req, res) => {
	res.render('page3');
};

const hostPage4 = (req, res) => {
	const callback = (err, docs) => {
		if (err) {
			return res.status(500).json({
				err,
			});
		}

		return res.render('page4', {
			dogs: docs,
		});
	};
	readAllDogs(req, res, callback);
};

const getName = (req, res) => {
	res.json({
		name: lastAdded.name,
	});
};

const getDogName = (req, res) => {
	res.json({
		name: lastAddedDog.name,
	});
};

const setName = (req, res) => {
	if (!req.body.firstname || !req.body.lastname || !req.body.beds) {
		return res.status(400).json({
			error: 'firstname,lastname and beds are all required',
		});
	}

	const name = `${req.body.firstname} ${req.body.lastname}`;

	const catData = {
		name,
		bedsOwned: req.body.beds,
	};

	const newCat = new Cat(catData);

	const savePromise = newCat.save();

	savePromise.then(() => {
		lastAdded = newCat;

		res.json({
			name: lastAdded.name,
			beds: lastAdded.bedsOwned,
		});
	});

	savePromise.catch((err) => {
		res.status(500).json({
			err,
		});
	});

	return res;
};

const setDogName = (req, res) => {
	if (!req.body.firstname || !req.body.lastname || !req.body.breed || !req.body.age) {
		return res.status(400).json({
			error: 'firstname,lastname, age and breed are all required',
		});
	}

	const name = `${req.body.firstname} ${req.body.lastname}`;
	const dogData = {
		name,
		breed: req.body.breed,
		age: req.body.age,
	};

	const newDog = new Dog(dogData);
	const savePromis = newDog.save();
	savePromis.then(() => {
		lastAddedDog = newDog;

		res.json({
			name: lastAddedDog.name,
			breed: lastAddedDog.breed,
			age: lastAddedDog.age,
		});
	});

	savePromis.catch((err) => {
		res.status(500).json({
			err,
		});
	});

	return res;
};

const searchName = (req, res) => {
	if (!req.query.name) {
		return res.status(400).json({
			error: 'Name is required to perform a search',
		});
	}

	return Cat.findByName(req.query.name, (err, doc) => {
		if (err) {
			return res.status(500).json({
				err,
			});
		}

		if (!doc) {
			return res.json({
				err: 'No Cats Found',
			});
		}

		return res.json({
			name: doc.name,
			beds: doc.bedsOwned,
		});
	});
};

const searchDogName = (req, res) => {
	if (!req.query.name) {
		return res.status(400).json({
			error: 'Name is required to perform a search',
		});
	}

	return Dog.findByName(req.query.name, req.query.age, (err, doc) => {
		if (err) {
			return res.status(500).json({
				err,
			});
		}

		if (!doc) {
			return res.json({
				error: 'No Dogs Found!',
			});
		}

		if (!req.query.age) {
			return res.json({
				name: doc.name,
				breed: doc.breed,
				age: doc.age,
			});
		}

		return res.json({
			name: doc.name,
			breed: doc.breed,
			age: doc.age + parseInt(req.query.age, 10),
		});
	});
};

const updateLast = (req, res) => {
	lastAdded.bedsOwned++;

	const savePromise = lastAdded.save();
	savePromise.then(() => {
		res.json({
			name: lastAdded.name,
			beds: lastAdded.bedsOwned,
		});
	});
	savePromise.catch((err) => {
		res.status(500).json({
			err,
		});
	});
};

const updateDogLast = (req, res) => {
	lastAddedDog.age++;

	const savePromis = lastAddedDog.save();
	savePromis.then(() => {
		res.json({
			name: lastAddedDog.name,
			breed: lastAddedDog.breed,
			age: lastAddedDog.age,
		});
	});

	savePromis.catch((err) => {
		res.status(500).json({
			err,
		});
	});
};

const notFound = (req, res) => {
	res.status(404).render('notFound', {
		page: req.url,
	});
};

module.exports = {
	index: hostIndex,
	page1: hostPage1,
	page2: hostPage2,
	page3: hostPage3,
	readCat,
	getName,
	setName,
	updateLast,
	searchName,
	notFound,
	readDog,
	setDogName,
	getDogName,
	updateDogLast,
	searchDogName,
	page4: hostPage4,
};
