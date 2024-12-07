import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";
import Lessons from "@/pages/Lessons";
import Lesson from "@/pages/Lesson";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/courses/:courseId/lessons",
    element: <Lessons />,
  },
  {
    path: "/courses/:courseId/lessons/:lessonId",
    element: <Lesson />,
  },
]);

export default router;
