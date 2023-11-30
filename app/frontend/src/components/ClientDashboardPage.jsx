import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment-with-locales-es6";
import BeatLoader from "react-spinners/BeatLoader";
import FlightsList from "./FlightsList";
import config from "../axios.config";

function ClientDashboardPage() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  moment.locale("pl");
  const navigate = useNavigate();

  const cancelBooking = async (bookingId) => {
    try {
      const response = await axios({
        method: "delete",
        baseURL: config.baseURL,
        url: "/api/delete_booking/",
        params: { booking_id: bookingId.toString() },
      });
      fetchData();
    } catch (error) {
      alert("Coś poszło nie tak. Spróbuj ponownie później");
      navigate("/");
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios({
        method: "get",
        baseURL: config.baseURL,
        url: "/api/get_bookings_for_client/",
        params: { client_id: "1" },
      });
      setFlights(
        response.data.map((item) => ({
          booking_id: item.booking_id,
          seats: item.seats,
          ...item.flight_info,
        }))
      );
      setLoading(false);
    } catch (error) {
      alert("Coś poszło nie tak. Spróbuj ponownie później");
      navigate("/");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-white rounded-3xl w-[90%] h-fit z-20 flex flex-col items-center justify-center shadow-lg text-gray-800">
      {loading ? (
        <div className="py-10 flex flex-col items-center justify-center gap-4">
          <BeatLoader
            color={"#0284be"}
            loading={loading}
            size={15}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : Array.isArray(flights) && flights.length > 0 ? (
        <FlightsList flights={flights}>
          {(flight) => (
            <div className="flex flex-col items-center">
              <span>Liczba biletów: {flight.seats}</span>
              <button
                onClick={() => cancelBooking(flight.booking_id)}
                className="w-56 h-11 font-medium bg-red-500 uppercase rounded-full border mt-4 border-gray-300 tracking-wider hover:border-red-600 hover:border-2 shadow-lg text-white"
              >
                Anuluj rezerwację
              </button>
            </div>
          )}
        </FlightsList>
      ) : (
        <div className="h-40 p-4 flex flex-col items-center justify-center gap-4">
          <span className="text-lg">Brak rezerwacji</span>
        </div>
      )}
    </div>
  );
}

export default ClientDashboardPage;
