import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import pl from "date-fns/locale/pl";
import "react-datepicker/dist/react-datepicker.css";
import config from "../axios.config";

export function AddFlightPage() {
  const [airports, setAirports] = useState([]);
  const [options, setOptions] = useState([]);

  const navigate = useNavigate();
  registerLocale("pl", pl);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const [departureAirport, setDepartureAirport] = useState(null);
  const [arrivalAirport, setArrivalAirport] = useState(null);
  const [flightDate, setFlightDate] = useState(tomorrow);
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [ticketPrice, setTicketPrice] = useState(1);

  const addFlight = async () => {
    try {
      const response = await axios({
        method: "post",
        baseURL: config.baseURL,
        url: "api/create_flight/",
        params: {
          from_airport_id: departureAirport.value.toString(),
          to_airport_id: arrivalAirport.value.toString(),
          seats: numberOfSeats.toString(),
          ticket_price: ticketPrice.toString(),
          departure_time: flightDate.toISOString(),
        },
      });
    } catch (error) {
      alert("Coś poszło nie tak. Spróbuj ponownie później");
      navigate("/");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios({
          method: "get",
          baseURL: config.baseURL,
          url: "api/airports/",
        });
        setAirports(response.data);
      } catch (error) {
        alert("Coś poszło nie tak. Spróbuj ponownie później");
        navigate("/");
      }
    };

    fetchData();
  }, []);

  const onSubmit = () => {
    addFlight();
    navigate("/admin");
  };

  useEffect(() => {
    if (airports && Array.isArray(airports) && airports.length > 0) {
      const airportOptions = airports.map((airport) => ({
        value: airport.airport_id,
        label: airport.airport_full_name,
      }));

      setOptions(airportOptions);
    }
  }, [airports]);

  return (
    <div className="bg-white rounded-3xl w-[40%] h-fit py-12 z-20 flex flex-col items-center justify-center gap-8 shadow-lg">
      <form
        onSubmit={onSubmit}
        className="flex flex-col items-center gap-4 w-[50%]"
      >
        <div className="w-[350px]">
          <label className="text-gray-700">Odlot</label>
          <Select
            options={options}
            name="select1"
            placeholder="Lotnisko"
            className="w-full"
            onChange={setDepartureAirport}
            required
          />
        </div>
        <div className="w-[350px]">
          <label className="text-gray-700">Przylot</label>
          <Select
            options={options}
            placeholder="Lotnisko"
            className="w-full"
            onChange={setArrivalAirport}
            required
          />
        </div>

        <div className="w-[350px] flex flex-col">
          <label className="text-gray-700">Data i godzina wylotu</label>
          <DatePicker
            selected={flightDate}
            minDate={tomorrow}
            onChange={(date) => setFlightDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            dateFormat="dd/MM/yyyy HH:mm"
            locale="pl"
            className="w-full border border-gray-300 px-2 h-[40px] rounded-md text-gray-800"
            required
          />
        </div>

        <div className="w-[350px] flex flex-col">
          <label className="text-gray-700">Ilość miejsc</label>
          <input
            type="number"
            min={1}
            max={200}
            step={1}
            required
            onChange={(e) => setNumberOfSeats(parseInt(e.target.value, 10))}
            className="w-full border border-gray-300 px-2 h-[40px] rounded-md text-gray-800"
          />
        </div>

        <div className="w-[350px] flex flex-col">
          <label className="text-gray-700">Cena biletu</label>
          <input
            type="number"
            min={1}
            max={1000}
            step={1}
            required
            onChange={(e) => setTicketPrice(parseInt(e.target.value, 10))}
            className="w-full border border-gray-300 px-2 h-[40px] rounded-md text-gray-800"
          />
        </div>

        <button
          type="submit"
          className="w-[170px] h-11 font-medium bg-sky-600 uppercase rounded-full border mt-4 border-gray-300 tracking-wider hover:border-sky-500 hover:border-2 shadow-lg text-white"
        >
          Dodaj lot
        </button>
      </form>
    </div>
  );
}

export default AddFlightPage;
