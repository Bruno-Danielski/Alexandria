import HeaderComponent from "../components/HeaderComponent";
import FooterComponent from "../components/FooterComponent";
import styled from "styled-components";
import { useState } from "react";
import React from "react";

const CartContainer = styled.div`
  max-width: 400px;
  margin: 2rem auto -1.5rem;
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 16px rgba(0,0,0,0.1);

  @media (max-width: 768px) {
    flex: 1;
    max-width: 400px;
    margin: auto;
    background: #fff;
    padding: 4rem;
    box-shadow: 0 2px 16px rgba(0,0,0,0.1);
  }
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: -0.75rem 0;
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  margin: -0.75rem 0;
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  background: #16a34a;
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
    background: #15803d;
  }
`;

const RemoveButton = styled.button`
  background: #ef4444;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-size: 1rem;
  cursor: pointer;
  margin-left: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CartActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const DivisaoProd = styled.hr`
  height: 1px;
  background-color: #15803d;
  border: none;
  margin: 0.25rem 0;
`;

export default function CartPage() {
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);
  const [cliente, setCliente] = useState({
    Cep: "",
    Cidade: "",
    Uf: "",
    Logradouro: "",
    Numero: "",
    Complemento: "",
    PontoReferencia: "",
    CodigoCidade: ""
  });

  function handleClienteChange(e) {
    const { name, value } = e.target;
    setCliente(prev => ({ ...prev, [name]: value }));
  }

  function handleRemove(id) {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  }

  function handleWhatsApp() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) return;

    let message = "Olá! Gostaria de comprar:\n";
    cart.forEach(item => {
      message += `\n- ${item.name} (${item.qty}x) - ${item.price}`;
    });

     message += `\n\nDados de entrega:\n`;    
     if (cliente.Logradouro) message += `Logradouro: ${cliente.Logradouro}\n`;
     if (cliente.Numero) message += `Número: ${cliente.Numero}\n`;
     if (cliente.Complemento) message += `Complemento: ${cliente.Complemento}\n`;
     if (cliente.Bairro) message += `Bairro: ${cliente.Bairro}\n`;
     if (cliente.Cidade) message += `Cidade: ${cliente.Cidade}\n`;
     if (cliente.Uf) message += `UF: ${cliente.Uf}\n`;
     if (cliente.Cep) message += `CEP: ${cliente.Cep}\n`;
     if (cliente.PontoReferencia) message += `Ponto de referência: ${cliente.PontoReferencia}\n`;
     if (cliente.CodigoCidade) message += `Código cidade: ${cliente.CodigoCidade}\n`;

    const phone = "55048999331865";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }

  return (
    <>
      <HeaderComponent />
        <PageWrapper>
        <CartContainer>
          <h2>Carrinho</h2>
          {cart.length > 0 ? (
            <>
              {cart.map((item) => (
                <React.Fragment key={item.id}>
                <DivisaoProd />
                  <CartItem key={item.id}>
                    <ItemImage src={item.image} alt={item.name} />
                    <ItemInfo>
                      <p><strong>Produto:</strong> {item.name}</p>
                      <p><strong>Preço:</strong> {item.price}</p>
                      <p><strong>Quantidade:</strong> {item.qty}</p>
                    </ItemInfo>
                    <RemoveButton title="Remover" onClick={() => handleRemove(item.id)}>×</RemoveButton>
                  </CartItem>
                  <DivisaoProd />
                </React.Fragment>
              ))}
            </>
          ) : (
            <p>Nenhum produto no carrinho.</p>
          )}
        </CartContainer>
        <CartContainer>
          <h2>Endereço</h2>
          <DivisaoProd />
          <label>CEP</label>
          <input name="Cep" value={cliente.Cep} onChange={handleClienteChange} />
          <div style={{ display: "flex", gap: "1rem" }}>
            <div style={{ flex: 3 }}>
              <label>Logradouro</label>
              <input name="Logradouro" value={cliente.Logradouro} onChange={handleClienteChange} />
            </div>
            <div style={{ flex: 1 }}>
              <label>Número</label>
              <input name="Numero" value={cliente.Numero} onChange={handleClienteChange} />
            </div>
          </div>
          <label>Complemento</label>
          <input name="Complemento" value={cliente.Complemento} onChange={handleClienteChange} />
          <div style={{ display: "flex", gap: "1rem" }}>
            <div style={{ flex: 2 }}>
              <label>Cidade</label>
              <input name="Cidade" value={cliente.Cidade} onChange={handleClienteChange} />
            </div>
            <div style={{ flex: 1 }}>
              <label>UF</label>
              <input name="Uf" value={cliente.Uf} onChange={handleClienteChange} />
            </div>
          </div>
          <label>Ponto de Referência</label>
          <input name="PontoReferencia" value={cliente.PontoReferencia} onChange={handleClienteChange} />
          <DivisaoProd />
          <CartActions>
            <Button onClick={handleWhatsApp}>
              Enviar pedido pelo WhatsApp
            </Button>
          </CartActions>
        </CartContainer>
        <FooterComponent id="contato"/>
      </PageWrapper>
    </>
  );
}