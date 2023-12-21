import { Container } from "@mui/material";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";

function Home() {
  const data = localStorage.getItem("token");
  const [isLogin, setisLogin] = useState(false);

  useEffect(() => {
    if (data) {
      const { token, refresh_token, login_date, expired } = JSON.parse(data);
      const currentSession =
        (new Date().getTime() - new Date(login_date).getTime()) / 86400000;
      if (expired / 86400 > currentSession) setisLogin(true);
      else window.location.replace(import.meta.env.VITE_API_BASE_URL + "/auth");
    }
  }, []);
  return <Container>{isLogin ? <h1>login</h1> : <Loader />}</Container>;
}

export default Home;
