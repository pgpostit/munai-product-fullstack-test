import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "@koa/cors";
import "./socket";

import { router } from "./routes";

const app = new Koa({ proxy: false });
const port = 3000;


app.use(bodyParser());
app.use(cors({ origin: "*" }));

app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
  console.log(`Koa server started on: http://localhost:${port}`);
});

export default app;
