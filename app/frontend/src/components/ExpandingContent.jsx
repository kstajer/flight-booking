import React, { useState } from "react";
import { IoChevronDown } from "react-icons/io5";

function ExpandingContent({ id, open, onToggle, formData, onFormDataChange }) {
  const [localFormData, setLocalFormData] = useState({
    name: "",
    surname: "",
    documentNumber: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    onFormDataChange({ ...localFormData, [name]: value });
  };

  return (
    <div className="w-full">
      <div
        onClick={onToggle}
        className="w-full h-10 rounded flex items-center justify-between px-4"
      >
        <span>Pasażer {id + 1}</span>
        <IoChevronDown className={` ${open ? "rotate-180" : ""}`} />
      </div>
      <hr></hr>
      {open && (
        <>
          <form className="flex flex-col px-4 gap-4 mt-4">
            <div className="flex flex-col">
              <label htmlFor={`name${id}`} className="text-gray-700">
                Imię
              </label>
              <input
                id={`name${id}`}
                name="name"
                value={localFormData.name}
                onChange={(e) => {
                  handleInputChange(e);
                  onFormDataChange({ name: e.target.value });
                }}
                required
                className="w-[300px] border border-gray-300 px-2 h-[40px] rounded-md text-gray-800"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor={`surname${id}`} className="text-gray-700">
                Nazwisko
              </label>
              <input
                id={`surname${id}`}
                name="surname"
                value={localFormData.surname}
                onChange={(e) => {
                  handleInputChange(e);
                  onFormDataChange({ surname: e.target.value });
                }}
                required
                className="w-[300px] border border-gray-300 px-2 h-[40px] rounded-md text-gray-800"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor={`documentNumber${id}`} className="text-gray-700">
                Numer dokumentu
              </label>
              <input
                id={`documentNumber${id}`}
                name="documentNumber"
                value={localFormData.documentNumber}
                onChange={(e) => {
                  handleInputChange(e);
                  onFormDataChange({ documentNumber: e.target.value });
                }}
                required
                className="w-[300px] border border-gray-300 px-2 h-[40px] rounded-md text-gray-800"
              />
            </div>
          </form>
          <hr className="mt-4"></hr>
        </>
      )}
    </div>
  );
}

export default ExpandingContent;
