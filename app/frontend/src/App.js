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
  return (
    <div className="h-screen w-screen overflow-scroll items-center flex justify-center bg-plane-bg bg-no-repeat bg-cover bg-fixed bg-center">
      <BrowserRouter>
        <Routes>
          <Route>
            <Route path="/" element={<SearchPage />} />
            <Route path="admin" element={<AdminDashboardPage />} />
            <Route path="admin/add-flight" element={<AddFlightPage />} />
            <Route path="client" element={<ClientDashboardPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="results" element={<ResultsPage />} />
            <Route path="seats" element={<ChooseSeatsPage />} />
            <Route path="details" element={<EnterDetailsPage />} />
            <Route path="no-available-tickets" element={<NoTicketsPage />} />
            <Route
              path="booking-successful"
              element={<BookingSuccessfulPage />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />{" "}
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
