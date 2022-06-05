import React, { useState } from "react";
import CardPersonComponent from "../components/CardPersonComponent";
import LoadingComponent from "../components/LoadingComponent";
import { getByDocumentNumber } from "../services/payroll.api";

const ShowPersonPage = () => {
  const [infoPerson, setInfoPerson] = useState();
  const [documentNumber, setDocumentNumber] = useState("");
  const [loadingData, LoadingData] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    LoadingData(true);
    const { rows } = await getByDocumentNumber(documentNumber);
    setInfoPerson(rows);
    LoadingData(false);
  };

  return (
    <div className="mt-10">
      <h1 className="font-bold text-3xl">Buscador</h1>
      <p className="text-lime-600/80 italic text-sm">
        Busca un trabajador aquí
      </p>
      {loadingData ? (
        <>
          <LoadingComponent text="Buscando" />
        </>
      ) : (
        <>
          <div className="mt-5 flex justify-center py-5 ">
            <form
              className="bg-white p-5 rounded-xl shadow-md"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                placeholder="CI: 12345678"
                className="py-2 rounded-3xl border-2 px-4 placeholder:text-neutral-300 bg-neutral-100 focus:bg-white"
                onChange={(e) => setDocumentNumber(e.target.value)}
              />
              <button className="bg-green-600 rounded-3xl px-4 py-2 ml-5 text-white hover:bg-green-700">
                Buscar
              </button>
            </form>
          </div>
          {infoPerson && (
            <CardPersonComponent
              fullName={infoPerson.Nom_titular}
              documentNumber={infoPerson.cedula}
              birthDate={infoPerson.fecha_nacimiento}
              age={infoPerson.edad}
              municipality={infoPerson.municipio.descripcion}
              region={infoPerson.region.descripcion}
              typePayroll={infoPerson.tipo_nomina.descripcion}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ShowPersonPage;
