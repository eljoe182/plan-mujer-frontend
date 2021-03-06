import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import LoadingComponent from "../components/LoadingComponent";
import ModalComponent from "../components/ModalComponent";
import TableComponent from "../components/TableComponent";
import { useMenu } from "../hooks/useMenu";
import {
  edit,
  getByDocumentNumber,
  getByFullName,
  update,
} from "../services/payroll.api";

const FILTER_INITIAL = {
  page: 1,
  size: 10,
};

const ShowPersonPage = () => {
  const { setMenuActive } = useMenu();
  const [query, setQuery] = useState("");
  const [loadingData, setLoadingData] = useState(false);
  const [filter, setFilter] = useState(FILTER_INITIAL);
  const [showModal, setShowModal] = useState(false);
  const [optionInput, setOptionInput] = useState(1);
  const regionRef = useRef();
  const municipalityRef = useRef();
  const formRef = useRef();

  const [infoPage, setInfoPage] = useState(1);
  const [infoSize, setInfoSize] = useState(10);
  const [infoRowsCount, setInfoRowsCount] = useState(0);
  const [data, setData] = useState([]);

  const [dataModal, setDataModal] = useState({});
  const [resourcesData, setResourcesData] = useState({});
  const [region, setRegion] = useState("-");
  const [municipality, setMunicipality] = useState("");

  useEffect(() => {
    setMenuActive("show");
  }, []);

  const fetchData = async () => {
    if (query === "") return;
    setLoadingData(true);

    let result;

    if (optionInput === 1) {
      if (Number.isNaN(Number(query))) {
        toast.error("Se espera un numero de cedula");
        setLoadingData(false);
        return;
      }
      result = await getByDocumentNumber(query);
    } else {
      result = await getByFullName({
        query,
        page: infoPage ?? 1,
        size: infoSize ?? 10,
      });
    }
    const { size, page, rows, rowsCount } = result;
    setInfoSize(size);
    setInfoPage(page);
    setInfoRowsCount(rowsCount);
    setLoadingData(false);
    if (rows.length === 0) {
      setData([]);
      toast.error("No se encontraron resultados");
      return;
    }
    setData(rows);
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
    formRef.current.reset();
  };

  const onEdit = async (id) => {
    const { payroll, municipality, region } = await edit(id);

    const municipalityFiltered = municipality.filter(
      (item) => item.region.id === payroll.region.id
    );

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
      municipalityFiltered,
      municipality: municipality.sort((a, b) =>
        a.descripcion.localeCompare(b.descripcion)
      ),
      region: region.sort((a, b) => a.descripcion.localeCompare(b.descripcion)),
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

  const handleChangeRegion = (e) => {
    const { options, selectedIndex } = e.target;
    const regionFiltered = resourcesData.region.find(
      (item) => item.id === Number(options[selectedIndex].value)
    );

    const municipalityFiltered = resourcesData.municipality
      .filter((item) => item.region.id === regionFiltered.id)
      .sort((a, b) => a.descripcion.localeCompare(b.descripcion));

    setRegion(regionFiltered);
    setResourcesData({
      ...resourcesData,
      municipalityFiltered,
    });
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

  const onChangeOptionSearch = (e) => {
    setOptionInput(Number(e.target.value));
  };

  return (
    <div className="mt-10">
      <h1 className="font-bold text-3xl">Buscador</h1>
      <p className="text-lime-600/80 italic text-sm">
        Busca un trabajador aqu??
      </p>
      <div className="mt-5 flex justify-center py-5 ">
        <form
          className="bg-white p-5 rounded-xl shadow-md"
          onSubmit={handleSubmit}
          ref={formRef}
        >
          <div>
            <span>Buscar por: </span>
            <div className="flex gap-2">
              <label htmlFor="option1">
                Cedula:{" "}
                <input
                  type="radio"
                  name="optionSearch"
                  id="option1"
                  value={1}
                  onChange={onChangeOptionSearch}
                  checked={optionInput === 1}
                  required={true}
                />
              </label>
              <label htmlFor="option2">
                Nombre:{" "}
                <input
                  type="radio"
                  name="optionSearch"
                  id="option2"
                  value={2}
                  onChange={onChangeOptionSearch}
                  required={true}
                />
              </label>
            </div>
          </div>
          <div className="mt-2">
            <input
              type="text"
              placeholder={
                optionInput === 1 ? "Ej. 12345678" : "Ej. Juan Perez"
              }
              className="py-2 rounded-3xl border-2 px-4 placeholder:text-neutral-300 bg-neutral-100 focus:bg-white"
              onChange={(e) => setQuery(e.target.value)}
              required={true}
            />
            <button className="bg-green-600 rounded-3xl px-4 py-2 ml-5 text-white hover:bg-green-700">
              Buscar
            </button>
          </div>
        </form>
      </div>
      {loadingData ? (
        <>
          <LoadingComponent text="Buscando" />
        </>
      ) : (
        <>
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
                Tipo de n??mina:
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
                ref={regionRef}
              >
                <option value="">Seleccione una opci??n</option>
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
                ref={municipalityRef}
              >
                <option value="">Seleccione una opci??n</option>
                {resourcesData.municipalityFiltered &&
                  resourcesData.municipalityFiltered.map((item) => (
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
              Guardar
            </button>
          </div>
        </form>
      </ModalComponent>
    </div>
  );
};

export default ShowPersonPage;
