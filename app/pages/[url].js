import fetch from 'node-fetch';
import parse from 'html-react-parser';

function Post({ post }) {

console.log(post, 'html......')      
    // Render post...
    return(
        <div>
            <h1>{post.service.name} with {post.params.url}</h1>
            {parse(post.service.html || '')}
        </div>
    )
}

// This function gets called at build time
export async function getStaticPaths() {
    // Call an external API endpoint to get posts

    async function fetchData() {
        var query = `
            query {
                allServices {
                    name
                    url
                    id
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

    const { data: {allServices : services} } = await (await fetchData()).json();
    console.log(services, 'services')

    // const posts = await res.json()

    // Get the paths we want to pre-render based on posts
    const paths = services.map(services => `/${services.url}`)
    // We'll pre-render only these paths at build time.
    // { fallback: false } means other routes should 404.
    return { paths, fallback: false }
}

// This also gets called at build time
export async function getStaticProps({ params }) {
    console.log(params, 'oarams......')
    // params contains the post `id`.
    // If the route is like /posts/1, then params.id is 1
    // const res = await fetch(`https://.../posts/${params.id}`)
    // const post = await res.json()

    async function fetchData() {
        var query = `
        query {
            allServices(
              where: {url: "${params.url}"}
            ) {
              id
              name
              html
            }
          }
        `;
        console.log(query, 'query')
        var url = "http://my-app_node-keystone_1:3000/admin/api";
        var opts = {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query })
        };
        return await fetch(url, opts)
    }

    const {data: {allServices:services}}  = await (await fetchData()).json();
console.log(services,'services.........')
const  post = {
      params,
      service: services.shift()
    //   Service: service.Service
  }
    // Pass post data to the page via props
    return { props: { post } }
  }
  

  export default Post
