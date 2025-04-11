import { Route, Routes } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import CollectIdeas from "@/pages/CollectIdeas";
import ArticlesPage from "@/pages/ArticlesPage";
import ArticleDetailPage from "@/pages/ArticleDetailPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:projectId/ideas" element={<CollectIdeas />} />
      <Route path="/articles" element={<ArticlesPage />} />
      <Route path="/articles/:articleId" element={<ArticleDetailPage />} />
    </Routes>
  );
}
