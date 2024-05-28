
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createClase, getClase, updateClase } from '../../api/clases';
import { Alert, Button, Checkbox, Container, FormControl, InputLabel, ListItemText, MenuItem, Select, Snackbar, TextField, Typography } from '@mui/material';
import { getProfesores } from '../../api/profesores';
import { getEstudiantes } from '../../api/estudiantes';

//FORMULARIO PARA CLASES , CREACION Y EDICION
//ACA USÉ VALIDACIONES DE MATERIAL UI
const ClaseForm = () => {
    //CAMPOS DEL FORMULARIO
    const [formValues, setFormValues] = useState({
        nombre: '',
        descripcion: '',
        profesorId: '',
        estudiantesIds: [],
    });
    const [profesores, setProfesores] = useState([]);
    const [estudiantes, setEstudiantes] = useState([]);
    const [selectedEstudiantes, setSelectedEstudiantes] = useState([]);

    //MANEJO DE NOTIFICACIONES
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    //NAVIGATE PARA CAMBIAR DE PAGINA
    const navigate = useNavigate();
    //RECIBIR ID EN CASO DE EDICIÓN
    const { id } = useParams();

    //CARGAR TODA LA INFORMACIÓN AL ABRIR LA PAGINA
    useEffect(() => {
        getProfesores()
            .then(response => setProfesores(response.data))
            .catch(error => console.error('Error fetching profesores:', error));

        getEstudiantes()
            .then(response => setEstudiantes(response.data))
            .catch(error => console.error('Error fetching estudiantes:', error));

        if (id) {
            fetchClase(id);
        }
    }, [id]);

    //FUNCION PARA POBLAR EL FORMULARIO EN CASO DE EDICIÓN
    const fetchClase = async (id) => {
        const response = await getClase(id);
        const clase = response.data;
        if (clase) {
            setFormValues({
                nombre: clase.nombre,
                descripcion: clase.descripcion,
                profesorId: clase.profesorId || '',
                estudiantesIds: clase.estudiantesIds || [],
            });
            //HOOK PARA MANEJAR SOLO LOS IDs PARA HACER EL SELECT FUNCIONAL
            setSelectedEstudiantes(clase.estudiantes.map((estudiante) => estudiante.id));
        };
    };

    //FUNCION DE ENVIO
    const handleSubmit = async (e) => {
        e.preventDefault();
        const clase = formValues;
        //SE AGREGAN LOS IDs DEL HOOK DEL SELECT AL OBJETO CLASE
        clase.estudiantesIds = selectedEstudiantes
        try {
            //SE REVISA SI ES EDICION O CREACION
            //SE SETEA EL MENSAJE DE ALERTA
            if (id) {
                await updateClase(id, clase);
                setSnackbarMessage('Clase actualizada exitosamente');
            } else {
                await createClase(clase);
                setSnackbarMessage('Clase creada exitosamente');
            }
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            //TIMING PARA QUE PUEDA SALIR LA NOTIFICACION ANTES DE REDIRECCIONAR
            setTimeout(() => {
                navigate('/clases');
            }, 1000);

            //MANEJO DE ERRORES
        } catch (error) {
            setSnackbarMessage('Error al crear/actualizar la clase');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    //ACTUALIZACION DE DATOS DEL FORMULARIO
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    //FUNCIONALIDAD DEL CHECBOX DE ESTUDIANTES
    const handleCheckboxChange = (estudianteId) => {
        setSelectedEstudiantes((prevSelectedEstudiantes) => {
            if (prevSelectedEstudiantes.includes(estudianteId)) {
                return prevSelectedEstudiantes.filter(id => id !== estudianteId);
            } else {
                return [...prevSelectedEstudiantes, estudianteId];
            }
        });
    };

    //CERRAR SNACKBAR DE NOTIFICACIONES
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Container style={{ marginTop: '2rem', textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                Formulario de Clase
            </Typography>
            {/* FORMULARIO */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <TextField
                    label="Nombre de la Clase"
                    name="nombre"
                    value={formValues.nombre}
                    onChange={handleChange}
                    required
                    style={{ marginBottom: '1rem' }}
                />
                <TextField
                    label="Descripción"
                    name="descripcion"
                    value={formValues.descripcion}
                    onChange={handleChange}
                    required
                    style={{ marginBottom: '1rem' }}
                />
                <FormControl style={{ marginBottom: '1rem', minWidth: 200 }}>
                    <InputLabel>Profesor</InputLabel>
                    <Select
                        required
                        name="profesorId"
                        value={formValues.profesorId}
                        onChange={handleChange}
                    >
                        {profesores.map(profesor => (
                            <MenuItem key={profesor.id} value={profesor.id}>
                                {profesor.nombre} {profesor.apellido}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl style={{ marginBottom: '1rem', minWidth: 200 }}>
                    <InputLabel>Estudiantes</InputLabel>
                    {/* SELECT DE ESTUDIANTES CON MATERIAL IU */}
                    <Select
                        multiple
                        value={selectedEstudiantes}
                        renderValue={(selected) => selected.map(id => {
                            const estudiante = estudiantes.find(e => e.id === id);
                            return estudiante ? `${estudiante.nombre} ${estudiante.apellido}` : '';
                        }).join(', ')}
                    >
                        {estudiantes.map(estudiante => (
                            <MenuItem key={estudiante.id} value={estudiante.id}>
                                <Checkbox
                                    checked={selectedEstudiantes.includes(estudiante.id)}
                                    onChange={() => handleCheckboxChange(estudiante.id)}
                                />
                                <ListItemText primary={`${estudiante.nombre} ${estudiante.apellido}`} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button type="submit" variant="contained" color="primary" style={{ marginBottom: '1rem' }}>{id ? 'Actualizar Clase' : 'Agregar Clase'} </Button>
            </form>
            {/* NOTIFICAICONES */}
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ClaseForm;
