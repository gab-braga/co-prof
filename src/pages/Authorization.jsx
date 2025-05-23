import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getGoogleTokenWithAuthCode } from "../services/googleService";
import toast from "react-hot-toast";

export default () => {
  const location = useLocation();
  const navigate = useNavigate();

  async function handleToGoogleAuthorization() {
    try {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get("code");
      const error = searchParams.get("error");

      if (error) {
        throw new Error("Erro ao tentar processar autenticação.");
      } else if (code) {
        await storeGoogleAccessToken(code);
        navigate("/classes");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      toast.error('Autenticação falhou. Tente novamente mais tarde.');
    }
  }

  async function storeGoogleAccessToken(code) {
    if (!code) {
      throw new Error("Código de autorização não pode ficar vazio.");
    }
    const data = await getGoogleTokenWithAuthCode(code);
    const json = JSON.stringify(data);
    localStorage.setItem("google_access_data", json);
  }

  useEffect(() => {
    handleToGoogleAuthorization();
  }, [location]);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Processando autenticação...</h2>
      <p>Por favor, aguarde enquanto completamos seu login.</p>
    </div>
  );
};
