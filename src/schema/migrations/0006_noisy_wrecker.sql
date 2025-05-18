ALTER TABLE "events"
DROP CONSTRAINT "events_business_id_businesses_id_fk";

ALTER TABLE "events"
ADD COLUMN "metadata" jsonb;

-- Update the metadata column with the business_id
UPDATE "events"
SET
    metadata = jsonb_set(
        COALESCE(metadata, '{}'::jsonb),
        '{business_id}',
        to_jsonb(business_id)
    )
WHERE
    business_id IS NOT NULL;

ALTER TABLE "events"
DROP COLUMN "business_id";