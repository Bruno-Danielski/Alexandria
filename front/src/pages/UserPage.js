import { useState } from 'react';
import styled from 'styled-components';
import HeaderComponent from '../components/HeaderComponent';
import FooterComponent from '../components/FooterComponent';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Page = styled.div`
  max-width: 1100px;
  margin: 2rem auto;
  padding: 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 1rem;
  padding-top: 5.5rem;
  padding-bottom: 5.5rem;
`;

const Sidebar = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 16px rgba(0,0,0,0.10);
`;

const Tab = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.6rem 0.8rem;
  margin-bottom: 0.5rem;
  border-radius: 6px;
  border: none;
  background: ${({ active }) => (active ? '#e6f2ff' : 'transparent')};
  cursor: pointer;
`;

const Content = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 16px rgba(0,0,0,0.10);
`;

const Field = styled.div`
  margin-bottom: 0.75rem;
`;

const Label = styled.div`
  font-size: 0.85rem;
  color: #475569;
  margin-bottom: 0.25rem;
`;

const Value = styled.div`
  font-weight: 600;
`;

const Button = styled.button`
  position: relative; 
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

  span {
    margin-right: 0.5rem;
  }

  &:hover {
    background: #93c5fd;
  }
`;

export default function UserPage() {
  const [active, setActive] = useState('user');
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate('/');
  }

  if (loading) {
    return (
      <>
        <HeaderComponent />
        <Page>Carregando...</Page>
        <FooterComponent />
      </>
    );
  }

  return (
    <>
      <HeaderComponent />
      <Page>
        <Grid>
          <Sidebar>
            <Tab active={active === 'user'} onClick={() => setActive('user')}>Usuário</Tab>
            <Tab active={active === 'logout'} onClick={() => setActive('logout')}>Sair</Tab>
          </Sidebar>

          <Content>
            {active === 'user' ? (
              user ? (
                <div>
                  <Field>
                    <Label>Nome</Label>
                    <Value>{user.user_metadata?.name || user.email.split('@')[0]}</Value>
                  </Field>
                  <Field>
                    <Label>Email</Label>
                    <Value>{user.email || '—'}</Value>
                  </Field>
                  <Field>
                    <Label>Administrador</Label>
                    <Value>{user.user_metadata?.administrador === 'S' ? 'Sim' : 'Não'}</Value>
                  </Field>
                </div>
              ) : (
                <div>Usuário não está logado. <button onClick={() => navigate('/login')}>Entrar</button></div>
              )
            ) : (
              <div>
                <p>Deseja sair da sua conta?</p>
                <Button onClick={handleLogout}>Sair</Button>
              </div>
            )}
          </Content>
        </Grid>
      </Page>
      <FooterComponent />
    </>
  );
}
