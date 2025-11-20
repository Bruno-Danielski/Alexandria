import { useState, useEffect } from "react";
import styled from "styled-components";
import HeaderComponent from "../components/HeaderComponent";
import FooterComponent from "../components/FooterComponent";
import ProductCard from "../components/ProductCard";
import ModalProduct from "../components/ModalProduct";
import { useLocation, useNavigate } from "react-router-dom";
import aboutImage from '../assets/images.png';


const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
`;

const LoadingText = styled.p`
  text-align: center;
  font-size: 1.25rem;
  margin-top: 2rem;
`;

const PageWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`;

const SearchForm = styled.form`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin: 1rem 0;
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 600px;
  padding: 0.65rem 0.9rem;
  border-radius: 0.5rem;
  border: 1px solid #93c5fd;
  background: #dbeafe; /* azul claro */
  outline: none;
  font-size: 1rem;
`;

const SearchButton = styled.button`
  padding: 0.65rem 1rem;
  border-radius: 0.5rem;
  border: none;
  background: #1371e6ff;
  color: white;
  font-weight: 600;
  cursor: pointer;
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin: 2rem 0 3rem;
  flex-wrap: wrap;
`;

const PageButton = styled.button`
  padding: 0.45rem 0.75rem;
  border-radius: 0.5rem;
  border: none;
  background: ${({ active }) => (active ? "#2563eb" : "#e6f0ff")};
  color: ${({ active }) => (active ? "white" : "#0f172a")};
  cursor: pointer;
  min-width: 36px;
`;

const PageInfo = styled.span`
  color: #4b5563;
  margin-left: 0.5rem;
`;

