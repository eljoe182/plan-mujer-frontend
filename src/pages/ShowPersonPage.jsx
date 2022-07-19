import { useState, useEffect, useRef } from "react";
import LoadingComponent from "../components/LoadingComponent";
import ModalComponent from "../components/ModalComponent";
import TableComponent from "../components/TableComponent";
import { edit, getByFullName, update } from "../services/payroll.api";

const FILTER_INITIAL = {
  page: 1,
  size: 10,
};

const ShowPersonPage = () => {
  const [query, setQuery] = useState("");
  const [loadingData, setLoadingData] = useState(false);
  const [filter, setFilter] = useState(FILTER_INITIAL);
  const [showModal, setShowModal] = useState(false);

  const [infoPage, setInfoPage] = useState(1);
  const [infoSize, setInfoSize] = useState(10);
  const [infoRowsCount, setInfoRowsCount] = useState(0);
  const [data, setData] = useState([]);

  const [dataModal, setDataModal] = useState({});
  const [resourcesData, setResourcesData] = useState({});
  const [region, setRegion] = useState("-");
  const [municipality, setMunicipality] = useState("");

  const fetchData = async () => {
    if (query === "") return;
    setLoadingData(true);
    const { size, page, rows, rowsCount } = await getByFullName({
      query,
      page: infoPage ?? 1,
      size: infoSize ?? 10,
    });
    setInfoSize(size);
    setInfoPage(page);
    setData(rows);
    setInfoRowsCount(rowsCount);
    setLoadingData(false);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetchData();
  };

  const onEdit = async (id) => {
    const { payroll, municipality } = await edit(id);

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
    setDataModal({
      id: payroll.id,
      fullName: payroll.Nom_titular,
      documentNumber: payroll.cedula,
      birthDate: payroll.fecha_nacimiento,
      age: payroll.edad,
      typePayroll: payroll.tipo_nomina.descripcion,
      region: payroll.region.descripcion,
      municipality: payroll.municipio.descripcion,
    });
    setResourcesData({
      municipality: [],
      municipalityFiltered,
      region: regionFiltered.sort((a, b) =>
        a.descripcion.localeCompare(b.descripcion)
      ),
    });
    setShowModal(true);
  };

  const onClose = () => {
    setShowModal(false);
  };

  const handleOnSubmitEdit = async (e) => {
    e.preventDefault();
    const newData = {
      municipality: municipality.id,
      region: region.id,
    };
    const result = await update({
      id: dataModal.id,
      ...newData,
    });

    setDataModal({});
    setShowModal(false);
    if (result.rows[0] === 1) {
      setShowModal(false);
      await fetchData();
    }
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
                placeholder="Juan Perez"
                className="py-2 rounded-3xl border-2 px-4 placeholder:text-neutral-300 bg-neutral-100 focus:bg-white"
                onChange={(e) => setQuery(e.target.value)}
                required={true}
              />
              <button className="bg-green-600 rounded-3xl px-4 py-2 ml-5 text-white hover:bg-green-700">
                Buscar
              </button>
            </form>
          </div>
          {data?.length > 0 && (
            <TableComponent
              rows={data}
              infoPage={infoPage}
              infoSize={infoSize}
              infoRowsCount={infoRowsCount}
              loadingData={loadingData}
              onNext={onNext}
              onPrevious={onPrevious}
              onSize={onSize}
              onEdit={onEdit}
            />
          )}
        </>
      )}
      <ModalComponent
        title={dataModal?.fullName ?? ""}
        show={showModal}
        onClose={onClose}
      >
        <form onSubmit={handleOnSubmitEdit}>
          <div className="flex flex-col justify-center mt-5">
            <div className="grid grid-cols-2 gap-4">
              <span className="text-lime-600 font-bold text-right">CI:</span>
              <span>{dataModal?.documentNumber}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <span className="text-lime-600 font-bold text-right">
                Fecha de Nacimiento:
              </span>
              <span>{dataModal?.birthDate}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <span className="text-lime-600 font-bold text-right">Edad:</span>
              <span>{dataModal?.age}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <span className="text-lime-600 font-bold text-right">
                Tipo de nómina:
              </span>
              <span>{dataModal?.typePayroll}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <span className="text-lime-600 font-bold text-right">
                Region:
              </span>
              {/* <span>{dataModal?.region}</span> */}
              <select
                className="shadow border rounded-full w-full py-2 px-5"
                name="region"
                id="region"
                onChange={handleChangeRegion}
              >
                <option value="">Seleccione una opción</option>
                {resourcesData.region &&
                  resourcesData.region.map((item, index) => (
                    <option
                      key={index}
                      value={item.id}
                      selected={item.descripcion === dataModal?.region}
                    >
                      {item.descripcion}
                    </option>
                  ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <span className="text-lime-600 font-bold text-right">
                Municipio:
              </span>
              {/* <span>{dataModal?.municipality}</span> */}
              <select
                className="shadow border rounded-full w-full py-2 px-5"
                name="municipality"
                id="municipality"
                onChange={handleChangeMunicipality}
              >
                <option value="">Seleccione una opción</option>
                {resourcesData.municipality &&
                  resourcesData.municipality.map((item) => (
                    <option
                      key={item.id}
                      value={item.id}
                      selected={item.descripcion === dataModal?.municipality}
                    >
                      {item.descripcion}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="text-center mt-5">
            <button className="bg-green-600 rounded-3xl px-4 py-2 ml-5 text-white hover:bg-green-700">
              Editar
            </button>
          </div>
        </form>
      </ModalComponent>
    </div>
  );
};

export default ShowPersonPage;
