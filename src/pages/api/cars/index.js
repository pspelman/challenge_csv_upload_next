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

const destinationTable = (configStr) => {
	let destTbl = configStr.split(".", 1)[0];
	return destTbl
}

const mapCols = (recObjData, config) => {
	let originalKeys = Object.keys(recObjData)
	let {dbMap} = config
	let newRecord = {"custom": {}}
	// console.log(`keys in the new data: `, originalKeys)
	// console.log(`creating mapping | dbMap: `, dbMap)
	const targetTables = new Set()  // keep track of the tables that are being targeted by this operation

	// TODO: Add the ability to detect items that are part of different tables -- this will be less relevant after getting ORM setup
	originalKeys.map((key) => {
		if (key in dbMap) {
			targetTables.add(destinationTable(dbMap[key]))
			// TODO: consider how to determine to which table an unmapped key should be assigned - probably see if the main table used in the query has a custom or misc column
			newRecord[dbMap[key]] = recObjData[key];
		} else {
			console.log(`${key} has no mapping --> adding to custom`,)
			newRecord["custom"][key] = recObjData[key]
		}
		return recObjData
	}, newRecord)

	return {newRecord, targetTables}
}

async function addCarToDb(dealerId, newData, dealerConfig) {
	console.log(`this would be a DB query to add cars to the DB`,)
	console.log(`dealerid: `, dealerId)
	console.log(`adding newData: `, newData)

	// TODO: match the keys with the dealer's config to use the correct table(s)

	// console.log(`Keys: `, queryKeys.map(key => key.toLowerCase()))
	const {newRecord, targetTables} = mapCols(newData, dealerConfig)
	console.log(`target tables: `, targetTables)

	console.log(`ready to make this new record: `, newRecord)
	// example car 823UD1235J2A34AJ,M3458J8D,testMake,Citroen,100000,2007,109,5000,2020/03/28,2020/03/28
	if (targetTables.size === 1) {
		let table = [...targetTables][0];
		console.log(`only one table is affected --> `, table)
		// let cols = Object.keys(newRecord).map(key => key.split(".",1)[1] + " ")  // need only the column name
		if ('custom' in newRecord) {
			console.log(`REMOVING CUSTOM for now: `, newRecord['custom'])
			delete newRecord['custom']
		}
		let cols = Object.keys(newRecord).map(key => key.replace(`${table}.`, ''));  // need only the column name
		let vals = Object.keys(newRecord).map(key => `${newRecord[key]}`)
		// todo: implement handling custom items (JSONB)
		//(`INSERT INTO some_table(org, kind, name, size) values($1, $2, $3, $4) RETURNING id`, [record.id, record.kind, record.thing, dealerId])
		const newQuery = `INSERT INTO ${table}(${cols.join(",")}, dealer_id) values(${vals.join(",")}, ${dealerId}) RETURNING id;`
		console.log(`created newQuery: `, newQuery)

		return db.query(newQuery)




	} else {
		console.log(`a few tables are affected by this query --> this isn't implemented yet SORRY!`,)

	}
	// the
	//INSERT INTO car (make, model) VALUES
}



async function getDealerConfig(dealerId) {
	// TODO: abstract away to DB methods
	console.log(`trying to get dealer config`,)
	let config
	config = await db.query(`SELECT config
                           FROM dealer
                           where id = $1`, [dealerId])
		.then(result => {
			// console.log(`got config: `, JSON.stringify(result.rows))
			return result.rows ? result.rows[0] : false
		})
	return config
}

const receiveCsv = async (req, res) => {
	let dbQueries = []
	let dealerId = getDealerId(req)
	let dealerConfig
	try {
		dealerConfig = await getDealerConfig(dealerId)
	} catch (err) {
		console.log(`cannot continue`,)
		console.log(`NO CONFIG FOR `, dealerId)
		res.send({'error': `no config on file for dealer ${dealerId}`})
	}
	const {config} = dealerConfig
	let newData = [];
	let busboy = new Busboy({headers: req.headers})
	console.log(`processing upload... for ${dealerId}`,)

	busboy.on('file', (fieldName, file, fileName, encoding, mimetype) => {
		file.pipe(csv.parse({headers: true}))
			.on('data', async function (newRecord) {
				console.log(`adding new request to dbQueries | dealerConfig: `, config)
				// let newQuery = await addCarToDb(dealerId, newRecord, config)
				// console.log(`adding the newquery to dbQueries...`, )
				return dbQueries.push(await addCarToDb(dealerId, newRecord, config))
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
