const Busboy = require('busboy')

const db = require('../../../lib/db')
const csv = require('fast-csv');

const getDealerId = (req) => {
	let dealerId = req.headers['dealer-id']
	console.log(`PROCESSING REQUEST FOR DEALER `, dealerId)
	return dealerId
}

const requestHandler = async (req, res) => {
	if (req.method === 'POST') {
		// Process a POST request
		console.log(`[cars/index.js] - processing a POST request`,)
		let updates = receiveCsv(req, res)
		console.log(`updates: `, updates)
	} else {
		// Handle any other HTTP method
		console.log(`got some other request`,)
		res.json("NOT IMPLEMENTED")
	}
}

const mapCols = (newData, config) => {
	let originalKeys = Object.keys(newData)
	let newDict = {custom: {}}
	originalKeys.map((key) => {
		console.log(`mapping ${config[key]}`,)
		if (key in config) {
			console.log(`adding ${key} as ${config[key]} - value: ${newData[key]}`,)
			newDict[config[key]] = newData[key];
		} else {
			console.log(`${key} has no mapping --> adding to custom`,)
			newData.custom[key] = newData[key]
		}
		return newData
	}, newDict)

	console.log(`final column mapping: `, newDict)
	return newDict
}

async function addCarToDb(dealerId, newData, dealerConfig) {
	console.log(`this would be a DB query to add cars to the DB`,)
	console.log(`dealerid: `, dealerId)
	console.log(`adding newData: `, newData)
	// TODO: match the keys with the dealer's config to use the correct table(s)

	// let queryKeys = Object.keys(newData)
	// console.log(`Keys: `, queryKeys.map(key => key.toLowerCase()))
	mapCols(newData, dealerConfig)

	// the
	//INSERT INTO car (make, model) VALUES
	return setTimeout(() => {
		// db.query(`INSERT INTO car `)
		console.log(`this is the query coming back!`,)
		console.log(`trying to parse `,)
	}, 2000)
}

async function getDealerConfig(dealerId) {
	// TODO: abstract away to DB methods
	console.log(`trying to get dealer config`,)
	let config
	config = await db.query(`SELECT config
                           FROM dealer
                           where id = $1`, [dealerId])
		.then(result => {
			console.log(`got config: `, result)
			return result
		})
	return config
}

const receiveCsv = (req, res) => {
	let dbQueries = []
	let dealerId = getDealerId(req)
	let dealerConfig = getDealerConfig(dealerId)
	let newData = []
	let busboy = new Busboy({headers: req.headers})
	console.log(`processing upload... for ${dealerId}`,)
	busboy.on('file', (fieldName, file, fileName, encoding, mimetype) => {
		file.pipe(csv.parse({headers: true}))
			.on('data', async function (newRecord) {
				console.log(`adding new request to dbQueries`,)
				let newQuery = await addCarToDb(dealerId, newRecord, dealerConfig)
				return dbQueries.push(newQuery)
			});

		file.on('end', () => {
			console.log(`end of file reached --> waiting for db queries to finish up`,)
		})
	})
	busboy.on('finish', async () => {
		console.log('Done parsing form... waiting for queries');
		Promise.all(dbQueries).then(files => {
			console.log(`all dbqueries done: `, files)
			res.json({'message': 'DONE'})
			return "DONE"
		}).then(() => {
			console.log(`finishing up all the DB queries`,)
			res.json("DONE")
		})
	})
	console.log(`calling req.pip(busboy)`,)
	req.pipe(busboy);
	console.log(`calling busboy.end(req.body)`,)
	res.end();
	busboy.end(req.body)
	return "DONE DONE DONE"
}

export default requestHandler
