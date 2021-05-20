const {Pool} = require('pg')

const pool = new Pool()  // this uses env vars

// const pool = new Pool({
// 	user: 'postgres',
// 	host: 'localhost',
// 	database: 'postgres',
// 	password: 'postgres',
// 	port: 5432,
// })
// Note: optionally use single queries instead of pool
// module.exports = {
// 	query: (text, params, callback) => {
// 		const start = Date.now()
// 		return pool.query(text, params, (err, res) => {
// 			const duration = Date.now() - start
// 			console.log('executed query', { text, duration, rows: res.rowCount })
// 			callback(err, res)
// 		})
// 	},
// }

module.exports = {
	async query(text, params) {
		const start = Date.now()
		const res = await pool.query(text, params)
		const duration = Date.now() - start
		console.log('executed query', {text, duration, rows: res.rowCount})
		return res
	},
	async getClient() {
		const client = await pool.connect()
		const query = client.query
		const release = client.release
		// set a timeout of 5 seconds, after which we will log this client's last query
		const timeout = setTimeout(() => {
			console.error('client checked out for more than 5 seconds...')
			console.error(`The last executed query on this client was: ${client.lastQuery}`)
		}, 5000)
		client.query = (...args) => {  // keep track of the last query executed
			client.lastQuery = args
			return query.apply(client, args)
		}
		client.release = () => {
			clearTimeout(timeout)  // restore the methods to how they were
			client.query = query
			client.release = release
			return release.apply(client)
		}
		return client
	}
}
