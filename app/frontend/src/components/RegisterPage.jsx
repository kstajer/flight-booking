import React from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  let registerUser = (e) => {
    e.preventDefault();
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
        onSubmit={registerUser}
        className="flex flex-col items-center gap-4 w-[50%]"
      >
        <input
          required
          type="email"
          name="email"
          placeholder="E-mail"
          className="w-full border border-gray-300 px-2 h-[40px] rounded-md text-gray-800"
        />
        <input
          required
          type="text"
          name="name"
          placeholder="Imię"
          className="w-full border border-gray-300 px-2 h-[40px] rounded-md text-gray-800"
        />
        <input
          required
          type="text"
          name="lastname"
          placeholder="Nazwisko"
          className="w-full border border-gray-300 px-2 h-[40px] rounded-md text-gray-800"
        />
        <input
          required
          type="text"
          name="username"
          placeholder="Nazwa użytkownika"
          className="w-full border border-gray-300 px-2 h-[40px] rounded-md text-gray-800"
        />
        <input
          required
          type="password"
          name="password"
          placeholder="Hasło"
          className="w-full border border-gray-300 px-2 h-[40px] rounded-md text-gray-800"
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
