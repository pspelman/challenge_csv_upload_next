import { NextApiHandler } from 'next'
// import { query } from '../../lib/db'
const db = require('../db')


const handler = async (_, res) => {
	try {
		// todo: only return cars for current dealer
		const data = db.query('SELECT * FROM cars',(err, res) => {
			if (err) {
				console.log(`error occurred: `,err )
				// return next(err)
			}
			res.send(res.rows[0])
		})

	// 	const results = await query(`
  //     SELECT * FROM entries
  //     ORDER BY id DESC
  //     LIMIT 10
  // `)

		return res.json(results)
	} catch (e) {
		console.log(`error occured - will return status 500 | `, e)
		res.status(500).json({ message: e.message })
	}
}

export default handler
