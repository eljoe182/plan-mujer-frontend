import React, { useEffect, useState } from "react";
import LoadingComponent from "../components/LoadingComponent";
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

const FILTER_INITIAL = {
  page: 1,
  size: 10,
};

const HomePage = () => {
  const [payrollData, setPayrollData] = useState([]);
  const [filter, setFilter] = useState(FILTER_INITIAL);
  const [infoPage, setInfoPage] = useState(1);
  const [infoSize, setInfoSize] = useState(10);
  const [infoRowsCount, setInfoRowsCount] = useState(0);
  const [loadingData, setLoadingData] = useState(true);

  const fetchData = async () => {
    setLoadingData(true);
    const { size, page, rows, rowsCount } = await getAll({
      page: infoPage,
      size: infoSize,
    });
    setInfoSize(size);
    setInfoPage(page);
    setPayrollData(rows);
    setInfoRowsCount(rowsCount);
    setLoadingData(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pagesCount = Math.ceil(infoRowsCount / infoSize);

  const onNext = () => {
    setInfoPage(Number(infoPage) + 1);
    setFilter({
      ...filter,
      page: Number(filter.page) + 1,
    });
  };

  const onPrevious = () => {
    setInfoPage(Number(infoPage) - 1);
    setFilter({
      ...filter,
      page: Number(filter.page) - 1,
    });
  };

  const onSize = (e) => {
    setInfoSize(Number(e.target.value));
    setFilter({
      ...filter,
      size: Number(e.target.value),
      page: 1,
    });
  };

  useEffect(() => {
    const getDataFilter = async () => {
      await fetchData();
    };
    getDataFilter();
  }, [filter]);

  return (
    <div className="mt-10">
      <h1 className="font-bold text-3xl">Listado Principal</h1>
      <div className="mt-10 bg-white p-5 rounded-xl shadow-md">
        <table className="table-auto w-full">
          <thead>
            <tr className="text-white">
              <th className="bg-green-500 rounded-tl-xl py-2">Cedula</th>
              <th className="bg-green-500 py-2">Nombre Titular</th>
              <th className="bg-green-500 py-2">Fecha Nac</th>
              <th className="bg-green-500 py-2">Tip. Nomina</th>
              <th className="bg-green-500 py-2">Municipio</th>
              <th className="bg-green-500 py-2">Region</th>
              <th className="bg-green-500 py-2 rounded-tr-xl">Edad</th>
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
                {payrollData &&
                  payrollData.map((payroll, index) => (
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
                      <td className="py-1  text-center">
                        {payroll.edad}
                      </td>
                    </tr>
                  ))}
              </>
            )}
          </tbody>
        </table>
        <div className="flex flex-row justify-between py-2 px-10 items-center">
          <div className="font-bold text-green-600 text-center">
            Rows:{" "}
            <span className="font-normal text-black">{infoRowsCount}</span>
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
    </div>
  );
};

export default HomePage;
