CREATE TABLE IF NOT EXISTS "addresses" (
	"id" char(24) PRIMARY KEY NOT NULL,
	"zip" char(8) NOT NULL,
	"place" text NOT NULL,
	"number" varchar(20) NOT NULL,
	"complement" varchar(60),
	"district" varchar NOT NULL,
	"city" varchar NOT NULL,
	"state" char(2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "entities" (
	"id" char(24) PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"phone" char(11) NOT NULL,
	"tax_id" varchar(14) NOT NULL,
	"address_id" char(24) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "entities_email_unique" UNIQUE("email"),
	CONSTRAINT "entities_phone_unique" UNIQUE("phone"),
	CONSTRAINT "entities_tax_id_unique" UNIQUE("tax_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "members" (
	"entity_id" char(24) NOT NULL,
	"user_id" char(24) NOT NULL,
	"role" varchar NOT NULL,
	CONSTRAINT "members_entity_id_user_id_pk" PRIMARY KEY("entity_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" char(24) PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"phone" char(11) NOT NULL,
	"password" text NOT NULL,
	"actived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entities" ADD CONSTRAINT "entities_address_id_addresses_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "members" ADD CONSTRAINT "members_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "members" ADD CONSTRAINT "members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
