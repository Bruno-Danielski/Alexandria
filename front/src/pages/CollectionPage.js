import styled from 'styled-components';
import HeaderComponent from '../components/HeaderComponent';
import FooterComponent from '../components/FooterComponent';

const Page = styled.div`
  max-width: 1100px;
  margin: 2rem auto;
  padding: 1rem;
`;

export default function CollectionPage() {
  return (
    <>
      <HeaderComponent />
      <Page>
        <h1>Minha Coleção</h1>
        <p>Aqui você verá os livros salvos por você. (Em desenvolvimento)</p>
      </Page>
      <FooterComponent />
    </>
  );
}
