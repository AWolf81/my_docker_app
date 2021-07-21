CREATE TABLE "public"."todo" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "title" text NOT NULL, "completed" boolean NOT NULL DEFAULT false, "created_at" timestamptz NOT NULL DEFAULT now()::timestamp, PRIMARY KEY ("id") , UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;
