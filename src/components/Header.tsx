import React from "react";
import Link from "next/link";
import {useRouter} from "next/router";



const Header: React.FC = () => {
	const router = useRouter();
	const isActive: (pathname: string) => boolean = (pathname) =>
		router.pathname === pathname;

	let left = (
		<div className="left ">
			<Link href="/">
				<a className="bold" data-active={isActive("/")}>
					Home
				</a>
			</Link>
			<Link href="/upload">
				<a className="bold" data-active={isActive("/upload")}>
					Vehicle Uploader
				</a>
			</Link>

			<img className="ui small bordered image "
			     src="https://lever-client-logos.s3.us-west-2.amazonaws.com/96736207-8baa-4f29-a0c4-b531f492b679-1617290863359.png"
			     // src="/img/autofi-logo.svg"
			     alt="autofi image"/>

			<style jsx>{`
        .bold {
          font-weight: bold;
        }

        a {
          text-decoration: none;
          color: #000;
          display: inline-block;
        }

        .left a[data-active="true"] {
          color: #00acfb;
        }


        a + a {
          margin-left: 1rem;
        }
			`}</style>
		</div>
	);

	let right = null;

	return (
		<nav>
			{left}
			{right}
			<style jsx>{`
        nav {
          display: flex;
          padding: 2rem;
          align-items: center;
        }
			`}</style>
		</nav>
	);
};

export default Header;
