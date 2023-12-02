import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const user = {
        username: username,
        password: password,
      };
      const { data } = await axios.post(
        "http://localhost:8000/token/",
        user,
        { headers: { "Content-Type": "application/json" } },
        { withCredentials: true }
      );
      localStorage.clear();
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("user_id", data.user_id);

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data["access"]}`;
      window.location.href = "/";
    } catch (error) {
      alert("Niepoprawne dane logowania.");
    }
  };

  return (
    <div className="bg-white rounded-3xl w-[40%] h-fit py-12 z-20 flex flex-col items-center justify-center gap-8 shadow-lg">
      <form
        onSubmit={submit}
        className="flex flex-col items-center gap-4 w-[50%]"
      >
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
          className="w-[170px] h-11 font-medium bg-sky-600 uppercase rounded-full border mt-4 border-gray-300 tracking-wider hover:border-sky-500 hover:border-2 shadow-lg text-white"
        >
          Zaloguj się
        </button>
        <button
          onClick={() => {
            navigate("/register");
          }}
          className="w-[210px] h-11 font-medium bg-sky-600 uppercase rounded-full border border-gray-300 tracking-wider hover:border-sky-500 hover:border-2 shadow-lg text-white"
        >
          Zarejestruj się
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
