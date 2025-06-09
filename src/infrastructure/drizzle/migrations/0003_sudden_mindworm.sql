ALTER TABLE "tenants" DROP CONSTRAINT "tenants_domain_unique";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_username_unique";--> statement-breakpoint
ALTER TABLE "tenants" DROP COLUMN "domain";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "username";