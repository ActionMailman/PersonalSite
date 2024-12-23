import { Application, Router } from "jsr:@oak/oak@^17.1.3";
import { marked } from 'https://deno.land/x/marked/mod.ts';
import { extract } from "https://deno.land/std@0.145.0/encoding/front_matter.ts";

interface Post {
    slug: string;
    title: string;
    date: Date;
    content: string;
    description: string;
}

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
console.log(posts);
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

function fillPostContent(post: Post) : string {
    let finalHTMLContent: string = "";
    finalHTMLContent += `<h1>${post.title}</h1>`;
    finalHTMLContent += `${marked.parse(post.content)}`;
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
// error handler I suppose..?

router.get('/posts', (ctx) => {
    console.log("Hello!");
        ctx.response.body = `
                            <!DOCTYPE html>
                            <html>
                            <head>
                            <meta charset="utf-8">
                            <meta content="width=device-width, initial-scale=1" name="viewport" />
                            <link href="https://fonts.googleapis.com/css2?family=Lora&display=swap" rel="stylesheet">
                            <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital@0;1&family=Source+Code+Pro:ital,wght@1,300&display=swap" rel="stylesheet">
                            <link rel="stylesheet" href="./styles/globalStyle.css">    
                            <title>Posts</title>
                            </head>
                            <body>
                            ${outputPreviewAsString()}
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
                            <title>Posts</title>
                            </head>
                            <body>
                            ${fillPostContent(posts[i])}
                            </body>
                            </html> `;
    });
}


app.use(router.routes());
app.use(router.allowedMethods());
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
