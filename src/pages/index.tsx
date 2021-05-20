import React from "react"
import {PostProps} from "../components/Post";
import Layout from "../components/Layout";
import carsDB from '../lib/db'
import Link from "next/link";


type Props = {
	feed: PostProps[]
}

function DealerSelect() {
	return <div className="column">
		<div className="ui segment">
			<h3>Dealer Login Coming Soon!</h3>
			<Link href="/upload">
				<a className="ui secondary button">
					Go to the inventory manager
				</a>
			</Link>
		</div>
	</div>
}


const Home: React.FC = (props) => {
	return (
		<Layout>
			<div className="page">
				<h1>Welcome to the Cars Uploader</h1>
				<main>
					<div className="two column stackable ui grid">
						<DealerSelect/>
						<div className="column">
						</div>
					</div>
				</main>
			</div>
		</Layout>
	)
}

export default Home
