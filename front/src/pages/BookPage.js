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
  padding: 0.8rem;
  width: 160px;
  height: 100px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 1px 6px rgba(0,0,0,0.04);

  @media (max-width: 600px) {
    width: 100%;
    height: auto;
    padding: 0.6rem;
    align-items: flex-start;
  }

  span {
    font-size: 1.25rem;
    line-height: 1;
  }
`;

const MiniLabel = styled.div`
  font-size: 0.875rem;
  color: #475569;
  text-align: center;
`;

const MiniValue = styled.div`
  font-weight: 700;
  margin-top: 0;
  text-align: center;
  white-space: normal;
  word-break: break-word;
  font-size: 0.875rem;
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const Stars = styled.div`
  display: flex;
  gap: 0.15rem;
`;

const Star = styled.span`
  color: ${({ filled }) => (filled ? '#f59e0b' : '#a3adbbff')};
  font-size: 1.1rem;
  line-height: 1;
`;

const RelatedItemWrapper = styled.div`
  flex: 0 0 160px;
  width: 160px;
  height: 230px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  cursor: pointer;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 8px;
  background: #fff;

  img {
    width: 100% !important;
    height: 150px !important;
    object-fit: cover !important;
    display: block;
    border-top-left-radius: 8px !important;
    border-top-right-radius: 8px !important;
  }

  /* ensure the rest (title/desc) does not expand beyond the wrapper */
  & > *:not(img) {
    padding: 0.5rem;
    box-sizing: border-box;
    line-height: 1.2;
  }

  /* target common title selectors inside ProductCard and force smaller, multi-line truncation */
  h3, h4, .product-title, .card-title, .name {
    font-size: 0.85rem !important;
    margin: 0 !important;
    color: #0f172a !important;
    font-weight: 600 !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    display: -webkit-box !important;
    -webkit-line-clamp: 2 !important;
    -webkit-box-orient: vertical !important;
    line-height: 1.1 !important;
    max-height: 2.2em !important;
  }

  /* small subtitle/description inside the card */
  p, .subtitle {
    font-size: 0.78rem !important;
    margin: 0 !important;
    color: #475569 !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }

  @media (max-width: 600px) {
    flex: 0 0 auto;
    width: 100%;
    height: auto;
    img {
      height: 140px !important;
    }
  }
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
        const imageLinks = vi.imageLinks || {};
        const preferredCover = imageLinks.extraLarge || imageLinks.extraLarge || imageLinks.large || imageLinks.medium || imageLinks.thumbnail || imageLinks.small || imageLinks.smallThumbnail;
        const cover = preferredCover ? String(preferredCover).replace(/^http:/, 'https:') : aboutImage;
        const authors_name = vi.authors ? vi.authors.join(', ') : '';
        const publishedYear = (vi.publishedDate && (vi.publishedDate.match(/\d{4}/) || [null])[0]) || null;
        const pageCount = vi.pageCount || null;
        const dimensions = vi.dimensions
          ? [vi.dimensions.height ? vi.dimensions.height : "0", vi.dimensions.width ? vi.dimensions.width : "0", vi.dimensions.thickness ? vi.dimensions.thickness : "0"].filter(Boolean).join(' x ')
          : (vi.physicalDimensions || vi.printedDimensions || null);
        const publisher = vi.publisher || null;
        const publishDate = vi.publishedDate || null;
        const averageRating = vi.averageRating || null;
        const ratingsCount = vi.ratingsCount || null;

        setBook({ title, description, subjects, cover, authors_name, publishedYear, pageCount, dimensions, publisher, publishDate, averageRating, ratingsCount, raw: data });

        // fetch related primarily by title keywords, fallback to author
        let relatedItems = [];
        const titleForSearch = vi.title || '';
        const normalizedTitle = String(titleForSearch)
          .replace(/["'(),.-]/g, ' ')
          .replace(/\//g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        const words = normalizedTitle.split(' ').filter(w => w.length > 3);
        const titleQuery = words.slice(0, 4).join(' ');

        if (titleQuery) {
          // try intitle: first
          try {
            let resRel = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(titleQuery)}&maxResults=12`);
            let relJson = await resRel.json();
            relatedItems = relJson.items || [];
          } catch (e) {
            relatedItems = [];
          }

          // fallback to plain title keyword search
          if ((!relatedItems || relatedItems.length === 0) && titleQuery) {
            try {
              const fallbackRes = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(titleQuery)}&maxResults=12`);
              const fallbackJson = await fallbackRes.json();
              relatedItems = fallbackJson.items || [];
            } catch (e) {
              relatedItems = [];
            }
          }
        }

        // if still nothing, try author
        if ((!relatedItems || relatedItems.length === 0) && vi.authors && vi.authors.length > 0) {
          try {
            const q = `inauthor:${vi.authors[0]}`;
            const resRel = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=12`);
            const relJson = await resRel.json();
            relatedItems = relJson.items || [];
          } catch (e) {
            relatedItems = [];
          }
        }

        const relMapped = relatedItems.map((item, idx) => {
          const v = item.volumeInfo || {};
          const id = item.id || `${v.title || 'no-title'}-${idx}`;
          const vLinks = v.imageLinks || {};
          const preferred = vLinks.extraLarge || vLinks.large || vLinks.medium || vLinks.thumbnail || vLinks.small || vLinks.smallThumbnail;
          return {
            id,
            name: v.title || 'Sem título',
            image: preferred ? String(preferred).replace(/^http:/, 'https:') : aboutImage,
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
                  <RatingRow>
                    <Stars aria-hidden="true">
                      {[1,2,3,4,5].map((i) => (
                        <Star key={i} filled={(book.averageRating || 0) >= i}>&#9733;</Star>
                      ))}
                    </Stars>
                    <small style={{ color: '#64748b' }}>{book.ratingsCount ? `${book.ratingsCount}` : 'Sem avaliações'}</small>
                  </RatingRow>
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
                      <span>📄</span>
                      <MiniValue>{book.pageCount || '—'}</MiniValue>
                    </MiniInfoCard>
                    <MiniInfoCard>
                      <MiniLabel>Dimensões</MiniLabel>
                      <span>📏</span>
                      <MiniValue>{book.dimensions || '—'}</MiniValue>
                    </MiniInfoCard>
                    <MiniInfoCard>
                      <MiniLabel>Editora</MiniLabel>
                      <span>🏢</span>
                      <MiniValue>{book.publisher || '—'}</MiniValue>
                    </MiniInfoCard>
                  </MiniInfoRow>

                </div>
              </CardBody>
            </Card>

            <RelatedTitle>Livros similares</RelatedTitle>
            <Carousel ref={carouselRef}>
              {related.map((r) => (
                <RelatedItemWrapper key={r.id} onClick={() => {
                  const badgeQuery = r.badge ? `&badge=${encodeURIComponent(r.badge)}` : '';
                  const targetId = r.raw?.id || r.raw?.key || r.id;
                  navigate(`/livro?q=${encodeURIComponent(targetId)}${badgeQuery}`);
                }}>
                  <ProductCard product={r} />
                </RelatedItemWrapper>
              ))}
            </Carousel>
            <RelatedTitle>Outras sugestões</RelatedTitle>
            <Carousel ref={carouselRef}>
              {related.map((r) => (
                <RelatedItemWrapper key={r.id} onClick={() => {
                  const badgeQuery = r.badge ? `&badge=${encodeURIComponent(r.badge)}` : '';
                  const targetId = r.raw?.id || r.raw?.key || r.id;
                  navigate(`/livro?q=${encodeURIComponent(targetId)}${badgeQuery}`);
                }}>
                  <ProductCard product={r} />
                </RelatedItemWrapper>
              ))}
            </Carousel>
          </>
        )}
      </Page>
      <FooterComponent />
    </>
  );
}
