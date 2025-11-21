import HeaderComponent from "../components/HeaderComponent";
import FooterComponent from "../components/FooterComponent";
import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Center = styled.div`
  max-width: 420px;
  margin: 4rem auto;
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
`;

const Title = styled.h2`
  margin: 0 0 1rem 0;
  text-align: center;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 0.75rem;
`;

const Input = styled.input`
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  border: 1px solid #e6eefc;
  background: #fbfdff;
  outline: none;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: none;
  background: #1371e6ff;
  color: white;
  font-weight: 600;
  cursor: pointer;
`;

const SecondaryButton = styled.button`
  width: 100%;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: white;
  color: #111827;
  cursor: pointer;
`;

const Row = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Msg = styled.div`
  margin: 0.5rem 0 1rem 0;
  color: ${({ error }) => (error ? '#b91c1c' : '#047857')};
`;

export default function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  // placeholder: substitua por seu client id Google
  const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE';
  const GOOGLE_REDIRECT = `${window.location.origin}/auth/google/callback`;

  // PKCE helpers
  function base64UrlEncode(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function generateVerifier() {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return base64UrlEncode(array);
  }

  async function pkceChallengeFromVerifier(v) {
    const enc = new TextEncoder();
    const data = enc.encode(v);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return base64UrlEncode(digest);
  }

  function loadUsers() {
    try {
      return JSON.parse(localStorage.getItem('users')) || [];
    } catch (e) {
      return [];
    }
  }

  function saveUser(user) {
    const users = loadUsers();
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
  }

  function handleSubmit(e) {
    e && e.preventDefault && e.preventDefault();
    setMessage('');
    setError(false);

    if (!email || !password) {
      setError(true);
      setMessage('Preencha email e senha.');
      return;
    }

    const users = loadUsers();

    if (mode === 'register') {
      if (users.find(u => u.email === email)) {
        setError(true);
        setMessage('Já existe um usuário com esse email. Faça login.');
        return;
      }
      const newUser = { email, password, name: name || email };
      saveUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      setMessage('Registrado com sucesso. Redirecionando...');
      setError(false);
      setTimeout(() => navigate('/'), 800);
      return;
    }

    // login
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) {
      setError(true);
      setMessage('Credenciais inválidas.');
      return;
    }

    localStorage.setItem('user', JSON.stringify(found));
    setMessage('Login bem-sucedido. Redirecionando...');
    setError(false);
    setTimeout(() => navigate('/'), 600);
  }

  function handleGoogleLogin() {
    // Authorization Code + PKCE flow
    (async () => {
      try {
        const verifier = generateVerifier();
        const challenge = await pkceChallengeFromVerifier(verifier);
        const state = Math.random().toString(36).slice(2);
        sessionStorage.setItem('pkce_verifier', verifier);
        sessionStorage.setItem('oauth_state', state);

        const params = new URLSearchParams({
          client_id: GOOGLE_CLIENT_ID,
          redirect_uri: GOOGLE_REDIRECT,
          response_type: 'code',
          scope: 'openid profile email',
          code_challenge: challenge,
          code_challenge_method: 'S256',
          state,
          prompt: 'select_account'
        });

        const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
        window.location.href = url;
      } catch (err) {
        console.error('Erro ao iniciar PKCE:', err);
      }
    })();
  }

  return (
    <>
      <HeaderComponent />
      <PageWrapper>
        <Center>
          <Title>{mode === 'login' ? 'Entrar' : 'Registrar-se'}</Title>

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <Field>
                <label>Nome</label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome" />
              </Field>
            )}

            <Field>
              <label>Email</label>
              <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@exemplo.com" />
            </Field>

            <Field>
              <label>Senha</label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="********" />
            </Field>

            {message ? <Msg error={error}>{message}</Msg> : null}

            <Button type="submit">{mode === 'login' ? 'Entrar' : 'Criar conta'}</Button>

            <Row>
              <SecondaryButton type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'Criar conta' : 'Já tenho conta'}</SecondaryButton>
            </Row>

            <div style={{ marginTop: '1rem' }}>
              <SecondaryButton type="button" onClick={handleGoogleLogin}>Entrar com Google</SecondaryButton>
            </div>
          </form>

        </Center>
        <FooterComponent />
      </PageWrapper>
    </>
  );
}