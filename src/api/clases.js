import axios from 'axios';
//Axios para las peticiones HTTP
import { API } from './apiGlobal';

//URL DE CLASES
const API_URL = API+'/clases';

//METODOS HTTP
export const getClases = () => axios.get(API_URL);

export const getClase = (id) => axios.get(`${API_URL}/${id}`);

export const createClase = (clase) => axios.post(API_URL, clase);

export const updateClase = (id, clase) => axios.put(`${API_URL}/${id}`, clase);

export const deleteClase = (id) => axios.delete(`${API_URL}/${id}`);
