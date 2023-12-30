import { Box, Container, Tab, Tabs } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import Loader from "../components/Loader";
import { getSellerInfo } from "../api/seller";
import { SellerContext } from "../context/SellerProvider";
import { CustomTabPanel } from "../components/tabs/CustomTabPanel";
import Profile from "../components/profile/Profile";
import ListProducts from "../components/product/ListProducts";

function a11yProps(name: string) {
  return {
    id: `tab-${name}`,
    "aria-controls": `tabpanel-${name}`,
  };
}
function Home() {
  const data: null | {
    token: string;
    refresh_token: string;
    login_date: string;
    expired: number;
  } = localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token")!)
    : null;
  const [isLogin, setisLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { seller, setSeller } = useContext(SellerContext)!;
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    async function getSellerInfoHandler(accessToken: string) {
      setIsLoading(true);

      const response = await getSellerInfo(accessToken);
      if (response?.data) setSeller(response.data);
      setIsLoading(false);
    }
    getSellerInfoHandler(data?.token ? data.token : "");
  }, []);

  if (data) {
    const { login_date, expired } = data;
    const currentSession =
      (new Date().getTime() - new Date(login_date).getTime()) / 86400000;
    if (expired / 86400 > currentSession) {
      return (
        <Container sx={{ minHeight: "100vh" }}>
          <h1 style={{ textAlign: "center" }}>{seller?.name}</h1>

          <Box sx={{ width: "100%", maxWidth: "lg", mx: "auto" }}>
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <Tabs
                sx={{ maxWidth: "500px" }}
                variant="fullWidth"
                aria-label="fullWidth tabs"
                value={value}
                onChange={handleChange}
              >
                <Tab
                  // icon={<LocalShippingIcon />}
                  iconPosition="start"
                  label="Product Management"
                  {...a11yProps("productmanagement")}
                />
                <Tab
                  // icon={<TroubleshootIcon />}
                  iconPosition="start"
                  label="Profile"
                  {...a11yProps("profile")}
                />
              </Tabs>
            </Box>
            <CustomTabPanel name="Product Management" value={value} index={0}>
              <ListProducts />
            </CustomTabPanel>
            <CustomTabPanel name="Profile" value={value} index={1}>
              <Profile />
            </CustomTabPanel>
          </Box>
        </Container>
      );
    } else {
      window.location.replace(import.meta.env.VITE_API_BASE_URL + "/auth");
      return <Loader />;
    }
  } else {
    window.location.replace(import.meta.env.VITE_API_BASE_URL + "/auth");
    return <Loader />;
  }
}

export default Home;
