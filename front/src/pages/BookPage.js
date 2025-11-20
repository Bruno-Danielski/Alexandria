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

const MiniInfoRow = styled.div`
  display: flex;
  gap: 1rem;
  margin: 0.5rem 0 1rem 0;
  flex-wrap: wrap;
`;

const MiniInfoCard = styled.div`
  background: #e9edf1ff;
  border-radius: 8px;
  padding: 0.6rem 0.9rem;
  width: 160px;
  height: 72px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 0.25rem;
  box-shadow: 0 1px 6px rgba(0,0,0,0.04);

  @media (max-width: 600px) {
    width: 100%;
    height: auto;
    padding: 0.5rem;
  }
`;

const MiniLabel = styled.div`
  font-size: 0.75rem;
  color: #475569;
`;

const MiniValue = styled.div`
  font-weight: 700;
  margin-top: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export default function BookPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const key = params.get("q"); // expects Google Books id

  const [book, setBook] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef();

  useEffect(() => {
    if (!key) return;

    async function fetchBook() {
      setLoading(true);
      try {
        const id = key;
        const url = `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(id)}`;
        const res = await fetch(url);
        if (!res.ok) {
          setBook(null);
          setRelated([]);
          setLoading(false);
          return;
        }

        const data = await res.json();
        const vi = data.volumeInfo || {};
        const title = vi.title ? vi.title + (vi.subtitle ? ": " + vi.subtitle : "") : 'Sem título';
        const description = vi.description || '';
        const subjects = vi.categories || [];
        const cover = (vi.imageLinks && (vi.imageLinks.thumbnail || vi.imageLinks.smallThumbnail))
          ? (vi.imageLinks.thumbnail || vi.imageLinks.smallThumbnail).replace(/^http:/, 'https:')
          : aboutImage;
        const authors_name = vi.authors ? vi.authors.join(', ') : '';
        const publishedYear = (vi.publishedDate && (vi.publishedDate.match(/\d{4}/) || [null])[0]) || null;
        const pageCount = vi.pageCount || null;
        const dimensions = vi.dimensions
          ? [vi.dimensions.height, vi.dimensions.width, vi.dimensions.thickness].filter(Boolean).join(' x ')
          : (vi.physicalDimensions || vi.printedDimensions || null);
        const publisher = vi.publisher || null;
        const publishDate = vi.publishedDate || null;

        setBook({ title, description, subjects, cover, authors_name, publishedYear, pageCount, dimensions, publisher, publishDate, raw: data });

        // fetch related by category or author
        let relatedItems = [];
        if (subjects.length > 0) {
          const q = `subject:${encodeURIComponent(subjects[0])}`;
          const resRel = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=12`);
          const relJson = await resRel.json();
          relatedItems = relJson.items || [];
        } else if (vi.authors && vi.authors.length > 0) {
          const q = `inauthor:${encodeURIComponent(vi.authors[0])}`;
          const resRel = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=12`);
          const relJson = await resRel.json();
          relatedItems = relJson.items || [];
        }

        const relMapped = relatedItems.map((item, idx) => {
          const v = item.volumeInfo || {};
          const id = item.id || `${v.title || 'no-title'}-${idx}`;
          return {
            id,
            name: v.title || 'Sem título',
            image: (v.imageLinks && (v.imageLinks.thumbnail || v.imageLinks.smallThumbnail)) ? (v.imageLinks.thumbnail || v.imageLinks.smallThumbnail).replace(/^http:/, 'https:') : aboutImage,
            badge: (v.categories && v.categories[0]) || (v.authors && v.authors[0]) || 'Livro',
            description: v.description || (v.categories && v.categories.slice(0,5).join(', ')) || `Publicado em ${v.publishedDate || 'desconhecido'}`,
            raw: item,
          };
        });

        setRelated(relMapped.filter(r => r.id !== (data.id || id)).slice(0, 10));
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

                  <MiniInfoRow>
                    <MiniInfoCard>
                      <MiniLabel>Ano</MiniLabel>
                      <span>📅</span>
                      <MiniValue>{book.publishedYear || '—'}</MiniValue>
                    </MiniInfoCard>
                    <MiniInfoCard>
                      <MiniLabel>Páginas</MiniLabel>
                      <MiniValue>{book.pageCount || '—'}</MiniValue>
                    </MiniInfoCard>
                    <MiniInfoCard>
                      <MiniLabel>Dimensões</MiniLabel>
                      <MiniValue>{book.dimensions || '—'}</MiniValue>
                    </MiniInfoCard>
                    <MiniInfoCard>
                      <MiniLabel>Editora</MiniLabel>
                      <MiniValue>{book.publisher || '—'}</MiniValue>
                    </MiniInfoCard>
                    <MiniInfoCard>
                      <MiniLabel>Data de publicação</MiniLabel>
                      <MiniValue>{book.publishDate || '—'}</MiniValue>
                    </MiniInfoCard>
                    <MiniInfoCard>
                      <MiniLabel>Dimensões</MiniLabel>
                      <MiniValue>{book.dimensions || '—'}</MiniValue>
                    </MiniInfoCard>
                  </MiniInfoRow>

                </div>
              </CardBody>
            </Card>

            <RelatedTitle>Livros relacionados</RelatedTitle>
            <Carousel ref={carouselRef}>
              {related.map((r) => (
                <div key={r.id} style={{ flex: '0 0 240px' }} onClick={() => {
                  const badgeQuery = r.badge ? `&badge=${encodeURIComponent(r.badge)}` : '';
                  const targetId = r.raw?.id || r.raw?.key || r.id;
                  navigate(`/livro?q=${encodeURIComponent(targetId)}${badgeQuery}`);
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
