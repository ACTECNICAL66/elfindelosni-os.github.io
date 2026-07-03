import { authRouter } from "./auth-router";
import { climateRouter } from "./climate-router";
import { satelliteRouter } from "./satellite-router";
import { cuencasRouter } from "./cuencas-router";
import { paradigmsRouter } from "./paradigms-router";
import { chatRouter } from "./chat-router";
import { adminRouter } from "./admin-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  climate: climateRouter,
  satellite: satelliteRouter,
  cuencas: cuencasRouter,
  paradigms: paradigmsRouter,
  chat: chatRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
