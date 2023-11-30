import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment-with-locales-es6";
import DatePicker from "react-datepicker";
import BeatLoader from "react-spinners/BeatLoader";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import FlightsList from "./FlightsList";
import config from "../axios.config";

function AdminDashboardPage() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  const [flightDate, setFlightDate] = useState(new Date());

  const navigate = useNavigate();
  moment.locale("pl");

  const listFlightsParams = {
    from_airport_id: 1,
    to_airport_id: 2,
    date: new Date(2023, 11, 2).toISOString(),
  };

  const removeFlight = (flightId) => {};

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
    <div className="flex flex-col w-full h-full items-center">
      <button
        onClick={() => navigate("/admin/add-flight")}
        className="w-48 h-11 font-medium bg-sky-600 uppercase rounded-full border mt-4 mb-6 border-sky-600 tracking-wider hover:border-sky-800 hover:border-2 shadow-lg text-white"
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
                    <button
                      // onClick={() => handleSubmit(flight.flight_id)}
                      className="w-48 h-11 font-medium bg-sky-600 uppercase rounded-full border mt-4 border-gray-300 tracking-wider hover:border-sky-800 hover:border-2 shadow-lg text-white"
                    >
                      Zmień godziny
                    </button>
                  }
                  position="right center"
                >
                  <div className="bg-white rounded-3xl h-fit z-20 flex flex-col items-center justify-center gap-2 p-10 shadow-lg text-gray-800">
                    <label>Nowa data/godzina lotu:</label>
                    <DatePicker
                      selected={flightDate}
                      minDate={new Date()}
                      onChange={(date) => setFlightDate(date)}
                      showTimeSelect
                      timeFormat="HH:mm"
                      dateFormat="MM/dd/yyyy HH:mm"
                      locale="pl"
                      className="w-full border border-gray-300 px-2 h-[40px] rounded-md text-gray-800"
                      required
                    />
                    <button
                      onClick={() => removeFlight(flight.flight_id)}
                      className="w-44 h-11 font-medium bg-sky-600 uppercase rounded-full border mt-4 border-gray-300 tracking-wider hover:border-sky-800 hover:border-2 shadow-lg text-white"
                    >
                      Potwierdź
                    </button>
                  </div>
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
