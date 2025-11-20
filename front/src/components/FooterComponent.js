import styled from "styled-components";

const Footer = styled.footer`
  background: #1f2937; /* bg-gray-800 */
  color: white;
  padding: 3rem 1rem;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
  justify-content: center;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 4rem;
  }
`;

const Brand = styled.div`
  grid-area: brand;
  margin-top: 0;

  .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;

    span {
      font-size: 1.5rem;
      color: #4ade80; /* text-green-400 */
    }

    h3 {
      font-size: 1.25rem;
      font-weight: bold;
      color: #065f46;
    }
  }

  p {
    color: #9ca3af; /* text-gray-400 */
  }
`;

const Section = styled.div`
  h4 {
    font-weight: 600;
    margin-bottom: 1rem;
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    a {
      color: #9ca3af;
      text-decoration: none;
      transition: color 0.2s;

      &:hover {
        color: white;
      }
    }
  }

  p {
    color: #9ca3af;
  }
  
  &:nth-child(2) {
    grid-area: links;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: left;
  }
`;

const Bottom = styled.div`
  border-top: 1px solid #374151; /* border-gray-700 */
  margin-top: 2rem;
  padding-top: 2rem;
  text-align: center;
  color: #9ca3af;
`;

export default function FooterComponent() {
  return (
    <Footer id="contato">
      <Container>
        <Grid>
          <Brand>
            <div className="logo">
              <img src="/logo.png" alt="Logo" width="180" height="60"/>
            </div>
            <p>
              Alexandria - Sua biblioteca digital.
            </p>
          </Brand>

          <Section>
            <h4>Links Rápidos</h4>
            <ul>
              <li><a href="#catalogo">Início</a></li>
              <li><a href="#catalogo">Catálogo</a></li>
              <li><a href="#sobre">Sobre</a></li>
            </ul>
          </Section>
        </Grid>

        <Bottom>
          <p>&copy; 2025 Alexandria. Todos os direitos reservados.</p>
        </Bottom>
      </Container>
    </Footer>
  );
}
