-- Additive, idempotent migration. Existing rows and tables are preserved.
ALTER TABLE day_content ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE day_content ADD COLUMN IF NOT EXISTS refresh_interval_days SMALLINT NOT NULL DEFAULT 30;
ALTER TABLE day_content ADD COLUMN IF NOT EXISTS next_review_at TIMESTAMPTZ;
ALTER TABLE day_content ADD COLUMN IF NOT EXISTS content_status VARCHAR(20) NOT NULL DEFAULT 'published';
ALTER TABLE day_content ADD COLUMN IF NOT EXISTS content_hash VARCHAR(64);
UPDATE day_content
SET next_review_at = COALESCE(next_review_at, created_at + (refresh_interval_days || ' days')::interval),
    updated_at = COALESCE(updated_at, created_at)
WHERE next_review_at IS NULL OR updated_at IS NULL;

CREATE TABLE IF NOT EXISTS internship_content_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_content_id UUID NOT NULL REFERENCES day_content(id) ON DELETE CASCADE,
    revision INTEGER NOT NULL,
    content_hash VARCHAR(64) NOT NULL,
    snapshot JSONB NOT NULL,
    change_note TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_content_version_revision UNIQUE(day_content_id, revision)
);

ALTER TABLE task_submissions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE task_submissions ADD COLUMN IF NOT EXISTS evaluation_status VARCHAR(20) NOT NULL DEFAULT 'queued';
ALTER TABLE task_submissions ADD COLUMN IF NOT EXISTS evaluation_error TEXT;
ALTER TABLE task_submissions ADD COLUMN IF NOT EXISTS reviewer_metadata JSONB;

CREATE TABLE IF NOT EXISTS skill_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
    submission_id UUID NOT NULL REFERENCES task_submissions(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    proficiency_score NUMERIC(5,2) NOT NULL CHECK (proficiency_score BETWEEN 0 AND 100),
    evidence_type VARCHAR(30) NOT NULL DEFAULT 'project',
    evidence_url TEXT,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    verification_method VARCHAR(40),
    metadata_json JSONB,
    demonstrated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_submission_skill_evidence UNIQUE(submission_id, skill_name)
);

CREATE TABLE IF NOT EXISTS daily_standups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    standup_date DATE NOT NULL,
    yesterday TEXT NOT NULL,
    today TEXT NOT NULL,
    blockers TEXT,
    communication_score NUMERIC(5,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_enrollment_standup_date UNIQUE(enrollment_id, standup_date)
);

ALTER TABLE jobs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS external_id VARCHAR(255);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS source VARCHAR(80);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS posted_at TIMESTAMPTZ;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS fetched_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS experience_level VARCHAR(30);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS is_remote BOOLEAN DEFAULT FALSE;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS freshness_score NUMERIC(5,2) DEFAULT 0;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS relevance_score NUMERIC(5,2) DEFAULT 0;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS fingerprint VARCHAR(64);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS raw_payload JSONB;

CREATE UNIQUE INDEX IF NOT EXISTS uq_jobs_fingerprint ON jobs(fingerprint) WHERE fingerprint IS NOT NULL;
CREATE INDEX IF NOT EXISTS ix_jobs_posted_at ON jobs(posted_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS ix_jobs_experience_posted ON jobs(experience_level, posted_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS ix_day_content_catalog ON day_content(domain, task_name, type, day);
CREATE UNIQUE INDEX IF NOT EXISTS uq_internship_task_day ON internship_tasks(track_id, plan_duration, task_number);
CREATE UNIQUE INDEX IF NOT EXISTS uq_submission_attempt ON task_submissions(enrollment_id, task_id, submission_attempt);
CREATE INDEX IF NOT EXISTS ix_skill_evidence_student ON skill_evidence(student_id, verified, demonstrated_at DESC);
