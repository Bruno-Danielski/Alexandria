import HeaderComponent from "../components/HeaderComponent";
import FooterComponent from "../components/FooterComponent";
import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

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
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e && e.preventDefault && e.preventDefault();
    setMessage('');
    setError(false);
    setLoading(true);

    if (!email || !password) {
      setError(true);
      setMessage('Preencha email e senha.');
      setLoading(false);
      return;
    }

    try {
      if (mode === 'register') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name || email.split('@')[0],
              administrador: 'N'
            },
            emailRedirectTo: `${window.location.origin}/`
          }
        });

        if (error) {
          if (error.message.includes('already registered')) {
            setError(true);
            setMessage('Este email já está cadastrado. Tente fazer login.');
            setLoading(false);
            return;
          }
          throw error;
        }

        console.log('Dados do registro:', data);

        // Verificar se há sessão
        if (data?.session) {
          console.log('Usuário logado automaticamente');
          setMessage('Conta criada com sucesso! Redirecionando...');
          setError(false);
          setTimeout(() => navigate('/'), 800);
        } else if (data?.user && !data.session) {
          // Se não há sessão, fazer login automaticamente
          console.log('Fazendo login automático...');
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (loginError) {
            console.error('Erro ao fazer login automático:', loginError);
            setMessage('Conta criada! Faça login para continuar.');
            setError(false);
          } else {
            console.log('Login automático bem-sucedido');
            setMessage('Conta criada com sucesso! Redirecionando...');
            setError(false);
            setTimeout(() => navigate('/'), 800);
          }
        } else {
          setMessage('Conta criada! Verifique seu email para confirmar.');
          setError(false);
        }
      } else {
        console.log('Tentando fazer login...');
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        console.log('Resultado do login:', { data, error });

        if (error) throw error;

        // Verificar sessão após login
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Sessão após login:', session);

        // Verificar localStorage
        console.log('localStorage após login:', {
          keys: Object.keys(localStorage),
          supabaseKeys: Object.keys(localStorage).filter(k => k.includes('supabase'))
        });

        setMessage('Login bem-sucedido. Redirecionando...');
        setError(false);
        setTimeout(() => navigate('/'), 800);
      }
    } catch (err) {
      console.error('Erro:', err);
      setError(true);
      setMessage(err.message || 'Erro ao processar solicitação.');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        }
      });

      if (error) throw error;
    } catch (err) {
      console.error('Erro ao fazer login com Google:', err);
      setError(true);
      setMessage('Erro ao fazer login com Google.');
    }
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

            <Button type="submit" disabled={loading}>
              {loading ? 'Processando...' : (mode === 'login' ? 'Entrar' : 'Criar conta')}
            </Button>

            <Row>
              <SecondaryButton type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
                {mode === 'login' ? 'Criar conta' : 'Já tenho conta'}
              </SecondaryButton>
            </Row>

            <div style={{ marginTop: '1rem' }}>
              <SecondaryButton type="button" onClick={handleGoogleLogin}>
                Entrar com Google
              </SecondaryButton>
            </div>
          </form>
        </Center>
        <FooterComponent />
      </PageWrapper>
    </>
  );
}