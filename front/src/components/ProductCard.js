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

export default function ProductCard({ product, onClick }) {
  return (
    <Card onClick={onClick}>
      <div style={{ position: "relative" }}>
        <CardImage src={product.image || "/placeholder.svg"} alt={product.name} />
        {product.badge && <Badge>{product.badge}</Badge>}
      </div>
      <CardBody>
        <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "0.5rem" }}>
          {product.name}
        </h3>
      </CardBody>
    </Card>
  );
}