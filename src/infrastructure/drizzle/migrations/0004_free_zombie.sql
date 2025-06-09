ALTER TABLE "addresses" ALTER COLUMN "complement" SET DATA TYPE varchar(80);--> statement-breakpoint
ALTER TABLE "addresses" ALTER COLUMN "district" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "addresses" ALTER COLUMN "city" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password" SET DATA TYPE varchar;