import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    async function handleCallback() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      const storedState = sessionStorage.getItem('oauth_state');
      const verifier = sessionStorage.getItem('pkce_verifier');

      if (!code) {
        console.error('No code in callback');
        navigate('/');
        return;
      }
      if (state !== storedState) {
        console.error('Invalid state');
        navigate('/');
        return;
      }

      const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE';
      const tokenUrl = 'https://oauth2.googleapis.com/token';

      try {
        const body = new URLSearchParams({
          client_id: GOOGLE_CLIENT_ID,
          grant_type: 'authorization_code',
          code,
          redirect_uri: `${window.location.origin}/auth/google/callback`,
          code_verifier: verifier,
        });

        const res = await fetch(tokenUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: body.toString(),
        });

        if (!res.ok) {
          console.error('Token exchange failed', await res.text());
          navigate('/');
          return;
        }

        const tokenJson = await res.json();
        const accessToken = tokenJson.access_token;

        // fetch userinfo
        const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!userRes.ok) {
          console.error('Failed to fetch userinfo');
          navigate('/');
          return;
        }
        const profile = await userRes.json();

        // save user (simple localStorage approach)
        const user = { email: profile.email, name: profile.name, picture: profile.picture, provider: 'google' };
        localStorage.setItem('user', JSON.stringify(user));

        // cleanup
        sessionStorage.removeItem('pkce_verifier');
        sessionStorage.removeItem('oauth_state');

        navigate('/');
      } catch (err) {
        console.error('Google callback error', err);
        navigate('/');
      }
    }

    handleCallback();
  }, [navigate]);

  return null;
}
