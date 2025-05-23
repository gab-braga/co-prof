import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default () => {
  const location = useLocation();
  const navigate = useNavigate();

  function handleToAuthorization() {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      console.error(error);
    } else if (code) {
      console.log(code)
      setTimeout(async () => {
        await exchangeCode(code);
        navigate("/classes");
      }, 500);
    } else {
      navigate("/");
    }
  }

  async function exchangeCode(code) {
    try {
      const url = "";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });
      const data = await response.json();
      console.log(data);
      
      const token = code;
      localStorage.setItem("google_classroom_token", token);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    handleToAuthorization();
  }, [location]);


  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Processando autenticação...</h2>
      <p>Por favor, aguarde enquanto completamos seu login.</p>
    </div>
  );
}