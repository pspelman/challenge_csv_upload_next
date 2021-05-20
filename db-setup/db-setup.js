// add some fake data to the DB
const db = require('../src/lib/db')


let queryCmd = (dealerName) => `INSERT INTO dealer(name, config) values ('${dealerName}', '{
"dbMap": {
"allHeaders": ["UUID", "YEAR", "MAKE", "MODEL", "MILEAGE", "YEAR", "PRICE", "ZIP CODE", "UPDATE DATE", "CREATE DATE"],
"UUID": "car.extId",
"YEAR": "car.year",
"MAKE": "car.make",
"MODEL": "car.model",
"MILEAGE": "car.mileage",
"PRICE": "car.price",
"ZIP CODE": "car.zip",
"UPDATE DATE": "car.updated",
"CREATE DATE": "car.created"
}
}');`

const dealers = [
	{
		name: 'South Hills Subaru',
		id: 1
	},
	{
		name: 'North Hills Toyota',
		id: 2
	},
	{
		name: 'BMW of Seattle',
		id: 3
	},
	{
		name: 'Franks AutoFi-nally',
		id: 4
	},
]


async function populateDemoDealers(dealerNames) {
	// TODO: abstract away to DB methods
	console.log(`trying to populate initial dealers`,)
	dealerNames.forEach(({name}) => {
		console.log(`trying to add dealer named: ${name}`,)
		console.log(queryCmd(name))
		db.query(queryCmd(name))
			.then(result => {
				console.log(`addedDB Dealer: `, result)
				// return result
			})
	})
}

async function makeOneDealer() {
	// TODO: abstract away to DB methods
	console.log(`trying to populate initial dealers`,)

	db.query(queryCmd("BMW of Seattle"))
		.then(result => {
			console.log(`addedDB Dealer: `, result)
			// return result
		})
}

(async () => await populateDemoDealers(dealers))()
// (async () => await makeOneDealer())()