// sort select styles
const SortSelect = styled.select`
  margin: 1rem 0;
  padding: 0.5rem;
  font-size: 1rem;
  display: block;
  margin-left: auto;
  margin-bottom: 0;
  margin-right: 2rem;
  border-radius: 8px;
  background-color: #dbeafe;
  color: Black;
`;

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState("Todos");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortMode, setSortMode] = useState('relevance');

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const badgeParam = params.get("badge");
  const queryParam = params.get("q");

  useEffect(() => {
    if (badgeParam) setSelectedBadge(badgeParam);
  }, [badgeParam]);

  const [searchTerm, setSearchTerm] = useState(queryParam || "");
  useEffect(() => {
    setSearchTerm(queryParam || "");
  }, [queryParam]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const term = (searchTerm || "").trim();
    if (!term) return;
    navigate(`/catalogo?q=${encodeURIComponent(term)}`);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    setCurrentPage(1);
  }, [queryParam, selectedBadge]);

  useEffect(() => {
    let mounted = true;

    const fetchPage = async (searchTermParam, page) => {
      try {
        setLoading(true);
        const isTitleSearch = searchTermParam && searchTermParam.trim() !== "";
        const defaultQ = "Programação";
        const url = isTitleSearch
          ? `https://openlibrary.org/search.json?title=${encodeURIComponent(searchTermParam.trim())}&limit=${itemsPerPage}&page=${page}`
          : `https://openlibrary.org/search.json?q=${encodeURIComponent(defaultQ)}&limit=${itemsPerPage}&page=${page}`;
        const res = await fetch(url);
        if (!res.ok) {
          if (mounted) {
            setProducts([]);
            setTotalResults(0);
          }
          return;
        }

        const json = await res.json();
        const docs = json.docs || [];
        const numFound = typeof json.numFound === "number" ? json.numFound : (docs.length || 0);

        const mapped = docs.map((doc, idx) => {
          const id = (doc.key || doc.cover_edition_key || `${doc.title}-${idx}`).toString().replace(/\//g, "_");
          const title = doc.title + (doc.subtitle ? ": " + doc.subtitle : "") || "Sem título";
          const cover = doc.cover_i
            ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
            : aboutImage;
          const badge = (doc.subject && doc.subject[0]) || (doc.author_name && doc.author_name[0]) || "Desconhecido";
          const description =
            (doc.first_sentence && (Array.isArray(doc.first_sentence) ? doc.first_sentence.join(" ") : doc.first_sentence)) ||
            (doc.subject && doc.subject.slice(0, 5).join(", ")) ||
            `Publicado em ${doc.first_publish_year || "desconhecido"}`;

          return {
            id,
            name: title,
            image: cover,
            badge,
            description,
            source: "openlibrary",
            raw: doc,
          };
        });

        if (mounted) {
          setProducts(mapped);
          setTotalResults(numFound);
        }
      } catch (err) {
        console.error("Erro ao buscar OpenLibrary:", err);
        if (mounted) {
          setProducts([]);
          setTotalResults(0);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPage(queryParam || "", currentPage);

    return () => {
      mounted = false;
    };
  }, [queryParam, currentPage]);

  const filteredProducts = products;

  // apply sorting
  const sortedProducts = (() => {
    const arr = [...filteredProducts];
    if (sortMode === 'rating_desc') {
      return arr.sort((a, b) => {
        const ra = a.raw && (a.raw.ratings_average || a.raw.average_rating || a.raw.rating) ? Number(a.raw.ratings_average || a.raw.average_rating || a.raw.rating) : 0;
        const rb = b.raw && (b.raw.ratings_average || b.raw.average_rating || b.raw.rating) ? Number(b.raw.ratings_average || b.raw.average_rating || b.raw.rating) : 0;
        return rb - ra;
      });
    }
    if (sortMode === 'year_desc') {
      return arr.sort((a, b) => (b.raw?.first_publish_year || 0) - (a.raw?.first_publish_year || 0));
    }
    if (sortMode === 'year_asc') {
      return arr.sort((a, b) => (a.raw?.first_publish_year || 0) - (b.raw?.first_publish_year || 0));
    }
    return arr; // relevance (as returned)
  })();

  const totalPages = Math.max(1, Math.ceil(totalResults / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  function closeModal() {
    setSelectedProduct(null);
  }

  const goToPage = (page) => {
    const p = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(p);
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  // helper: return array of page items (numbers or '...') to display
  const getPageItems = (total, current, maxButtons = 7) => {
    if (total <= maxButtons) return Array.from({ length: total }, (_, i) => i + 1);
    const half = Math.floor(maxButtons / 2);
    let start = Math.max(1, current - half);
    let end = Math.min(total, current + half);

    if (start === 1) {
      end = Math.min(total, maxButtons);
    }
    if (end === total) {
      start = Math.max(1, total - maxButtons + 1);
    }

    const items = [];
    if (start > 1) {
      items.push(1);
      if (start > 2) items.push("...");
    }

    for (let i = start; i <= end; i++) items.push(i);

    if (end < total) {
      if (end < total - 1) items.push("...");
      items.push(total);
    }

    return items;
  };

  const pageItems = getPageItems(totalPages, currentPage, 7);

  return (
    <>
      <HeaderComponent />
      <PageWrapper>
        <SearchForm onSubmit={handleSearchSubmit}>
          <SearchInput
            placeholder="Pesquisar livros..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Pesquisa"
          />
          <SearchButton type="submit">Pesquisar</SearchButton>
        </SearchForm>

        <SortSelect value={sortMode} onChange={(e) => setSortMode(e.target.value)} aria-label="Ordenar por">
          <option value="relevance">Relevância</option>
          <option value="rating_desc">Avaliação (maior primeiro)</option>
          <option value="year_desc">Mais recentes</option>
          <option value="year_asc">Mais antigos</option>
        </SortSelect>
         {loading ? (
           <LoadingText>Carregando produtos...</LoadingText>
         ) : (
           <>
             <Container>
              {sortedProducts.map((product) => (
                <ProductCard key={`${product.source}-${product.id}`} product={product} onClick={() => navigate(`/livro?q=${encodeURIComponent(product.raw?.key || product.id)}`)} />
              ))}
             </Container>

            <PaginationWrapper>
              <PageButton onClick={() => goToPage(1)} disabled={currentPage === 1}>
                « Primeiro
              </PageButton>

              <PageButton onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                Anterior
              </PageButton>

              {pageItems.map((item, idx) =>
                item === "..." ? (
                  <PageButton key={`e-${idx}`} disabled>
                    ...
                  </PageButton>
                ) : (
                  <PageButton key={item} active={item === currentPage} onClick={() => goToPage(item)}>
                    {item}
                  </PageButton>
                )
              )}

              <PageButton onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                Próximo
              </PageButton>

              <PageButton onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}>
                Último »
              </PageButton>

              <PageInfo>
                Página {currentPage} de {totalPages}
              </PageInfo>
            </PaginationWrapper>
          </>
        )}
      </PageWrapper>
      <FooterComponent />
      {selectedProduct && <ModalProduct product={selectedProduct} onClose={closeModal} />}
    </>
  );
}