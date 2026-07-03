import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { satelliteIndices } from "@db/schema";
import { eq, and, desc, sql } from "drizzle-orm";

export const satelliteRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        region: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const filters = [];

      if (input?.region) {
        filters.push(eq(satelliteIndices.region, input.region));
      }
      if (input?.startDate) {
        filters.push(sql`${satelliteIndices.date} >= ${input.startDate}`);
      }
      if (input?.endDate) {
        filters.push(sql`${satelliteIndices.date} <= ${input.endDate}`);
      }

      const where = filters.length > 0 ? and(...filters) : undefined;

      const [data, totalResult] = await Promise.all([
        db
          .select()
          .from(satelliteIndices)
          .where(where)
          .orderBy(desc(satelliteIndices.date))
          .limit(input?.limit ?? 50),
        db
          .select({ count: sql<number>`count(*)` })
          .from(satelliteIndices)
          .where(where),
      ]);

      return { data, total: totalResult[0]?.count ?? 0 };
    }),

  getLatest: publicQuery
    .input(z.object({ region: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const filters = [];
      if (input?.region) {
        filters.push(eq(satelliteIndices.region, input.region));
      }
      const where = filters.length > 0 ? and(...filters) : undefined;

      const result = await db
        .select()
        .from(satelliteIndices)
        .where(where)
        .orderBy(desc(satelliteIndices.date))
        .limit(1);

      return result[0] ?? null;
    }),

  getCorrelation: publicQuery
    .input(z.object({ months: z.number().min(1).max(60).default(24) }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const months = input?.months ?? 24;

      const data = await db
        .select()
        .from(satelliteIndices)
        .orderBy(desc(satelliteIndices.date))
        .limit(months);

      return {
        labels: data.map((d) => d.date),
        ndvi: data.map((d) => parseFloat(d.ndvi ?? "0")),
        lst: data.map((d) => parseFloat(d.lst ?? "0")),
        precip: data.map((d) => parseFloat(d.precipitation ?? "0")),
        esi: data.map((d) => parseFloat(d.esi ?? "0")),
      };
    }),

  predictNDVI: publicQuery
    .input(
      z.object({
        precipitation: z.number().min(0).max(200),
        temperature: z.number().min(0).max(50),
        phenomenon: z.enum(["normal", "nino", "nina"]),
      })
    )
    .query(({ input }) => {
      const phenomFactor = { nino: 0.08, nina: -0.08, normal: 0 }[input.phenomenon];
      const predictedNdvi = Math.max(
        0.1,
        Math.min(0.9, 0.55 + phenomFactor + (input.precipitation - 100) / 500 + (25 - input.temperature) / 80)
      );

      let status: string;
      let recommendation: string;
      let color: string;

      if (predictedNdvi > 0.65) {
        status = "Saludable";
        recommendation = "Condiciones optimas. Monitoreo regular.";
        color = "text-green-600";
      } else if (predictedNdvi > 0.4) {
        status = "Estres Leve";
        recommendation = "Riesgo moderado. Considerar riego suplementario.";
        color = "text-yellow-600";
      } else {
        status = "Estres Severo";
        recommendation = "Alto riesgo. Medidas de riego urgentes requeridas.";
        color = "text-red-600";
      }

      return { ndvi: predictedNdvi, status, recommendation, color };
    }),
});
