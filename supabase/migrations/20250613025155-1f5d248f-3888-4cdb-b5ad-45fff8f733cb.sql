
-- Allow public read access to enrollments table for counting purposes
CREATE POLICY "Allow public read access to enrollments for counting" 
ON public.enrollments 
FOR SELECT 
USING (true);

-- Allow public read access to lessons table for counting purposes  
CREATE POLICY "Allow public read access to lessons for counting"
ON public.lessons
FOR SELECT 
USING (true);

-- Allow public read access to courses table
CREATE POLICY "Allow public read access to courses"
ON public.courses
FOR SELECT 
USING (true);
