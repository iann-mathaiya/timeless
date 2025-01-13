import { sqliteTable, text, integer, } from "drizzle-orm/sqlite-core";

export const posts = sqliteTable("posts", {
	id: text("id").primaryKey(),
	title: text("title").notNull(),
	description: text("description"),
	userId: text('user-id').notNull().references(() => users.id),
	media: text('media', { mode: 'json' }).default('[]').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

export type Post = typeof posts.$inferSelect; //for select queries
export type NewPost = typeof posts.$inferInsert; //for insert queries

export const users = sqliteTable("users", {
	image: text('image'),
	id: text("id").primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	role: text("role").notNull().default('user'),
	createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
	emailVerified: integer('emailVerified', { mode: 'boolean' }).notNull(),
});

export type User = typeof users.$inferSelect;


export const friends = sqliteTable("friends", {
	id: text("id").primaryKey(),
	userId: text("user_Id").notNull().references(() => users.id),
	friendId: text("friend_Id").notNull().references(() => users.id),
	createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
	status: text("status", { enum: ["pending", "accepted", "rejected"] }).notNull().default("pending"),
});

export type Friend = typeof friends.$inferSelect;


export const sessions = sqliteTable("sessions", {
	id: text("id").primaryKey(),
	expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
	token: text('token').notNull().unique(),
	createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
	ipAddress: text('ipAddress'),
	userAgent: text('userAgent'),
	userId: text('userId').notNull().references(() => users.id)
});

export const accounts = sqliteTable("accounts", {
	id: text("id").primaryKey(),
	accountId: text('accountId').notNull(),
	providerId: text('providerId').notNull(),
	userId: text('userId').notNull().references(() => users.id),
	accessToken: text('accessToken'),
	refreshToken: text('refreshToken'),
	idToken: text('idToken'),
	accessTokenExpiresAt: integer('accessTokenExpiresAt', { mode: 'timestamp' }),
	refreshTokenExpiresAt: integer('refreshTokenExpiresAt', { mode: 'timestamp' }),
	scope: text('scope'),
	password: text('password'),
	createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull()
});

export const verifications = sqliteTable("verifications", {
	id: text("id").primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: integer('expiresAt', { mode: 'timestamp' }).notNull(),
	createdAt: integer('createdAt', { mode: 'timestamp' }),
	updatedAt: integer('updatedAt', { mode: 'timestamp' })
});
