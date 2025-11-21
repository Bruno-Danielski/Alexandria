import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import LoginPage from "./pages/LoginPage";
import BookPage from "./pages/BookPage";
import UserPage from "./pages/UserPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalogo" element={<CatalogPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/livro" element={<BookPage />} />
        <Route path="/usuario" element={<UserPage />} />
      </Routes>
    </Router>
  );
}
