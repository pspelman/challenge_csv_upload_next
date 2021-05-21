// add some fake data to the DB
const db = require('../src/lib/db')


let queryCmd = (dealerName) => `INSERT INTO dealer(name, config) values ('${dealerName}', '{
"dbMap": {
"allHeaders": ["UUID", "VIN", "YEAR", "MAKE", "MODEL", "MILEAGE", "YEAR", "PRICE", "ZIP CODE", "UPDATE DATE", "CREATE DATE"],
"UUID": "car.extId",
"YEAR": "car.year",
"VIN": "car.vin",
"MAKE": "car.make",
"MODEL": "car.model",
"MILEAGE": "car.mileage",
"PRICE": "car.price",
"ZIP CODE": "car.zip",
"Zip_Code": "car.zip",
"Update_Date": "car.updated",
"UPDATE DATE": "car.updated",
"CREATE DATE": "car.created",
"Create_Date": "car.created"
}
}');`

const dealers = [
	{
		name: 'South Hills Subaru',
		id: 1
	},
	{
		name: 'East Side Toyota',
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

