import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { generateToken } from "../api/auth";
import Loader from "../components/Loader";
import { Container } from "@mui/material";

enum StatusOauth {
  LOADING,
  SUCCESS,
  ERROR,
}

function OauthCallback() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const [status, setStatus] = useState<StatusOauth>(StatusOauth.LOADING);

  useEffect(() => {
    async function generateCodeHandler(code: string) {
      setStatus(StatusOauth.LOADING);
      const response = await generateToken(code);
      if (response?.data) {
        setStatus(StatusOauth.SUCCESS);
        localStorage.setItem("token", JSON.stringify(response.data));
      } else setStatus(StatusOauth.ERROR);
    }
    if (code) generateCodeHandler(code);
  }, [code]);

  return (
    <Container
      sx={{
        minWidth: "100vw",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {status === StatusOauth.LOADING && <Loader />}
      {status === StatusOauth.ERROR && <h1>ERROR AUTHENTIKASI</h1>}
    </Container>
  );
}

export default OauthCallback;
