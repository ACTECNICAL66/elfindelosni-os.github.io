import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  decimal,
  int,
  json,
  boolean,
  date,
} from "drizzle-orm/mysql-core";

// Users table (managed by Kimi OAuth)
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Climate data table
export const climateData = mysqlTable("climate_data", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  region: varchar("region", { length: 100 }).notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  temperature: decimal("temperature", { precision: 5, scale: 2 }),
  humidity: decimal("humidity", { precision: 5, scale: 2 }),
  precipitation: decimal("precipitation", { precision: 6, scale: 2 }),
  windSpeed: decimal("wind_speed", { precision: 5, scale: 2 }),
  windDirection: int("wind_direction"),
  pressure: decimal("pressure", { precision: 7, scale: 2 }),
  phenomenon: mysqlEnum("phenomenon", ["normal", "nino", "nina"]).default("normal"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ClimateData = typeof climateData.$inferSelect;
export type InsertClimateData = typeof climateData.$inferInsert;

// Satellite indices table
export const satelliteIndices = mysqlTable("satellite_indices", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  region: varchar("region", { length: 100 }).notNull(),
  ndvi: decimal("ndvi", { precision: 4, scale: 3 }),
  esi: decimal("esi", { precision: 4, scale: 3 }),
  lst: decimal("lst", { precision: 5, scale: 2 }),
  precipitation: decimal("precipitation", { precision: 6, scale: 2 }),
  stressArea: decimal("stress_area", { precision: 5, scale: 2 }),
  recoveryRate: decimal("recovery_rate", { precision: 5, scale: 2 }),
  dataSource: varchar("data_source", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SatelliteIndices = typeof satelliteIndices.$inferSelect;
export type InsertSatelliteIndices = typeof satelliteIndices.$inferInsert;

// Cuencas (hydrological basins) table
export const cuencas = mysqlTable("cuencas", {
  id: serial("id").primaryKey(),
  number: int("number").notNull().unique(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  coordinates: json("coordinates"),
  centerLat: decimal("center_lat", { precision: 10, scale: 8 }),
  centerLng: decimal("center_lng", { precision: 11, scale: 8 }),
  area: decimal("area", { precision: 10, scale: 2 }),
  potential: mysqlEnum("potential", ["high", "medium", "low"]).default("medium"),
  status: mysqlEnum("status", ["active", "monitoring", "planned"]).default("planned"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Cuenca = typeof cuencas.$inferSelect;
export type InsertCuenca = typeof cuencas.$inferInsert;

// Paradigm projects table
export const paradigmProjects = mysqlTable("paradigm_projects", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  location: varchar("location", { length: 200 }),
  description: text("description"),
  inviabilityReason: text("inviability_reason"),
  costIndex: int("cost_index"),
  impactIndex: int("impact_index"),
  vulnerabilityIndex: int("vulnerability_index"),
  paradigm: mysqlEnum("paradigm", ["centralized", "distributed"]).default("centralized"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ParadigmProject = typeof paradigmProjects.$inferSelect;
export type InsertParadigmProject = typeof paradigmProjects.$inferInsert;

// Chat messages table
export const chatMessages = mysqlTable("chat_messages", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 100 }).notNull(),
  role: mysqlEnum("role", ["user", "model"]).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

// Data sources table
export const dataSources = mysqlTable("data_sources", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  type: varchar("type", { length: 100 }),
  url: varchar("url", { length: 500 }),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DataSource = typeof dataSources.$inferSelect;
export type InsertDataSource = typeof dataSources.$inferInsert;
