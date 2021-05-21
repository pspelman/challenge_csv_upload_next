// add some fake data to the DB
const db = require('../src/lib/db')


let queryCmd = (dealerName) => `INSERT INTO dealer(name, config) values ('${dealerName}', '{
"dbMap": {
"allHeaders": ["UUID", "VIN", "YEAR", "MAKE", "MODEL", "MILEAGE", "YEAR", "PRICE", "ZIP CODE", "UPDATE DATE", "CREATE DATE"],
"UUID": ["car.extId", "str"],
"YEAR": ["car.year", "num"],
"VIN": ["car.vin", "str"],
"MAKE": ["car.make", "str"],
"MODEL": ["car.model", "str"],
"MILEAGE": ["car.mileage", "num"],
"PRICE": ["car.price", "num"],
"ZIP CODE": ["car.zip", "str"],
"Zip_Code": ["car.zip", "str"],
"Update_Date": ["car.updated", "date"],
"UPDATE DATE": ["car.updated", "date"],
"CREATE DATE": ["car.created", "date"],
"Create_Date": ["car.created", "date"]
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

