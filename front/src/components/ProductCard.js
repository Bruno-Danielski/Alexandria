import styled from "styled-components";

const Card = styled.div`
  background: white;
  border-radius: 0.75rem;
  display: flex; 
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  transition: box-shadow 0.3s;
  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  border: 1px solid rgba(95, 154, 243, 0.25);
  cursor: pointer;
`;

const CardImage = styled.img`
  width: 100%;
  height: 16rem;
  object-fit: cover;
`;

const CardBody = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Badge = styled.span`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background: #1371e6ff;
  color: white;
  font-size: 0.875rem;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
`;

// Rating components
const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.35rem;
  align-self: flex-end;
`;

const Stars = styled.div`
  display: flex;
  gap: 0.12rem;
`;

const Star = styled.span`
  color: ${({ filled }) => (filled ? '#f59e0b' : '#e2e8f0')};
  font-size: 0.95rem;
  line-height: 1;
`;

const RatingCount = styled.small`
  color: #64748b;
  font-size: 0.85rem;
`;

export default function ProductCard({ product, onClick }) {
  const avg = Number(product?.raw?.volumeInfo?.averageRating || product?.averageRating || 0);
  const count = product?.raw?.volumeInfo?.ratingsCount || product?.ratingsCount || 0;

  return (
    <Card onClick={onClick}>
      <div style={{ position: "relative" }}>
        <CardImage src={product.image || "/placeholder.svg"} alt={product.name} />
        {product.badge && <Badge>{product.badge}</Badge>}
      </div>
      <CardBody>
        <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "0.25rem" }}>
          {product.name}
        </h3>
        {/* rating row below title */}
        <RatingRow>
          <Stars aria-hidden="true">
            {[1,2,3,4,5].map((i) => (
              <Star key={i} filled={avg >= i}>&#9733;</Star>
            ))}
          </Stars>
        </RatingRow>
      </CardBody>
    </Card>
  );
}