import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Users from "./pages/users/Users";
import GetSingleUser from "./pages/users/single/SingleUser";
import AddNewUser from "./pages/users/new/AddNewUser";
import Products from "./pages/products/Products";
import GetSingleProduct from "./pages/products/single/SingleProduct";
import AddNewProduct from "./pages/products/new/AddNewProduct";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { productInputs, addNewUserInps } from "./formSource";
import "./style/dark.css";
import { useContext, useEffect } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { auth } from "./firebase";
import MainLayout from "./layout/MainLayout";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";

function App() {
  const { darkMode } = useContext(DarkModeContext);  
  const router = createBrowserRouter([
    {
      path: "/",
      element:<ProtectedRoute><MainLayout /></ProtectedRoute>,
      children: [
        {
          index: true,
          element:<Home />,
        },
        {
          path: "users",
          children: [
            {
              index: true,
              element: <ProtectedRoute><Users /></ProtectedRoute>,
            },
            {
              path: ":userId",
              element: <GetSingleUser />,
            },
            {
              path: "addUser",
              element: <AddNewUser inputs={addNewUserInps} title="Add New User" />,
            },
          ],
        },
        {
          path: "products",
          children: [
            {
              index: true,
              element: <Products />,
            },
            {
              path: ":productId",
              element: <GetSingleProduct />,
            },
            {
              path: "new",
              element: <AddNewProduct inputs={productInputs} title="Add New Product" />,
            },
          ],
        },
      ],
    },
    {
      path: "login",
      element: <Login />, 
    },
  ]);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
