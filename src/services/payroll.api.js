const API_URL = import.meta.env.VITE_API_URL;
console.log(API_URL);

const baseUrl = `${API_URL}/payroll`;

export const getAll = async ({ page, size }) => {
  return fetch(`${baseUrl}?page=${page}&size=${size}`, {
    method: "GET",
  })
    .then((res) => res.json())
    .catch((error) => new Error(error.message));
};

export const getByDocumentNumber = async (documentNumber) => {
  return fetch(`${baseUrl}/show/${documentNumber}`, {
    method: "GET",
  })
    .then((res) => res.json())
    .catch((error) => new Error(error.message));
};

export const getResources = async () => {
  return fetch(`${baseUrl}/create`, {
    method: "GET",
  })
    .then((res) => res.json())
    .catch((error) => new Error(error.message));
};

export const store = async (payroll) => {
  return fetch(`${baseUrl}/store`, {
    method: "POST",
    body: JSON.stringify(payroll),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .catch((error) => new Error(error.message));
};
