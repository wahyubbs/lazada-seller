import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "./App.css";
import Home from "./pages/Home";
import OauthCallback from "./pages/OauthCallback";
import Loader from "./components/Loader";
import SellerContextProvider from "./context/SellerProvider";
import CreateProduct from "./pages/product/Create";
import Product from "./pages/product/Index";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      loader: Loader,
    },
    {
      path: "callback",
      element: <OauthCallback />,
      loader: Loader,
    },
    {
      path: "/product",
      element: <Product />,
      loader: Loader,
      children: [
        {
          path: "create",
          element: <CreateProduct />,
        },
      ],
    },
  ]);

  return (
    <SellerContextProvider>
      <RouterProvider router={router} />
    </SellerContextProvider>
  );
}
export default App;
