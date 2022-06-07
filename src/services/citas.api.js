const API_URL = import.meta.env.VITE_API_URL;
const baseUrl = `${API_URL}/citas`;

export const getAll = async () => {
  return fetch(`${baseUrl}`, {
    method: "GET",
  })
    .then((res) => res.json())
    .catch((error) => new Error(error.message));
};