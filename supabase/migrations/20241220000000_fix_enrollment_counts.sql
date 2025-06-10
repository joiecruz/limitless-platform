-- Create function to update course enrollment count
CREATE OR REPLACE FUNCTION update_course_enrollment_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Handle INSERT case
    IF TG_OP = 'INSERT' THEN
        UPDATE courses
        SET enrollee_count = (
            SELECT COUNT(*)
            FROM enrollments
            WHERE course_id = NEW.course_id
        )
        WHERE id = NEW.course_id;
        RETURN NEW;
    END IF;

    -- Handle DELETE case
    IF TG_OP = 'DELETE' THEN
        UPDATE courses
        SET enrollee_count = (
            SELECT COUNT(*)
            FROM enrollments
            WHERE course_id = OLD.course_id
        )
        WHERE id = OLD.course_id;
        RETURN OLD;
    END IF;

    -- Handle UPDATE case (if course_id changes)
    IF TG_OP = 'UPDATE' THEN
        -- Update count for old course if course_id changed
        IF OLD.course_id != NEW.course_id THEN
            UPDATE courses
            SET enrollee_count = (
                SELECT COUNT(*)
                FROM enrollments
                WHERE course_id = OLD.course_id
            )
            WHERE id = OLD.course_id;
        END IF;

        -- Update count for new course
        UPDATE courses
        SET enrollee_count = (
            SELECT COUNT(*)
            FROM enrollments
            WHERE course_id = NEW.course_id
        )
        WHERE id = NEW.course_id;
        RETURN NEW;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_update_enrollment_count ON enrollments;

-- Create trigger on enrollments table
CREATE TRIGGER trigger_update_enrollment_count
    AFTER INSERT OR UPDATE OR DELETE ON enrollments
    FOR EACH ROW
    EXECUTE FUNCTION update_course_enrollment_count();

-- Initial sync: Update all existing course enrollment counts
UPDATE courses
SET enrollee_count = (
    SELECT COUNT(*)
    FROM enrollments
    WHERE enrollments.course_id = courses.id
);

-- Make sure enrollee_count defaults to 0 for new courses
ALTER TABLE courses
ALTER COLUMN enrollee_count SET DEFAULT 0;

-- Update any NULL enrollee_count values to 0
UPDATE courses
SET enrollee_count = 0
WHERE enrollee_count IS NULL;