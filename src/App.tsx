import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "./App.css";
import Home from "./pages/Home";
import OauthCallback from "./pages/OauthCallback";
import Loader from "./components/Loader";

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
  ]);

  return <RouterProvider router={router} />;
}
export default App;
