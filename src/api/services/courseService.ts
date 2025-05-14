
import { supabase } from "@/integrations/supabase/client";
import { apiClient } from "../client";

export const courseService = {
  /**
   * Get all courses
   */
  async getCourses() {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .in('format', ['Online', 'Hybrid']);
    
    if (error) throw error;
    return data;
  },
  
  /**
   * Get admin courses with enrollment counts
   */
  async getAdminCourses() {
    const { data: coursesData, error: coursesError } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });

    if (coursesError) throw coursesError;

    const coursesWithCounts = await Promise.all(
      coursesData.map(async (course) => {
        const { count } = await supabase
          .from("enrollments")
          .select("*", { count: "exact" })
          .eq("course_id", course.id);

        return {
          ...course,
          enrollee_count: count || 0
        };
      })
    );

    return coursesWithCounts;
  },
  
  /**
   * Get a single course
   */
  async getCourse(courseId: string) {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .single();

    if (error) throw error;
    return data;
  },
  
  /**
   * Get course lessons
   */
  async getLessons(courseId: string) {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("course_id", courseId)
      .order("order");

    if (error) throw error;
    return data;
  },
  
  /**
   * Get user enrollment
   */
  async getUserEnrollment(courseId: string) {
    const { data: userSession } = await supabase.auth.getSession();
    if (!userSession?.session?.user?.id) return null;

    const { data, error } = await supabase
      .from("enrollments")
      .select("*")
      .eq("course_id", courseId)
      .eq("user_id", userSession.session.user.id)
      .single();

    if (error && error.code !== "PGRST116") throw error;
    return data;
  },
  
  /**
   * Enroll in a course
   */
  async enrollInCourse(courseId: string) {
    const { data: userSession } = await supabase.auth.getSession();
    if (!userSession?.session?.user?.id) {
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
      .from('enrollments')
      .insert([
        {
          course_id: courseId,
          user_id: userSession.session.user.id,
          progress: 0
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },
  
  /**
   * Toggle course lock status
   */
  async toggleLock(courseId: string, currentLockState: boolean) {
    const { error } = await supabase
      .from("courses")
      .update({ locked: !currentLockState })
      .eq("id", courseId);

    if (error) throw error;
    return { locked: !currentLockState };
  }
};
