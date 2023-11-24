import React from "react";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment-with-locales-es6";
import Select from "react-select";

function EnterDetailsPage() {
  return (
    <div className="bg-white rounded-3xl w-[70%] h-fit z-20 p-12 flex flex-col items-center justify-center shadow-lg text-gray-800"></div>
  );
}

export default EnterDetailsPage;
