CREATE TABLE `Lexeme` (
	`id` text PRIMARY KEY NOT NULL,
	`text` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `Translation` (
	`id` text PRIMARY KEY NOT NULL,
	`lexemeId` text NOT NULL,
	`text` text NOT NULL,
	FOREIGN KEY (`lexemeId`) REFERENCES `Lexeme`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Translation_lexemeId_text_unique` ON `Translation` (`lexemeId`,`text`);