import koa from "koa";
import router from "./routes/product-get.js";
import errorHandler from "./controller/error.js";

const app = new koa();
app.use(errorHandler);
app.use(router.routes()).use(router.allowedMethods()).listen(3000,()=>console.log("Listening on port 3000"));

