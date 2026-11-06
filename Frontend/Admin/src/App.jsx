import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login/Login";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Chargers from "./components/Chargers/Chargers";
import Users from "./components/Users/Users";
import Stations from "./components/Station/Stations";
// import Bookings from './components/Bookings/Bookingslists';
import Payments from "./components/Payments";
import Feedback from "./components/Feedback";
import AddStation from "./components/Station/AddStation";
// import UpdateStation from './components/Station/UpdateStation';
import BookingList from "./components/Bookings/Bookinglists";
import AdminNotifications from "./components/Notification/Adminnotification";
import Reports from "./components/Report/Reports";
import Profile from "./components/Profile";
import AdminOffers from "./components/Offers/Adminoffers";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "stations", element: <Stations /> },
      { path: "stations/add", element: <AddStation /> },
      // { path: 'stations/:id/edit', element: <UpdateStation /> }, // added edit route
      { path: "chargers", element: <Chargers /> },
      // { path: 'bookings', element: <Bookings /> },
      { path: "bookingslist", element: <BookingList /> },
      { path: "payments", element: <Payments /> },
      { path: "users", element: <Users /> },
      { path: "feedback", element: <Feedback /> },
      { path: "reports", element: <Reports /> },
      { path: "adminnotification", element: <AdminNotifications /> },
      { path: "profile", element: <Profile /> },
      { path: "offers" , element: <AdminOffers />}
    ],
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;
