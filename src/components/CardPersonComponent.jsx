import React from "react";

const CardPersonComponent = ({
  fullName,
  documentNumber,
  birthDate,
  age,
  typePayroll,
  region,
  municipality,
}) => {
  return (
    <div className="flex justify-center">
      <div className="bg-white mt-5 p-5 rounded-xl shadow-md">
        <h1 className="font-bold text-2xl text-center my-2 ">{fullName}</h1>
        <div className="grid grid-cols-2 gap-4">
          <span className="text-lime-600 font-bold text-right">CI:</span>
          <span>{documentNumber}</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <span className="text-lime-600 font-bold text-right">
            Fecha de Nacimiento:
          </span>
          <span>{birthDate}</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <span className="text-lime-600 font-bold text-right">Edad:</span>
          <span>{age}</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <span className="text-lime-600 font-bold text-right">
            Tipo de nómina:
          </span>
          <span>{typePayroll}</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <span className="text-lime-600 font-bold text-right">Region:</span>
          <span>{region}</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <span className="text-lime-600 font-bold text-right">Municipio:</span>
          <span>{municipality}</span>
        </div>
      </div>
    </div>
  );
};

export default CardPersonComponent;
