import React, { useState } from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import config from "../axios.config";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const user = {
        username: username,
        password: password,
        first_name: firstName,
        last_name: lastName,
        email: email,
      };
    
      const response = await axios({
        method: "post",
        baseURL: config.baseURL,
        url: "register/",
        data: user,
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: false,
      });
    
      navigate("/login");
    } catch (error) {
      alert("Taki użytkownik już istnieje.");
    }
  };

  return (
    <div className="bg-white relative rounded-3xl w-[40%] h-fit py-12 z-20 flex flex-col items-center justify-center gap-8 shadow-lg">
      <MdKeyboardBackspace
        className="absolute left-5 top-5 text-2xl cursor-pointer w-9 text-gray-400"
        onClick={() => {
          navigate("/login");
        }}
      />

      <form
        onSubmit={submit}
        className="flex flex-col items-center gap-4 w-[50%]"
      >
        <input
          required
          type="email"
          name="email"
          placeholder="E-mail"
          className="w-full border border-gray-300 px-2 h-[40px] rounded-md text-gray-800"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          required
          type="text"
          name="name"
          placeholder="Imię"
          className="w-full border border-gray-300 px-2 h-[40px] rounded-md text-gray-800"
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          required
          type="text"
          name="lastname"
          placeholder="Nazwisko"
          className="w-full border border-gray-300 px-2 h-[40px] rounded-md text-gray-800"
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          required
          type="text"
          name="username"
          placeholder="Nazwa użytkownika"
          className="w-full border border-gray-300 px-2 h-[40px] rounded-md text-gray-800"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          required
          type="password"
          name="password"
          placeholder="Hasło"
          className="w-full border border-gray-300 px-2 h-[40px] rounded-md text-gray-800"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-[210px] h-11 font-medium bg-sky-600 uppercase rounded-full border mt-4 border-gray-300 tracking-wider hover:border-sky-500 hover:border-2 shadow-lg text-white"
        >
          Zarejestruj się
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
