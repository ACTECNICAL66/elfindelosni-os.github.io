import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { cuencas } from "@db/schema";
import { eq } from "drizzle-orm";

export const cuencasRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(cuencas).orderBy(cuencas.number);
  }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(cuencas)
        .where(eq(cuencas.id, input.id))
        .limit(1);
      return result[0] ?? null;
    }),

  create: adminQuery
    .input(
      z.object({
        number: z.number(),
        name: z.string(),
        description: z.string().optional(),
        coordinates: z.any().optional(),
        centerLat: z.number().optional(),
        centerLng: z.number().optional(),
        area: z.number().optional(),
        potential: z.enum(["high", "medium", "low"]).optional(),
        status: z.enum(["active", "monitoring", "planned"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const data = {
        ...input,
        centerLat: input.centerLat != null ? input.centerLat.toString() : null,
        centerLng: input.centerLng != null ? input.centerLng.toString() : null,
        area: input.area != null ? input.area.toString() : null,
      };
      const result = await db.insert(cuencas).values(data);
      return result;
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        number: z.number().optional(),
        name: z.string().optional(),
        description: z.string().optional(),
        coordinates: z.any().optional(),
        centerLat: z.number().optional(),
        centerLng: z.number().optional(),
        area: z.number().optional(),
        potential: z.enum(["high", "medium", "low"]).optional(),
        status: z.enum(["active", "monitoring", "planned"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...rawData } = input;
      const data: Record<string, unknown> = { ...rawData };
      if (data.centerLat != null) data.centerLat = (data.centerLat as number).toString();
      if (data.centerLng != null) data.centerLng = (data.centerLng as number).toString();
      if (data.area != null) data.area = (data.area as number).toString();
      await db.update(cuencas).set(data as any).where(eq(cuencas.id, id));
      const result = await db
        .select()
        .from(cuencas)
        .where(eq(cuencas.id, id))
        .limit(1);
      return result[0];
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(cuencas).where(eq(cuencas.id, input.id));
      return { success: true };
    }),
});
