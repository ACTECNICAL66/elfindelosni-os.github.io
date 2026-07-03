import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { paradigmProjects } from "@db/schema";
import { eq } from "drizzle-orm";

export const paradigmsRouter = createRouter({
  listProjects: publicQuery
    .input(
      z.object({
        paradigm: z.enum(["centralized", "distributed"]).optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      if (input?.paradigm) {
        return db
          .select()
          .from(paradigmProjects)
          .where(eq(paradigmProjects.paradigm, input.paradigm));
      }
      return db.select().from(paradigmProjects);
    }),

  getComparison: publicQuery.query(async () => {
    const db = getDb();
    const centralized = await db
      .select()
      .from(paradigmProjects)
      .where(eq(paradigmProjects.paradigm, "centralized"));

    return {
      dimensions: ["Costo", "Impacto Ambiental", "Vulnerabilidad", "Resiliencia Climatica", "Sostenibilidad", "Escalabilidad"],
      centralized: [9, 9, 8, 2, 3, 2],
      distributed: [3, 2, 2, 9, 9, 9],
      projects: centralized,
    };
  }),
});
