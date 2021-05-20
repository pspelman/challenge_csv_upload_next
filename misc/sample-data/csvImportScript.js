// this file is only for examining behavior of local csv imports

const fs = require('fs')
const fileName = 'cars1.csv'
const parse = require('csv-parse')
let imported
const parser = parse({columns: false}, function (err, records) {
	console.log(records)
	imported = records
})
fs.createReadStream(`${__dirname}/${fileName}`).pipe(parser)

console.log(`ready....`, )


// use the syncapi
// const fs = require('fs').promises
// const parse = require('csv-parse/lib/sync');

// (async function () {
// 	const fileContent = await fs.readFile(`${__dirname}/${fileName}`);
// 	let records = parse(fileContent, {columns: true});
// 	console.log(records)
// })()

// const readCSV = async (file) => {
// 	const fileContent = await fs.readFile(`${__dirname}/${file}`)
// 	let newRecords = await parse(fileContent, {columns: true})
// 	console.log(newRecords)
// 	return newRecords
// }
//
// let records = readCSV(fileName)
//
