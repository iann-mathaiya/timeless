CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`image-ids` text DEFAULT '[]',
	`user-id` text NOT NULL,
	FOREIGN KEY (`user-id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
