import axios from 'axios';
//Axios para las peticiones HTTP
import { API } from './apiGlobal';
//URL DE ESTUDIANTES
const API_URL = API + '/estudiantes';

//METODOS HTTP
export const getEstudiantes = () => axios.get(API_URL);

export const getEstudiante = (id) => axios.get(`${API_URL}/${id}`);

export const createEstudiante = (estudiante) => axios.post(API_URL, estudiante);

export const updateEstudiante = (id, estudiante) => axios.put(`${API_URL}/${id}`, estudiante);

export const deleteEstudiante = (id) => axios.delete(`${API_URL}/${id}`);
