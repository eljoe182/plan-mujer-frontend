import React, { useEffect, useRef, useState } from "react";
import CardPersonComponent from "../components/CardPersonComponent";
import LoadingComponent from "../components/LoadingComponent";
import { getResources, store } from "../services/payroll.api";

const CreatePayrollPage = () => {
  const [resourcesData, setResourcesData] = useState({});
  const [fullName, setFullName] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [age, setAge] = useState("");
  const [typePayroll, setTypePayroll] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [region, setRegion] = useState("-");
  const [registered, setRegistered] = useState(false);
  const [dataRegistered, setDataRegistered] = useState({});
  const [loadingData, setLoadingData] = useState(false);
  const formRef = useRef();

  useEffect(() => {
    const getData = async () => {
      setLoadingData(true);
      const { municipality, typePayroll } = await getResources();

      const regionFiltered = [];

      const municipalityFiltered = municipality.map((item) => {
        const { region } = item;

        const result = regionFiltered.find(
          (reg) => reg.descripcion === region.descripcion
        );

        if (!result) {
          regionFiltered.push(region);
        }
        return item;
      });

      setResourcesData({
        municipality: [],
        municipalityFiltered,
        typePayroll,
        region: regionFiltered.sort((a, b) =>
          a.descripcion.localeCompare(b.descripcion)
        ),
      });
      setLoadingData(false);
    };
    getData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingData(true);
    const data = {
      fullName,
      documentNumber,
      birthDate,
      age,
      typePayroll,
      municipality,
      region,
    };

    const response = await store(data).then((res) => {
      setFullName("");
      setDocumentNumber("");
      setBirthDate("");
      setAge("");
      setTypePayroll("");
      setMunicipality("");
      setRegion("-");
      setResourcesData({
        ...resourcesData,
        municipality: [],
      });
      setRegistered(true);

      const typePayrollFiltered = resourcesData.typePayroll.find(
        (item) => item.id === res.typePayroll
      );

      const municipality = resourcesData.municipalityFiltered.find(
        (item) => item.id === res.municipalityId
      );

      return {
        ...res,
        typePayroll: typePayrollFiltered.descripcion,
        municipality: municipality.descripcion,
        region: municipality.region.descripcion,
      };
    });
    setDataRegistered(response);
    setLoadingData(false);
  };

  const handleChangeMunicipality = (e) => {
    const { options, selectedIndex } = e.target;
    const municipalityFiltered = resourcesData.municipality.find(
      (item) => item.id === Number(options[selectedIndex].value)
    );
    setMunicipality({
      id: municipalityFiltered?.id,
      description: municipalityFiltered?.descripcion,
    });
    setRegion({
      id: municipalityFiltered?.region.id,
      description: municipalityFiltered?.region.descripcion,
    });
  };

  const handleChangeTypePayroll = (e) => {
    const { options, selectedIndex } = e.target;
    const typePayrollFiltered = resourcesData.typePayroll.find(
      (item) => item.id === Number(options[selectedIndex].value)
    );
    setTypePayroll(typePayrollFiltered);
  };

  const handleChangeRegion = (e) => {
    const { options, selectedIndex } = e.target;
    const regionFiltered = resourcesData.region.find(
      (item) => item.id === Number(options[selectedIndex].value)
    );

    const municipalityFiltered = resourcesData.municipalityFiltered
      .filter((item) => item.region.id === regionFiltered.id)
      .sort((a, b) => a.descripcion.localeCompare(b.descripcion));

    setRegion(regionFiltered);
    setResourcesData({
      ...resourcesData,
      municipality: municipalityFiltered,
    });
  };

  const handleCreateNew = () => {
    setRegistered(false);
    setDataRegistered({});
  };

  return (
    <div className="mt-10">
      <h1 className="font-bold text-3xl">Registrar</h1>
      <p className="text-lime-600/80 italic text-sm">
        Regitra un trabajador aquí
      </p>

      {loadingData ? (
        <>
          <LoadingComponent />
        </>
      ) : (
        <>
          <div className="my-5 mx-auto w-96">
            {registered ? (
              <>
                <div>
                  <CardPersonComponent
                    fullName={dataRegistered?.fullName}
                    documentNumber={dataRegistered?.documentNumber}
                    birthDate={dataRegistered?.birthday}
                    age={dataRegistered?.age}
                    typePayroll={dataRegistered?.typePayroll}
                    region={dataRegistered?.region}
                    municipality={dataRegistered?.municipality}
                  />
                  <div className="mt-5 px-20">
                    <button
                      type="button"
                      className="bg-green-600 rounded-3xl px-4 py-2 w-full text-white hover:bg-green-700"
                      onClick={handleCreateNew}
                    >
                      Crear nuevo
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <form
                  ref={formRef}
                  className="bg-white shadow-md rounded-xl px-8 pt-6 pb-8 mb-4"
                  onSubmit={handleSubmit}
                >
                  <div className="mb-4">
                    <label
                      className="block text-lime-600 font-bold ml-5"
                      htmlFor="fullName"
                    >
                      Nombre completo
                    </label>
                    <input
                      className="shadow border rounded-full w-full py-2 px-5 placeholder:text-gray-200 bg-neutral-100 focus:bg-white"
                      id="fullName"
                      type="text"
                      placeholder="Juan Perez"
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-lime-600 font-bold ml-5"
                      htmlFor="documentNumber"
                    >
                      Cedula de identidad
                    </label>
                    <input
                      className="shadow border rounded-full w-full py-2 px-5 placeholder:text-gray-200 bg-neutral-100 focus:bg-white"
                      id="documentNumber"
                      type="number"
                      placeholder="CI: 12345678"
                      onChange={(e) => setDocumentNumber(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-lime-600 font-bold ml-5"
                      htmlFor="birthday"
                    >
                      Fecha de nacimiento
                    </label>
                    <input
                      className="shadow border rounded-full w-full py-2 px-5 placeholder:text-gray-200 bg-neutral-100 focus:bg-white"
                      id="birthday"
                      type="date"
                      onChange={(e) => setBirthDate(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-lime-600 font-bold ml-5"
                      htmlFor="age"
                    >
                      Edad
                    </label>
                    <input
                      className="shadow border rounded-full w-full py-2 px-5 placeholder:text-gray-200 bg-neutral-100 focus:bg-white"
                      id="age"
                      type="number"
                      placeholder="99"
                      onChange={(e) => setAge(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-lime-600 font-bold ml-5"
                      htmlFor="typePayroll"
                    >
                      Tipo de Nómina
                    </label>
                    <select
                      className="shadow border rounded-full w-full py-2 px-5"
                      name=""
                      id="typePayroll"
                      onChange={handleChangeTypePayroll}
                    >
                      <option value="">Seleccione una opción</option>
                      {resourcesData.typePayroll &&
                        resourcesData.typePayroll.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.descripcion}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-lime-600 font-bold ml-5"
                      htmlFor="region"
                    >
                      Región
                    </label>
                    <select
                      className="shadow border rounded-full w-full py-2 px-5"
                      name=""
                      id="region"
                      onChange={handleChangeRegion}
                    >
                      <option value="">Seleccione una opción</option>
                      {resourcesData.region &&
                        resourcesData.region.map((item, index) => (
                          <option key={index} value={item.id}>
                            {item.descripcion}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-lime-600 font-bold ml-5"
                      htmlFor="municipality"
                    >
                      Municipio
                    </label>
                    <select
                      className="shadow border rounded-full w-full py-2 px-5"
                      name=""
                      id="municipality"
                      onChange={handleChangeMunicipality}
                    >
                      <option value="">Seleccione una opción</option>
                      {resourcesData.municipality &&
                        resourcesData.municipality.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.descripcion}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="mt-8">
                    <button
                      type="submit"
                      className="bg-green-600 rounded-3xl px-4 py-2 w-full text-white hover:bg-green-700"
                    >
                      Guardar
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CreatePayrollPage;
