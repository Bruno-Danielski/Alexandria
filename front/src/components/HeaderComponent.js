import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { useEffect, useState } from "react";


const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(6px);
  border-bottom: 1px solid #e5e7eb;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  h1 {
    font-size: 1.5rem;
    font-weight: bold;
    color: #284781ff;

    @media (max-width: 460px) {
      font-size: 20px;
    }

    @media (max-width: 405px) {
      font-size: 15px;
    }

    @media (max-width: 370px) {
      font-size: 12px;
    }
  }

  img {
    width: 120px;
    height: 40px;

    @media (max-width: 460px) {
      width: 35px;
      height: 55px;
    }

    @media (max-width: 405px) {
      width: 30px;
      height: 50px;
    }

    @media (max-width: 370px) {
      width: 25px;
      height: 45px;
    }
  }
`;

const Nav = styled.nav`
  display: none;

  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  a {
    color: #4b5563;
    text-decoration: none;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
      color: #93c5fd;
    }
  }
`;

const Button = styled.button`
  position: relative; // Adicionado
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

const Hamburger = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-right: 1rem;

  @media (min-width: 768px) {
    display: none;
  }

  span {
    display: block;
    width: 28px;
    height: 3px;
    background: #93c5fd;
    border-radius: 2px;
  }
`;

const MobileMenu = styled.div`
  left: 0;
  width: 100vw;
  background: #fff;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  z-index: 100;
  padding: 1.5rem 0;

  a {
    color: #93c5fd;
    text-decoration: none;
    font-size: 1.2rem;
    padding: 1rem 2rem;
    cursor: pointer;
    transition: background 0.2s;
    &:hover {
      background: #f0fdf4;
    }
  }
`;

export default function HeaderComponent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);


  const handleScrollOrNavigate = (id) => {
    if (location.pathname === "/") {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/", { state: { scrollTo: id } });
    }
  };

  useEffect(() => {
    function updateUserFromStorage() {
      try {
        const u = JSON.parse(localStorage.getItem('user')) || null;
        setUser(u);
      } catch (e) {
        setUser(null);
      }
    }
    window.addEventListener('storage', updateUserFromStorage);
    updateUserFromStorage();
    return () => {
      window.removeEventListener('storage', updateUserFromStorage);
    };
  }, []);

  const goProfile = () => {
    const u = user || (() => { try { return JSON.parse(localStorage.getItem('user')); } catch(e) { return null; } })();
    if (u) navigate('/usuario');
    else navigate('/login');
  };

  return (
    <Header>
      <Container>
        <LogoWrapper>
          <Hamburger onClick={() => setMenuOpen(!menuOpen)}>
            <span />
            <span />
            <span />
          </Hamburger>
          <img src="/logo.png" alt="Logo" />
        </LogoWrapper>

        <Nav>
          <a onClick={() => handleScrollOrNavigate("home")}>Início</a>
          <a onClick={() => handleScrollOrNavigate("sobre")}>Sobre</a>
          <RouterLink to="/catalogo">Catálogo</RouterLink>
        </Nav>

        <Button onClick={goProfile}>
          <span>👤</span>
          {user ? (user.name ? user.name.split(' ')[0] : 'Perfil') : 'Entrar'}
        </Button>
      </Container>
      {menuOpen && (
        <MobileMenu>
          <a onClick={() => { setMenuOpen(false); handleScrollOrNavigate("home"); }}>Início</a>
          <a onClick={() => { setMenuOpen(false); handleScrollOrNavigate("sobre"); }}>Sobre</a>
          <RouterLink to="/catalogo" onClick={() => setMenuOpen(false)}>Catálogo</RouterLink>
        </MobileMenu>
      )}
    </Header>
  );
}
