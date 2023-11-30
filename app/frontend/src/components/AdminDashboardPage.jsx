import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment-with-locales-es6";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import pl from "date-fns/locale/pl";
import BeatLoader from "react-spinners/BeatLoader";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import FlightsList from "./FlightsList";
import config from "../axios.config";

function AdminDashboardPage() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const [newFlightDate, setNewFlightDate] = useState(tomorrow);

  const navigate = useNavigate();
  moment.locale("pl");
  registerLocale("pl", pl);

  const removeFlight = async (flightId) => {
    try {
      const response = await axios({
        method: "delete",
        baseURL: config.baseURL,
        url: "/api/delete_flight/",
        params: { flight_id: flightId.toString() },
      });
      fetchFlights();
    } catch (error) {
      alert("Coś poszło nie tak. Spróbuj ponownie później");
      navigate("/");
    }
  };

  const modifyFlight = async (flightId, departureDate) => {
    try {
      const response = await axios({
        method: "post",
        baseURL: config.baseURL,
        url: "/api/modify_flight/",
        params: {
          flight_id: flightId.toString(),
          departure: departureDate.toISOString(),
        },
      });
      setNewFlightDate(tomorrow);
      fetchFlights();
    } catch (error) {
      alert("Coś poszło nie tak. Spróbuj ponownie później");
      navigate("/");
    }
  };

  const fetchFlights = async () => {
    try {
      const response = await axios({
        method: "get",
        baseURL: config.baseURL,
        url: "/api/flights/",
      });
      setFlights(response.data);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } catch (error) {
      alert("Coś poszło nie tak. Spróbuj ponownie później");
      navigate("/");
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  return (
    <div className="flex flex-col w-full h-full items-center">
      <button
        onClick={() => navigate("/admin/add-flight")}
        className="w-48 h-11 shrink-0 font-medium bg-sky-600 uppercase rounded-full border mt-4 mb-6 border-sky-600 tracking-wider hover:border-sky-800 hover:border-2 shadow-lg text-white"
      >
        Dodaj lot
      </button>
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
                <Popup
                  modal
                  trigger={
                    <button className="w-56 h-11 font-medium bg-sky-600 uppercase rounded-full border mt-4 border-gray-300 tracking-wider hover:border-sky-800 hover:border-2 shadow-lg text-white">
                      Zmień datę/godzinę
                    </button>
                  }
                  position="right center"
                >
                  {(close) => (
                    <div className="bg-white rounded-3xl h-fit z-20 flex flex-col items-center justify-center gap-2 p-10 shadow-lg text-gray-800">
                      <label>Nowa data/godzina lotu:</label>
                      <DatePicker
                        selected={newFlightDate}
                        minDate={tomorrow}
                        onChange={(date) => setNewFlightDate(date)}
                        showTimeSelect
                        timeFormat="HH:mm"
                        dateFormat="dd/MM/yyyy HH:mm"
                        locale="pl"
                        className="w-full border border-gray-300 px-2 h-[40px] rounded-md text-gray-800"
                        required
                      />
                      <button
                        onClick={() => {
                          modifyFlight(flight.flight_id, newFlightDate);
                          close();
                        }}
                        className="w-44 h-11 font-medium bg-sky-600 uppercase rounded-full border mt-4 border-gray-300 tracking-wider hover:border-sky-800 hover:border-2 shadow-lg text-white"
                      >
                        Potwierdź
                      </button>
                    </div>
                  )}
                </Popup>

                <button
                  onClick={() => removeFlight(flight.flight_id)}
                  className="w-36 h-11 font-medium bg-red-500 uppercase rounded-full border mt-4 border-gray-300 tracking-wider hover:border-red-600 hover:border-2 shadow-lg text-white"
                >
                  Usuń
                </button>
              </div>
            )}
          </FlightsList>
        ) : (
          <div className="h-40 p-4 flex flex-col items-center justify-center gap-4">
            <span className="text-lg">{"Nie znaleziono lotów"}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboardPage;
