-- uuidv4
CREATE extension IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "ScheduleType" AS ENUM ('WFH', 'WAO', 'OFF');

-- CreateEnum
CREATE TYPE "DayPart" AS ENUM ('FULL', 'AM', 'PM');

-- CreateTable
CREATE TABLE "calendar_date" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP,
    "date" TIMESTAMP NOT NULL,
    "weekday" VARCHAR(256) NOT NULL,
    "day" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,

    CONSTRAINT "pk_calendar_date" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedule" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP,
    "calendar_date_id" UUID NOT NULL,
    "part" "DayPart" NOT NULL,
    "type" "ScheduleType",

    CONSTRAINT "pk_schedule" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ixuq_calendar_date" ON "calendar_date"("date");

-- AddForeignKey
ALTER TABLE "schedule" ADD CONSTRAINT "fk_schedule_calendar_date" FOREIGN KEY ("calendar_date_id") REFERENCES "calendar_date"("id") ON DELETE CASCADE ON UPDATE CASCADE;
