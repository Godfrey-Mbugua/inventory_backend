ALTER TYPE "role" ADD VALUE 'manager';--> statement-breakpoint
ALTER TYPE "role" ADD VALUE 'cashier in';--> statement-breakpoint
ALTER TYPE "role" ADD VALUE 'cashier out';--> statement-breakpoint
ALTER TABLE "auth" ALTER COLUMN "role" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "predictions" ADD COLUMN "frequency" integer NOT NULL;