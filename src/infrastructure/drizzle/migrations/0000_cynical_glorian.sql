CREATE TABLE "addresses" (
	"id" uuid PRIMARY KEY NOT NULL,
	"zip" char(8) NOT NULL,
	"place" text NOT NULL,
	"number" varchar(8) NOT NULL,
	"complement" varchar(60),
	"district" varchar(255) NOT NULL,
	"city" varchar(255) NOT NULL,
	"state" char(2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "members" (
	"tenant_id" uuid,
	"user_id" uuid,
	"role" varchar NOT NULL,
	CONSTRAINT "members_tenant_id_user_id_pk" PRIMARY KEY("tenant_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "tenants" (
	"id" uuid PRIMARY KEY NOT NULL,
	"image" text,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" char(11) NOT NULL,
	"tax_id" varchar(14) NOT NULL,
	"address_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tenants_email_unique" UNIQUE("email"),
	CONSTRAINT "tenants_phone_unique" UNIQUE("phone"),
	CONSTRAINT "tenants_tax_id_unique" UNIQUE("tax_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"image" text,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" char(11) NOT NULL,
	"password" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"activated" boolean NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_address_id_addresses_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE cascade ON UPDATE cascade;