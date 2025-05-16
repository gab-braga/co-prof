import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default () => {
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
        console.error(error)
    }

    if (code) {
        console.log(code)
    }
  }, [location]);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Processando autenticação...</h2>
      <p>Por favor, aguarde enquanto completamos seu login.</p>
    </div>
  );
}