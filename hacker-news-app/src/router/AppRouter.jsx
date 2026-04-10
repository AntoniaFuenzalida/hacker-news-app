import { BrowserRouter, Routes, Route } from "react-router-dom";
import TopPage from "../pages/TopPage";
import StoryPage from "../pages/StoryPage";
import NotFoundPage from "../pages/NotFoundPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TopPage />} />
        <Route path="/top" element={<TopPage />} />
        <Route path="/story/:id" element={<StoryPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}