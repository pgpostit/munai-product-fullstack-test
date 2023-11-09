import Router from "@koa/router";
import { PrismaClient } from "@prisma/client";

const router = new Router();
const prisma = new PrismaClient();

router.post("/user", async ({ request, response }) => {
  const { username } = request.body as { username: string };

  const user = await prisma.user.findFirst({
    where: {
      username,
    },
  });

  if (user?.id) {
    response.body = user;
    response.status = 200;

    return;
  }

  const createdUser = await prisma.user.create({
    data: {
      username,
    },
  });

  response.body = createdUser;
  response.status = 200;
});

router.get("/messages", async ({ response }) => {
  const messages = await prisma.message.findMany({ include: { author: true } });

  response.body = messages;
  response.status = 200;
});


export { router };
