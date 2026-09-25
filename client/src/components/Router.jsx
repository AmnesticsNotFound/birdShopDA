import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
//import ParrotShop from "./ParrotShop.jsx";
import Shop from "./Shop.jsx";
import ErrorPage from "./ErrorPage";
import Homepage from './Homepage.jsx'
import Product from "./Product.jsx";
import Parrot from "./Parrot.jsx";
import Checkout from "./Checkout.jsx";
import Faq from "./Faq.jsx";
import Testimonials from "./Testimonials.jsx";
import Info from "./Info.jsx";
import OrderHistory from "./OrderHistory.jsx";
import Order from "./Order.jsx";
import Success from "./Success.jsx";
import ReviewHistory from "./ReviewHistory.jsx";
const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/", 
      element: <App />,
      //errorElement: <ErrorPage />,
      children: [
        { path: "user/orders/:id", element: <Order /> },
        { path: "/success", element: <Success /> },
        { path: "user/orders", element: <OrderHistory /> },
        { path: "user/reviews", element: <ReviewHistory /> },
        { path: "user/info", element: <Info /> },
        { path: "shop/:category", element: <Shop /> },
        { path: "", element: <Homepage /> },
        { path: "parrot/:id", element: <Parrot /> },
        { path: "product/:id", element: <Product /> },
        { path: "checkout", element: <Checkout /> },
        { path: "faq", element: <Faq /> },
        { path: "testimonials", element: <Testimonials /> }
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;