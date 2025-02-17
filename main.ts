import { Application, Router } from "jsr:@oak/oak@^17.1.3";
import { marked } from 'https://deno.land/x/marked/mod.ts';
import markedFootnote from 'marked-footnote';
import markedImages from "marked-images";
import { extract } from "https://deno.land/std@0.145.0/encoding/front_matter.ts";

marked.use(markedImages);
// interface for post information to be stored and used
interface Post {
    slug: string;
    title: string;
    date: Date;
    content: string;
    description: string;
}

// function for getting the necessary metadata data of the .md files, meant more as a helper function for getPosts()
async function getPost(slug: string): Promise<Post> {
    const text = await Deno.readTextFile((`./static/blog/posts/${slug}.md`));
    const { body, attrs } = extract(text);
    return {
        slug,
        title: attrs.title,
        date: new Date(attrs.publish_date), 
        content: body,
        description: attrs.description
    };
}

// runs the above function in repitition
async function getPosts() : Promise<Post[]> {
    const files = Deno.readDir("./static/blog/posts");
    const promises = [];
    for await (const file of files) {
        const slug = file.name.replace(".md", "");
        promises.push(getPost(slug));
    }
    const posts = await Promise.all(promises) as Post[];
    posts.sort((a, b) => b.date.getTime() - a.date.getTime());
    return posts;
}


const posts: Post[] = await getPosts();
// for generating the post block HTML
function outputPreviewAsString() : string {
    let finalHTMLContent: string = "";
    for (let i = 0; i < posts.length; i++) {
        finalHTMLContent += `<a href="/${posts[i].slug}"><div class="pageBlock">`;
        finalHTMLContent += `<h1>${posts[i].title}</h1>`;
        finalHTMLContent += `<h4>${posts[i].description}</h4>`;
        finalHTMLContent += `<p>${posts[i].date.toLocaleDateString()}</p>`;
        finalHTMLContent += `</div></a>`;
    }
    return finalHTMLContent;
}

// for populating the actual posts themselves with the necessary content
function fillPostContent(post: Post) : string {
    let finalHTMLContent: string = "";
    finalHTMLContent += `<h1>${post.title}</h1>`;
    finalHTMLContent += `${marked.use(markedFootnote()).parse(post.content)}`;
    return finalHTMLContent;
}

const router = new Router();
const app = new Application();

app.use(async (_ctx, next) => {
    try {
      await next();
    } catch (err) {
          console.log(err)
    }
  });
// error handler I suppose..? Good to keep around but it hasn't gone off yet so I'm not sure 


// variable for the wittgenstein page since instead of being a generated blog post it necessarily leads to a different site, meaning the href on the a needs to be given manually

const wittPage = `<a href="https://wittgenstein.herokuapp.com"><div class="pageBlock">
                    <h1>Why Computer Scientists Should Read Wittgenstein </h1>
                    <h4>My undergraduate capstone on the importance of Ludwig Wittgenstein (in particular his late work) to the history of computer science and artificial intelligence.</h4>
                    <p>5/10/2023</p>
                    </div></a>`;

// collected posts page

router.get('/posts', (ctx) => {
        ctx.response.body = `
                            <!DOCTYPE html>
                            <html>
                            <head>
                            <meta charset="utf-8">
                            <meta content="width=device-width, initial-scale=1" name="viewport" />
                            <link href="https://fonts.googleapis.com/css2?family=Lora&display=swap" rel="stylesheet">
                            <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital@0;1&family=Source+Code+Pro:ital,wght@1,300&display=swap" rel="stylesheet">
                            <link rel="stylesheet" href="./styles/globalStyle.css"> 
                            <link rel="stylesheet" href="./blog/styles/collectedPages.css">    
                            <title>Posts</title>
                            </head>
                            <body>
                                <nav>
                                <li id="title">
                                <a href="/">Viyan</a>
                                </li>
                                </nav>
                            <h1 id="postHeader"> Stuff I've Written </h1>
                            ${outputPreviewAsString()}
                            ${wittPage}
                            </body>
                            </html> `;
});





for (let i = 0; i < posts.length; i++) { 
    router.get(`/${posts[i].slug}`, (ctx) => {
        ctx.response.body = `
                            <!DOCTYPE html>
                            <html>
                            <head>
                            <meta charset="utf-8">
                            <meta content="width=device-width, initial-scale=1" name="viewport" />
                            <link href="https://fonts.googleapis.com/css2?family=Lora&display=swap" rel="stylesheet">
                            <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital@0;1&family=Source+Code+Pro:ital,wght@1,300&display=swap" rel="stylesheet">
                            <link rel="stylesheet" href="./styles/globalStyle.css">
                            <link rel="stylesheet" href="/blog/styles/individualPage.css">    
                            <title>Posts</title>
                            </head>
                            <body>
                            <nav>
                            <li id="title">
                            <a href="/posts">Go Back</a>
                            </li>
                            </nav>                            
                            ${fillPostContent(posts[i])}
                            </body>
                            </html> `;
    });
}




app.use(router.routes());
app.use(router.allowedMethods());
// my extraordinarily clunky way of trying to give access to static HTML 
// files while still using dynamic generation like above. This was the best I could come up with based
//  on how Deno's libraries seem to allow this sort of thing, but I'm sure there's a better way.
app.use(async (ctx) => {
    try {
        await ctx.send({
        root: `${Deno.cwd()}/static`,
        index: "index.html",
        });
    } catch {
        ctx.response.status = 404;
        ctx.response.body = "404 File not found";
    }
});

console.log("Listening on http://127.0.0.1:8000/");
await app.listen({ port: 8000 });
