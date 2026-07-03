import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { climateData } from "@db/schema";
import { eq, and, sql, desc } from "drizzle-orm";

export const climateRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        region: z.string().optional(),
        phenomenon: z.enum(["normal", "nino", "nina"]).optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const filters = [];

      if (input?.region) {
        filters.push(eq(climateData.region, input.region));
      }
      if (input?.phenomenon) {
        filters.push(eq(climateData.phenomenon, input.phenomenon));
      }
      if (input?.startDate) {
        filters.push(sql`${climateData.date} >= ${input.startDate}`);
      }
      if (input?.endDate) {
        filters.push(sql`${climateData.date} <= ${input.endDate}`);
      }

      const where = filters.length > 0 ? and(...filters) : undefined;

      const [data, totalResult] = await Promise.all([
        db
          .select()
          .from(climateData)
          .where(where)
          .orderBy(desc(climateData.date))
          .limit(input?.limit ?? 50)
          .offset(input?.offset ?? 0),
        db
          .select({ count: sql<number>`count(*)` })
          .from(climateData)
          .where(where),
      ]);

      return {
        data,
        total: totalResult[0]?.count ?? 0,
      };
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(climateData)
        .where(eq(climateData.id, input.id))
        .limit(1);
      return result[0] ?? null;
    }),

  create: adminQuery
    .input(
      z.object({
        date: z.string(),
        region: z.string(),
        temperature: z.number().optional(),
        humidity: z.number().optional(),
        precipitation: z.number().optional(),
        windSpeed: z.number().optional(),
        windDirection: z.number().optional(),
        pressure: z.number().optional(),
        phenomenon: z.enum(["normal", "nino", "nina"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(climateData).values({
        date: new Date(input.date),
        region: input.region,
        temperature: input.temperature != null ? input.temperature.toString() : null,
        humidity: input.humidity != null ? input.humidity.toString() : null,
        precipitation: input.precipitation != null ? input.precipitation.toString() : null,
        windSpeed: input.windSpeed != null ? input.windSpeed.toString() : null,
        windDirection: input.windDirection,
        pressure: input.pressure != null ? input.pressure.toString() : null,
        phenomenon: input.phenomenon,
      });
      return result;
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        date: z.string().optional(),
        region: z.string().optional(),
        temperature: z.number().optional(),
        humidity: z.number().optional(),
        precipitation: z.number().optional(),
        windSpeed: z.number().optional(),
        windDirection: z.number().optional(),
        pressure: z.number().optional(),
        phenomenon: z.enum(["normal", "nino", "nina"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...rawData } = input;
      const data: Record<string, unknown> = { ...rawData };
      if (data.date) data.date = new Date(data.date as string);
      if (data.temperature != null) data.temperature = (data.temperature as number).toString();
      if (data.humidity != null) data.humidity = (data.humidity as number).toString();
      if (data.precipitation != null) data.precipitation = (data.precipitation as number).toString();
      if (data.windSpeed != null) data.windSpeed = (data.windSpeed as number).toString();
      if (data.pressure != null) data.pressure = (data.pressure as number).toString();
      await db.update(climateData).set(data as any).where(eq(climateData.id, id));
      const result = await db
        .select()
        .from(climateData)
        .where(eq(climateData.id, id))
        .limit(1);
      return result[0];
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(climateData).where(eq(climateData.id, input.id));
      return { success: true };
    }),

  getStats: publicQuery
    .input(
      z.object({
        region: z.string().optional(),
        year: z.number().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const filters = [];

      if (input?.region) {
        filters.push(eq(climateData.region, input.region));
      }
      if (input?.year) {
        filters.push(
          sql`YEAR(${climateData.date}) = ${input.year}`
        );
      }

      const where = filters.length > 0 ? and(...filters) : undefined;

      const result = await db
        .select({
          avgTemp: sql<number>`AVG(${climateData.temperature})`,
          avgPrecip: sql<number>`AVG(${climateData.precipitation})`,
          maxTemp: sql<number>`MAX(${climateData.temperature})`,
          minTemp: sql<number>`MIN(${climateData.temperature})`,
          totalRecords: sql<number>`COUNT(*)`,
        })
        .from(climateData)
        .where(where);

      return result[0] ?? {
        avgTemp: 0,
        avgPrecip: 0,
        maxTemp: 0,
        minTemp: 0,
        totalRecords: 0,
      };
    }),
});
