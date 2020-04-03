import fetch from 'node-fetch'
import Link from 'next/link'

// posts will be populated at build time by getStaticProps()
function Blog({ categories }) {
	return <div style={{"display": "flex","justify-content": "space-evenly"}}>
		{categories.map((category, cId) => {
			return (
				<div key={cId}>
					<span>{category.name}</span>
					<ul>
						{category.service.map((service, sId) => (
							<li key={sId}><Link href={service.url}>{service.name}</Link></li>
						))}
					</ul>
				</div>
			)
		})}
	</div>
}

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries. See the "Technical details" section.
export async function getStaticProps() {
	// Call an external API endpoint to get posts.

	async function fetchData() {
		var query = `
			query {
			allCategories {
				name
				service {
					name
					url
				}
			}
			}
		`;
		var url = "http://my-app_node-keystone_1:3000/admin/api";
		var opts = {
			method: "post",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ query })
		};
		return await fetch(url, opts)
	}

	const {data:categories} = await (await fetchData()).json();

	console.log(categories, 'todos')
	// By returning { props: todos }, the Blog component
	// will receive `todos` as a prop at build time
	return {
		props: {
			categories: categories.allCategories,
		},
	}
}

export default Blog