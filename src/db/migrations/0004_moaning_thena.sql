PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_friends` (
	`id` text PRIMARY KEY NOT NULL,
	`respondentId` text NOT NULL,
	`requesterId` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	FOREIGN KEY (`respondentId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`requesterId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_friends`("id", "respondentId", "requesterId", "createdAt", "updatedAt", "status") SELECT "id", "respondentId", "requesterId", "createdAt", "updatedAt", "status" FROM `friends`;--> statement-breakpoint
DROP TABLE `friends`;--> statement-breakpoint
ALTER TABLE `__new_friends` RENAME TO `friends`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`userId` text NOT NULL,
	`media` text DEFAULT '[]' NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_posts`("id", "title", "description", "userId", "media", "createdAt", "updatedAt") SELECT "id", "title", "description", "userId", "media", "createdAt", "updatedAt" FROM `posts`;--> statement-breakpoint
DROP TABLE `posts`;--> statement-breakpoint
ALTER TABLE `__new_posts` RENAME TO `posts`;