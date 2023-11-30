import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment-with-locales-es6";
import BeatLoader from "react-spinners/BeatLoader";
import FlightsList from "./FlightsList";
import config from "../axios.config";

function ClientDashboardPage() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  moment.locale("pl");

  const listFlightsParams = {
    from_airport_id: 1,
    to_airport_id: 2,
    date: new Date(2023, 11, 2).toISOString(),
  };

  const cancelBooking = (flightId) => {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios({
          method: "get",
          baseURL: config.baseURL,
          url: "/api/find_flights/",
          params: listFlightsParams,
        });
        setFlights(response.data);
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.log(error);
        alert("Something went wrong. Please try again.");
      }
    };

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
            <button
              onClick={() => cancelBooking(flight.flight_id)}
              className="w-56 h-11 font-medium bg-red-500 uppercase rounded-full border mt-4 border-gray-300 tracking-wider hover:border-red-600 hover:border-2 shadow-lg text-white"
            >
              Anuluj rezerwację
            </button>
          )}
        </FlightsList>
      ) : (
        <div className="h-40 p-4 flex flex-col items-center justify-center gap-4">
          <span className="text-lg">{"Nie znaleziono lotów"}</span>
        </div>
      )}
    </div>
  );
}

export default ClientDashboardPage;
