import { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import ProductCard from "../components/ProductCard";
import HeaderComponent from "../components/HeaderComponent";
import FooterComponent from "../components/FooterComponent";
import { useNavigate } from "react-router-dom";
import ModalProduct from "../components/ModalProduct";
import aboutImage from '../assets/estante.jpg';


const Section = styled.section`
  padding: 1rem 1rem;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SearchForm = styled.form`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 600px;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid #93c5fd;
  background: #dbeafe; /* azul claro */
  outline: none;
  font-size: 1rem;
`;

const SearchButton = styled.button`
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: none;
  background: #1371e6ff;
  color: white;
  font-weight: 600;
  cursor: pointer;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  color: #284781ff;
  margin-bottom: 0rem;
  margin-top: 0;
  text-align: center;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ variant }) => (variant === "outline" ? "transparent" : "#1371e6ff")};
  color: ${({ variant }) => (variant === "outline" ? "#1371e6ff" : "white")};
  border: ${({ variant }) => (variant === "outline" ? "2px solid #1371e6ff" : "none")};
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ variant }) => (variant === "outline" ? "#dbeafe" : "#1371e6ff")};
  }
`;

const AboutGrid = styled.div`
  display: grid;
  gap: 3rem;
  grid-template-columns: 1fr;
  align-items: center;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const CarouselWrapper = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  gap: 2rem;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  height: 450px;

  &::-webkit-scrollbar {
    height: 10px;
    background: #e5e7eb;
    border-radius: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #1371e6ff;
    border-radius: 8px;
  }

  /* Firefox */
  scrollbar-width: thin;
  scrollbar-color: #1371e6ff #e5e7eb;

`;

const CarouselCard = styled.div`
  flex: 0 0 280px;
  scroll-snap-align: center;
  transition: transform 0.3s, opacity 0.3s;
  opacity: ${({ isCenter }) => (isCenter ? 1 : 0.5)};
  transform: ${({ isCenter }) => (isCenter ? "scale(1)" : "scale(0.92)")};
  z-index: ${({ isCenter }) => (isCenter ? 2 : 1)};
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const ContainerProdutos = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const AboutImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const AboutImage = styled.img`
  width: 280px;
  height: 280px;
  object-fit: cover;
  border-radius: 50%;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  display: block;

  @media (max-width: 768px) {
    width: 200px;
    height: 200px;
  }
`;

export default function HomePage() {
  const navigate = useNavigate();
  const [centerIndex, setCenterIndex] = useState(0);
  const carouselRef = useRef();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      if (!carouselRef.current) return;
      const children = Array.from(carouselRef.current.children);
      const carouselRect = carouselRef.current.getBoundingClientRect();
      let closest = 0;
      let minDist = Infinity;
      children.forEach((child, idx) => {
        const rect = child.getBoundingClientRect();
        const dist = Math.abs(rect.left + rect.width / 2 - (carouselRect.left + carouselRect.width / 2));
        if (dist < minDist) {
          minDist = dist;
          closest = idx;
        }
      });

      if (carouselRef.current.scrollLeft === 0) {
        setCenterIndex(0);
        return;
      }
      const maxScroll = carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
      if (Math.abs(carouselRef.current.scrollLeft - maxScroll) < 2) {
        setCenterIndex(children.length - 1);
        return;
      }

      setCenterIndex(closest);
    };
    const ref = carouselRef.current;
    ref?.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => ref?.removeEventListener("scroll", handleScroll);
  }, [featuredProducts]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const q = encodeURIComponent("Batman");
        const res = await fetch(`https://openlibrary.org/search.json?q=${q}&mode=everything`);
        const data = await res.json();
        const docs = data.docs || [];

        const destaque = docs.slice(0, 10).map((doc, idx) => {
          const id = doc.key || doc.cover_edition_key || `${doc.title}-${idx}`;
          const title = doc.title + (doc.subtitle ? ": " + doc.subtitle : "") || "Sem título";
          const cover = doc.cover_i
            ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
            : `https://via.placeholder.com/280x280?text=Sem+Capa`;
          const badge = (doc.subject && doc.subject[0]) || (doc.author_name && doc.author_name[0]) || "Livro";
          const description = (doc.subject && doc.subject.slice(0, 10).join(", ")) || `Publicado em ${doc.first_publish_year || "desconhecido"}`;

          return {
            id,
            name: title,
            image: cover,
            badge,
            description,
          };
        });

        setFeaturedProducts(destaque);
      } catch (error) {
        setFeaturedProducts([]);
      }
    }

    fetchProducts();
  }, []);

  function selectProduto(product) {
    setSelectedProduct(product);
  }

  function closeModal() {
    setSelectedProduct(null);
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    const term = (searchTerm || "").trim();
    if (!term) return;
    navigate(`/catalogo?q=${encodeURIComponent(term)}`);
  }

  return (
    <>
      <HeaderComponent />

      <Section id="home">
        <Container>
          <SearchForm onSubmit={handleSearchSubmit}>
            <SearchInput
              placeholder="Pesquisar livros..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Pesquisa"
            />
            <SearchButton type="submit">Pesquisar</SearchButton>
          </SearchForm>
        </Container>
      </Section>

      <Section style={{ background: "#d6e1f7ff" }} id="catalogo">
        <ContainerProdutos>
          <Title>Livros em destaques</Title>
          <CarouselWrapper ref={carouselRef}>
            {featuredProducts.map((p, idx) => (
              <CarouselCard key={p.id} isCenter={idx === centerIndex} onClick={() => selectProduto(p)}>
                <ProductCard product={p} />
              </CarouselCard>
            ))}
          </CarouselWrapper>
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <Button variant="outline" onClick={() => navigate("/catalogo")}>Ver Catálogo Completo</Button>
          </div>
        </ContainerProdutos>
      </Section>

      <Section id="sobre">
  <Container>
    <AboutGrid>
      <div>
        <Title style={{ textAlign: "left" }}>Nossa História</Title>
        <p style={{ color: "#15181dff", marginBottom: "1rem" }}>
            A Alexandria nasceu da minha paixão por livros e quadrinhos — histórias que sempre fizeram parte da minha vida e que me inspiraram a criar um espaço onde leitores possam descobrir, organizar e compartilhar seus acervos.
        </p>
        <p style={{ color: "#15181dff", marginBottom: "1.5rem" }}>
            O nome é uma homenagem à Biblioteca de Alexandria, um dos maiores símbolos do conhecimento humano, que representava a união de culturas, ideias e narrativas.
        </p>
        <p style={{ color: "#15181dff", marginBottom: "1.5rem" }}>
            Assim como aquela biblioteca lendária, o propósito do Alexandria é ser um ponto de encontro para quem ama explorar mundos, sejam eles impressos, ilustrados ou digitais. É um projeto feito por um verdadeiro aficcionado por leitura, criado para outros apaixonados como eu.
        </p>
      </div>
      <AboutImageWrapper>
        <AboutImage
          src={aboutImage}
          alt="Estante"
        />
      </AboutImageWrapper>
    </AboutGrid>
  </Container>
</Section>

      <FooterComponent id="contato"/>
            {selectedProduct && (
              <ModalProduct product={selectedProduct} onClose={closeModal} />
            )}
    </>
  );
}