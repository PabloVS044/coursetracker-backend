CREATE TABLE IF NOT EXISTS courses (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(120) NOT NULL,
    instructor VARCHAR(100) NOT NULL,
    platform VARCHAR(60) NOT NULL,
    category VARCHAR(60),
    level VARCHAR(20) NOT NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    duration_hours INTEGER,
    lessons INTEGER NOT NULL,
    language VARCHAR(40) NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT courses_title_length CHECK (char_length(trim(title)) >= 3),
    CONSTRAINT courses_instructor_length CHECK (char_length(trim(instructor)) >= 3),
    CONSTRAINT courses_platform_length CHECK (char_length(trim(platform)) >= 2),
    CONSTRAINT courses_language_length CHECK (char_length(trim(language)) >= 2),
    CONSTRAINT courses_level_valid CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    CONSTRAINT courses_price_non_negative CHECK (price >= 0),
    CONSTRAINT courses_duration_positive CHECK (
        duration_hours IS NULL OR duration_hours > 0
    ),
    CONSTRAINT courses_lessons_positive CHECK (lessons > 0)
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS courses_set_updated_at ON courses;

CREATE TRIGGER courses_set_updated_at
BEFORE UPDATE ON courses
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE INDEX IF NOT EXISTS idx_courses_title ON courses (title);
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses (category);
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses (level);
CREATE INDEX IF NOT EXISTS idx_courses_created_at ON courses (created_at DESC);
