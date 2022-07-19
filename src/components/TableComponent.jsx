import React, { useEffect, useState } from "react";
import LoadingComponent from "./LoadingComponent";
import { getAll } from "../services/payroll.api";

const chevronLeft = (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    className="stroke-white"
  >
    <path
      stroke="currentColor"
      d="M14.2,7.22l-4.11,4.11a1,1,0,0,0,0,1.41l4,4"
    />
  </svg>
);

const chevronRight = (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    className="stroke-white "
  >
    <path
      stroke="currentColor"
      d="M9.8,16.78l4.11-4.11a1,1,0,0,0,0-1.41l-4-4"
    />
  </svg>
);

const edit = (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    className="stroke-white "
  >
    <path
      stroke="currentColor"
      d="M16.74,4.55a1.63,1.63,0,0,0-2.29.07l-10,10v0l-.31,4.86a.33.33,0,0,0,.35.35l4.86-.31h0l10-10a1.63,1.63,0,0,0,.07-2.29Z"
    />
  </svg>
);

function TableComponent({
  rows = [],
  infoPage,
  infoSize,
  infoRowsCount,
  loadingData,
  onNext,
  onPrevious,
  onSize,
  onEdit,
}) {
  const pagesCount = Math.ceil(infoRowsCount / infoSize);

  return (
    <div className="mt-5 bg-white p-5 rounded-xl shadow-md">
      <table className="table-auto w-full">
        <thead>
          <tr className="text-black">
            <th className="bg-green-500 rounded-tl-xl py-2">Cedula</th>
            <th className="bg-green-500 py-2">Nombre Titular</th>
            <th className="bg-green-500 py-2">Fecha Nac</th>
            <th className="bg-green-500 py-2">Tip. Nomina</th>
            <th className="bg-green-500 py-2">Municipio</th>
            <th className="bg-green-500 py-2">Region</th>
            <th className="bg-green-500 py-2 rounded-tr-xl">Editar</th>
          </tr>
        </thead>
        <tbody>
          {loadingData ? (
            <>
              <tr>
                <td colSpan="6">
                  <LoadingComponent text="Cargando datos..." />
                </td>
              </tr>
            </>
          ) : (
            <>
              {rows &&
                rows.map((payroll, index) => (
                  <tr
                    key={payroll.id}
                    className={`hover:bg-gray-200 ${
                      index % 2 === 0 ? "bg-lime-50" : "bg-lime-100"
                    }`}
                  >
                    <td className="py-1 pl-4">{payroll.cedula}</td>
                    <td className="py-1 text-justify ">
                      {payroll.Nom_titular}
                    </td>
                    <td className="py-1 text-center">
                      {payroll.fecha_nacimiento}
                    </td>
                    <td className="py-1 pl-5">
                      {payroll.tipo_nomina.descripcion}
                    </td>
                    <td className="py-1 text-center">
                      {payroll.municipio.descripcion}
                    </td>
                    <td className="py-1  text-center">
                      {payroll.region.descripcion}
                    </td>
                    <td className="py-1 text-center">
                      <button onClick={() => onEdit(payroll.id)}>{edit}</button>
                    </td>
                  </tr>
                ))}
            </>
          )}
        </tbody>
      </table>
      <div className="flex flex-row justify-between py-2 px-10 items-center">
        <div className="font-bold text-green-600 text-center">
          Rows: <span className="font-normal text-black">{infoRowsCount}</span>
        </div>
        <div className="flex gap-5 items-center flex-1 justify-center ">
          <button
            className={`hover:bg-neutral-200 rounded-xl ${
              infoPage === 1
                ? "opacity-50 text-neutral-500 hover:bg-transparent"
                : ""
            }`}
            disabled={infoPage === 1}
            onClick={onPrevious}
          >
            {chevronLeft}
          </button>
          <div className="mt-1">
            {infoPage} / {pagesCount}
          </div>
          <button
            className={`hover:bg-neutral-200 rounded-xl ${
              infoPage === pagesCount
                ? "opacity-50 text-neutral-500 hover:bg-transparent"
                : ""
            }`}
            disabled={infoPage === pagesCount}
            onClick={onNext}
          >
            {chevronRight}
          </button>
        </div>
        <div className="flex flex-row gap-4 items-center justify-end">
          <div className="font-bold text-green-600 flex gap-4">
            Size:{" "}
            <select className="font-normal text-black" onChange={onSize}>
              <option value="10">10</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TableComponent;
