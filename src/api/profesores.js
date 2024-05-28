import axios from 'axios';
//Axios para las peticiones HTTP
import { API } from './apiGlobal';
//URL DE PROFESORES
const API_URL = API + '/profesores';

//METODOS HTTP
export const getProfesores = () => axios.get(API_URL);

export const getProfesor = (id) => axios.get(`${API_URL}/${id}`);

export const createProfesor = (profesor) => axios.post(API_URL, profesor);

export const updateProfesor = (id, profesor) => axios.put(`${API_URL}/${id}`, profesor);

export const deleteProfesor = (id) => axios.delete(`${API_URL}/${id}`);
