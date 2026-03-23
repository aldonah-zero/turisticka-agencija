import axios from "axios";

const BASE_URL = "https://turisticka-agencija-backend-70dd23.onrender.com";
const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// BESSER vraca { "aranzman": {...} } za getById, a niz za getAll
const unwrap = (data, key) => {
  if (Array.isArray(data)) return data;
  if (data && data[key]) return data[key];
  return data;
};

// Generic CRUD factory
const crud = (entity) => ({
  getAll: async (params) => {
    const res = await api.get(`/${entity}/`, { params });
    return { data: res.data };
  },
  getById: async (id) => {
    const res = await api.get(`/${entity}/${id}/`);
    return { data: unwrap(res.data, entity) };
  },
  create: async (data) => {
    const res = await api.post(`/${entity}/`, data);
    return { data: unwrap(res.data, entity) };
  },
  update: async (id, data) => {
    const res = await api.put(`/${entity}/${id}/`, data);
    return { data: unwrap(res.data, entity) };
  },
  delete: (id) => api.delete(`/${entity}/${id}/`),
  search: (params) => api.get(`/${entity}/search/`, { params }),
});

export const aranžmanAPI = crud("aranzman");
export const klijentAPI = crud("klijent");
export const rezervacijaAPI = crud("rezervacija");
export const hotelAPI = crud("hotel");
export const destinacijaAPI = crud("destinacija");
export const vodicAPI = crud("vodic");
export const racunAPI = crud("racun");

export default api;
