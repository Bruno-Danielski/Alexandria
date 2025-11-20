import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import HeaderComponent from "../components/HeaderComponent";
import FooterComponent from "../components/FooterComponent";
import ProductCard from "../components/ProductCard";
import { useLocation, useNavigate } from "react-router-dom";
import aboutImage from '../assets/images.png';

const Page = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Carousel = styled.div`
  overflow-x: auto;
  display: flex;
  gap: 1rem;
  padding-bottom: 1rem;

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

const Cover = styled.img`
  width: 100%;
  max-width: 360px;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
`;

const Title = styled.h1`
  margin: 0 0 0.5rem 0;
`;

const Description = styled.p`
  color: #0f172a;
  font-weight: 500;
  -webkit-font-smoothing: antialiased;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 16px rgba(0,0,0,0.1);
  margin-bottom: 1.5rem;
`;

const CardBody = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;

  @media (max-width: 800px) {
    flex-direction: column;
  }
`;

const RelatedTitle = styled.h3`
  margin-top: 2rem;
`;

export default function BookPage() {
  // helper: safely stringify fields that may be string, object {value}, or array
  const stringifyField = (v) => {
    if (!v && v !== 0) return "";
    if (typeof v === "string") return v;
    if (typeof v === "number") return String(v);
    if (Array.isArray(v)) return v.map(stringifyField).join(" ");
    if (typeof v === "object") {
      // common OpenLibrary shapes: { value: '...' } or { type: 'text', value: '...' }
      if (v.value) return stringifyField(v.value);
      // sometimes it's an object with 'type' and 'value' or other nested fields
      const possible = Object.values(v).map(stringifyField).filter(Boolean);
      return possible.join(" ");
    }
    return String(v);
  };

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const key = params.get("q"); // expects openlibrary key like /works/OLxxxxxW or edition key

  const [book, setBook] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef();

  useEffect(() => {
    if (!key) return;

    async function fetchBook() {
      setLoading(true);
      try {
        let data = null;

        if (key.startsWith("/works/")) {
          const url = `https://openlibrary.org${key}.json`;
          const res = await fetch(url);
          data = await res.json();
          data._type = 'work';
        } else {
          try {
            const urlWork = `https://openlibrary.org/works/${key}.json`;
            const resWork = await fetch(urlWork);
            if (resWork.ok) {
              data = await resWork.json();
              data._type = 'work';
            }
          } catch (err) {
          }

          if (!data) {
            try {
              const urlEdition = key.startsWith("/books/") ? `https://openlibrary.org${key}.json` : `https://openlibrary.org/books/${key}.json`;
              const resEd = await fetch(urlEdition);
              if (resEd.ok) {
                data = await resEd.json();
                data._type = 'edition';
              }
            } catch (err) {
            }
          }
        }

        if (!data) {
          setBook(null);
          return;
        }

        const title = data.title || data?.works?.[0]?.title || "Sem título";
        const descriptionRaw = data.description || data.first_sentence || '';
        const description = stringifyField(descriptionRaw);
        const subjects = data.subjects || data.subject || [];
        const coverId = data.covers ? data.covers[0] : (data.cover_id || null);
        const cover = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : `https://via.placeholder.com/360x480?text=Sem+Capa`;
        const authors_name = [];

        setBook({ title, description, subjects, cover, authors_name, raw: data });

        let relatedDocs = [];
        if (subjects && subjects.length > 0) {
          const q = encodeURIComponent(subjects[0]);
          const resRel = await fetch(`https://openlibrary.org/search.json?q=${q}&limit=12`);
          const relJson = await resRel.json();
          relatedDocs = relJson.docs || [];
        }

        const relMapped = relatedDocs.map((doc, idx) => ({
          id: doc.key || doc.cover_edition_key || `${doc.title}-${idx}`,
          name: doc.title,
          image: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` : aboutImage,
          badge: (doc.subject && doc.subject[0]) || (doc.author_name && doc.author_name[0]) || 'Livro',
          description: (doc.subject && doc.subject.slice(0,5).join(', ')) || `Publicado em ${doc.first_publish_year || 'desconhecido'}`,
          raw: doc,
        }));

        setRelated(relMapped.filter(r => r.id !== key).slice(0, 10));
      } catch (err) {
        console.error('Erro ao buscar livro:', err);
        setBook(null);
        setRelated([]);
      } finally {
        setLoading(false);
      }
    }

    fetchBook();
  }, [key]);

  return (
    <>
      <HeaderComponent />
      <Page>
        {loading ? (
          <p>Carregando...</p>
        ) : !book ? (
          <p>Livro não encontrado.</p>
        ) : (
          <>
            <Card>
              <CardBody>
                <div style={{ flex: '0 0 360px' }}>
                  <Cover src={book.cover} alt={book.title} />
                </div>
                <div style={{ flex: 1 }}>
                  <Title>{book.title}</Title>
                  <Description>Autor: {book.authors_name}</Description>
                  <Description>Categoria: {book.subjects && book.subjects[0] ? book.subjects[0] : 'Livro'}</Description>
                  <Description>Descrição: {book.description}</Description>
                </div>
              </CardBody>
            </Card>

            <RelatedTitle>Livros relacionados</RelatedTitle>
            <Carousel ref={carouselRef}>
              {related.map((r) => (
                <div key={r.id} style={{ flex: '0 0 240px' }} onClick={() => {
                  const badgeQuery = r.badge ? `&badge=${encodeURIComponent(r.badge)}` : '';
                  navigate(`/livro?q=${encodeURIComponent(r.raw?.key || r.id)}${badgeQuery}`);
                }}>
                  <ProductCard product={r} />
                </div>
              ))}
            </Carousel>
          </>
        )}
      </Page>
      <FooterComponent />
    </>
  );
}
