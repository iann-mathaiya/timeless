import { sqliteTable, text, integer, uniqueIndex, } from "drizzle-orm/sqlite-core";

export const posts = sqliteTable("posts", {
	id: text("id").primaryKey(),
	title: text("title").notNull(),
	description: text("description"),
	userId: text('user_id').notNull().references(() => users.id),
	media: text('media', { mode: 'json' }).default('[]').notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull()
});

export type Post = typeof posts.$inferSelect; //for select queries
export type NewPost = typeof posts.$inferInsert; //for insert queries

export const friends = sqliteTable("friends", {
	id: text("id").primaryKey(),
	respondentId: text("respondent_id").notNull().references(() => users.id),
	requesterId: text("requester_id").notNull().references(() => users.id),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
	status: text("status", { enum: ["pending", "accepted", "rejected"] }).notNull().default("pending"),
});

export type Friend = typeof friends.$inferSelect;

export const users = sqliteTable("users", {
	id: text("id").notNull().primaryKey(),
	name: text("name").notNull(),
	lastName: text("last_name"),
	firstName: text("first_name"),
	providerId: text('provider_id'),
	refreshToken: text("refresh_token"),
	profilePicture: text("profile_picture"),
	email: text("email").unique().notNull(),
	providerUserId: text('provider_user_id'),
	role: text("role").notNull().default('user'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
	emailIsVerified: integer('email_is_verified').notNull().default(0),
})

export type User = typeof users.$inferSelect;

export const sessions = sqliteTable('sessions', {
	id: text('id').primaryKey(),
	expiresAt: integer('expires_at').notNull(),
	userId: text('user_id').references(() => users.id).notNull(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});