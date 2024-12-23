import { Application, Router } from "jsr:@oak/oak@^17.1.3";


const router = new Router();
const app = new Application();


router.get("/posts", (ctx) => {
    ctx.response.body = "whats up";
}
);

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



app.use(router.routes());
app.use(router.allowedMethods());

console.log("Listening on http://127.0.0.1:8000/")
await app.listen({ port: 8000 });
