import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
// import Dashboard from "./components/Dashboard";
import Stations from "./components/Station/Stations";
import Payments from "./components/Payments";
import Feedback from "./components/Feedback";
import Settings from "./components/Settings";
import Signup from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import ForgotPassword from "./components/Auth/ForgotPassword";
// import Profileregister from "./components/Profile/Profileregister";
import Home from "./components/Home";
import ProfileView from "./components/Profile/ProfileView";
import ProfileEdit from "./components/Profile/ProfileEdit";
import UserNotifications from "./components/Notification/UserNotification";
import Userbookings from "./components/Bookings/Userbookings";
import Chargers from "./components/Station/Chargers";
import CreateBooking from "./components/Bookings/Userbookings";
import FeedbackForm from "./components/Feedbackform";
// import Aboutus from "./components/Aboutus";
// import Contactus from "./components/Contactus";
// import CreateFeedback from "./components/CreateFeedback";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/layout",
    element: <Layout />,
    children: [
      { index: true, element: <Stations /> },
      // { path: "dashboard", element: <Dashboard /> },
      { path: "stations", element: <Stations /> },
      { path: "payments", element: <Payments /> },
      { path: "feedback", element: <Feedback /> },
      { path: "feedbackform", element: <FeedbackForm /> },
      // {path:"createfeedback" , element:<CreateFeedback/>},
      { path: "createbooking", element: <CreateBooking /> },
      { path: "settings", element: <Settings /> },
      { path: "profileme", element: <ProfileView /> },
      { path: "chargers", element: <Chargers /> },
      { path: "profileedit", element: <ProfileEdit /> },
      { path: "notification", element: <UserNotifications /> },
      { path: "Bookings", element: <Userbookings /> },
      { path: "createbooking", element: <Userbookings /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
