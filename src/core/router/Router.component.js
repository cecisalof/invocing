import * as ReactDOM from "react-dom";
import {
  createBrowserRouter,
  RouterProvider,
} from "react--dom";

import Login from "./componente/login/Login";
// import MainLayout from "../layout/MainLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  // {
  //   path: "/main",
  //   element: <MainLayout />,
  // },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);