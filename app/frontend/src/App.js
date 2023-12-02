import { useState } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import SearchPage from "./components/SearchPage";
import ResultsPage from "./components/ResultsPage";
import ChooseSeatsPage from "./components/ChooseSeatsPage";
import EnterDetailsPage from "./components/EnterDetailsPage";
import NoTicketsPage from "./components/NoTicketsPage";
import BookingSuccessfulPage from "./components/BookingSuccessfulPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import AdminDashboardPage from "./components/AdminDashboardPage";
import ClientDashboardPage from "./components/ClientDashboardPage";
import AddFlightPage from "./components/AddFlightPage";

function App() {
  const isAuth = localStorage.getItem("access_token");
  const isAdmin = localStorage.getItem("user_id") === "1";

  return (
    <div className="h-screen w-screen overflow-scroll items-center flex justify-center bg-plane-bg bg-no-repeat bg-cover bg-fixed bg-center">
      <BrowserRouter>
        <Routes>
          <Route>
            <Route
              path="/"
              element={
                isAuth ? <SearchPage /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="admin"
              element={
                isAdmin ? <AdminDashboardPage /> : <Navigate to="/" replace />
              }
            />
            <Route
              path="admin/add-flight"
              element={
                isAdmin ? <AddFlightPage /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="client"
              element={
                isAuth ? (
                  <ClientDashboardPage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route
              path="results"
              element={
                isAuth ? <ResultsPage /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="seats"
              element={
                isAuth ? <ChooseSeatsPage /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="details"
              element={
                isAuth ? <EnterDetailsPage /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="no-available-tickets"
              element={
                isAuth ? <NoTicketsPage /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="booking-successful"
              element={
                isAuth ? (
                  <BookingSuccessfulPage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />{" "}
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
