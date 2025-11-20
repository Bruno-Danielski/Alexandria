import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import CartPage from "./pages/CartPage";
import BookPage from "./pages/BookPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalogo" element={<CatalogPage />} />
        <Route path="/Carrinho" element={<CartPage />} />
        <Route path="/livro" element={<BookPage />} />
      </Routes>
    </Router>
  );
}
