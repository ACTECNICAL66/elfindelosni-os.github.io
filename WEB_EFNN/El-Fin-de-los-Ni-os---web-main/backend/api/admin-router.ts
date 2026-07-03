import { z } from "zod";
import { createRouter, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { users, climateData, cuencas } from "@db/schema";
import { eq, sql } from "drizzle-orm";

export const adminRouter = createRouter({
  getDashboardStats: adminQuery.query(async () => {
    const db = getDb();

    const [usersCount, climateCount, cuencasCount] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(users),
      db.select({ count: sql<number>`count(*)` }).from(climateData),
      db.select({ count: sql<number>`count(*)` }).from(cuencas),
    ]);

    return {
      totalUsers: usersCount[0]?.count ?? 0,
      totalClimateRecords: climateCount[0]?.count ?? 0,
      totalCuencas: cuencasCount[0]?.count ?? 0,
      activeAlerts: 3, // Simulated
    };
  }),

  listUsers: adminQuery
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const [usersList, totalResult] = await Promise.all([
        db
          .select()
          .from(users)
          .limit(input?.limit ?? 50)
          .offset(input?.offset ?? 0),
        db.select({ count: sql<number>`count(*)` }).from(users),
      ]);

      return {
        users: usersList,
        total: totalResult[0]?.count ?? 0,
      };
    }),

  updateUserRole: adminQuery
    .input(
      z.object({
        userId: z.number(),
        role: z.enum(["user", "admin"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(users)
        .set({ role: input.role })
        .where(eq(users.id, input.userId));

      const result = await db
        .select()
        .from(users)
        .where(eq(users.id, input.userId))
        .limit(1);

      return result[0];
    }),
});
