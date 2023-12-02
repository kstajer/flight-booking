import React from "react";
import moment from "moment-with-locales-es6";
import { MdArrowRightAlt } from "react-icons/md";
import { LuPlaneLanding } from "react-icons/lu";
import { LuPlaneTakeoff } from "react-icons/lu";

function FlightsList({ flights, children }) {
  moment.locale("pl");

  const getTime = (date) => {
    return moment(date).format("HH:mm");
  };

  const getDate = (date) => {
    return moment(date).format("D MMMM yyyy");
  };

  return (
    <>
      {flights.map((flight, index) => (
        <div className="w-full" key={flight.flight_id}>
          <div
            key={flight.flight_id}
            className="w-full flex justify-between items-center p-8 px-12"
          >
            <div className="w-24 h-24 opacity-95 bg-airline bg-contain bg-no-repeat bg-center" />
            <div className="flex flex-col items-center ml-16">
              <span className="mb-4 text-gray-600">
                {getDate(flight.departure_time)}
              </span>
              <div className="w-full flex text-3xl gap-6 justify-center items-center">
                <LuPlaneTakeoff className="text-gray-300 text-xl" />
                <span className="text-xl">
                  {getTime(flight.departure_time)}
                </span>
                <span>{flight.from_airport_code}</span>
                <MdArrowRightAlt />
                <span>{flight.to_airport_code}</span>
                <span className="text-xl">{getTime(flight.arrival_time)}</span>
                <LuPlaneLanding className="text-gray-300 text-xl" />
              </div>
            </div>
            {typeof children === "function" && children(flight)}
          </div>
          {index !== flights.length - 1 && (
            <hr className="text-gray-300 w-full" />
          )}
        </div>
      ))}
    </>
  );
}

export default FlightsList;
