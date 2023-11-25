import React, { useState, useEffect } from "react";

const Timer = ({ bookingId, onTimerExpired }) => {
  const [timeLeft, setTimeLeft] = useState(360);

  useEffect(() => {
    const storedBookingId = localStorage.getItem("bookingId");
    const storedTimeLeft =
      parseInt(localStorage.getItem("timeLeft"), 10) || 360;

    if (storedBookingId === `${bookingId}`) {
      setTimeLeft(storedTimeLeft);
    } else {
      setTimeLeft(360);
      localStorage.setItem("bookingId", bookingId);
      localStorage.setItem("timeLeft", "360");
    }

    const timerInterval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 0) {
          localStorage.setItem("timeLeft", prevTime - 1);
          return prevTime - 1;
        } else {
          clearInterval(timerInterval);
          onTimerExpired();
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [bookingId]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="mb-2">
      <p>
        Pozostały czas: {String(minutes).padStart(2, "0")}:
        {String(seconds).padStart(2, "0")}
      </p>
    </div>
  );
};

export default Timer;
