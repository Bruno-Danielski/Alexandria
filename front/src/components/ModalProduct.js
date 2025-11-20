import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 2px 16px rgba(0,0,0,0.2);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #eee;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 1.2rem;
  cursor: pointer;
`;

const ModalImage = styled.img`
  width: 100%;
  max-height: 220px;
  object-fit: contain;
  border-radius: 8px;
  margin-bottom: 1rem;
  background: #f3f3f3;
  display: block;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  background: #1371e6ff;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: background 0.2s;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  span {
    margin-right: 0.5rem;
  }

  &:hover {
    background: #60a5fa;
  }
`;

const ControlsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2rem;
`;

const CounterWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CounterButton = styled.button`
  background: #eee;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 1.2rem;
  cursor: pointer;
`;

const CounterValue = styled.span`
  font-size: 1.2rem;
  min-width: 32px;
  text-align: center;
`;

export default function ModalProduct({ product, onClose }) {
  const [count, setCount] = useState(1);
  const navigate = useNavigate();

  if (!product) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose} title="Fechar">&times;</CloseButton>
        <h2 style={{ marginTop: 0 }}>{product.name}</h2>
        <ModalImage
          src={product.image || "/placeholder.svg"}
          alt={product.name}
        />
        <p><strong>Categoria:</strong> {product.badge}</p>
        <p><strong>Descrição:</strong> {product.description}</p>
        <ControlsRow>
          <CounterWrapper>
          </CounterWrapper>
          <Button
            onClick={() => {
              const targetId = product?.raw?.id || product?.raw?.key || product.id;
              onClose();
              navigate(`/livro?q=${encodeURIComponent(targetId)}`);
            }}
          >
            Ver descrição completa
          </Button>
        </ControlsRow>
      </ModalContent>
    </ModalOverlay>
  );
}