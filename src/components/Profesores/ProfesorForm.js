import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProfesor, getProfesor, updateProfesor } from '../../api/profesores';
import { Alert, Button, Container, Snackbar, TextField, Typography } from '@mui/material';

//FORMULARIO PARA PROFESORES , CREACION Y EDICION
//ACA USÉ VALIDACIONES SENCILLAS
const ProfesorForm = () => {
    //HOOKS DEL PROFESOR
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');

    //MANEJO DE ERRORES
    const [errors, setErrors] = useState({});

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
        if (id) {
            fetchProfesor(id);
        }
    }, [id]);

    //SE EJECUTA EN CASO DE EDICION
    const fetchProfesor = async (id) => {
        const response = await getProfesor(id);
        const profesor = response.data;
        setNombre(profesor.nombre);
        setApellido(profesor.apellido);
        setEmail(profesor.email);
    };

    //FUNCION VALIDAR, SI HAY ERRORES CREA UN OBJETO CON ELLOS
    const validate = () => {
        let tempErrors = {};
        if (!nombre) tempErrors.nombre = "El nombre es requerido.";
        if (!apellido) tempErrors.apellido = "El apellido es requerido.";
        if (!email) tempErrors.email = "El email es requerido.";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    //FUNCION DE ENVIO
    const handleSubmit = async (e) => {
        e.preventDefault();
        const profesor = { nombre, apellido, email };
        //VERIFICA CAMPOS
        if (validate()) {
            try {
                //SE REVISA SI ES EDICION O CREACION
                //SE SETEA EL MENSAJE DE ALERTA
                if (id) {
                    await updateProfesor(id, profesor);
                    setSnackbarMessage('Profesor actualizado exitosamente');
                } else {
                    await createProfesor(profesor);
                    setSnackbarMessage('Profesor creado exitosamente');
                }
                setSnackbarSeverity('success');
                setOpenSnackbar(true);
                //TIMING PARA QUE PUEDA SALIR LA NOTIFICACION ANTES DE REDIRECCIONAR
                setTimeout(() => {
                    navigate('/profesores');
                }, 1000);
                //MANEJO DE ERRORES
            } catch (error) {
                setSnackbarMessage('Error al crear/actualizar el profesor');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            }
        }
    };
    //CERRAR SNACKBAR DE NOTIFICACIONES
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Container style={{ marginTop: '2rem', textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                Formulario de Profesor
            </Typography>
            {/* FORMULARIO */}
            <form onSubmit={handleSubmit}>
                <TextField label="Nombre" fullWidth style={{ marginBottom: '1rem' }} value={nombre} onChange={(e) => setNombre(e.target.value)} error={!!errors.nombre}
                    helperText={errors.nombre} />
                <TextField label="Apellido" fullWidth style={{ marginBottom: '1rem' }} value={apellido} onChange={(e) => setApellido(e.target.value)} error={!!errors.apellido}
                    helperText={errors.apellido} />
                <TextField label="Email" fullWidth style={{ marginBottom: '1rem' }} value={email} onChange={(e) => setEmail(e.target.value)} error={!!errors.email}
                    helperText={errors.email}
                />
                <Button type="submit" variant="contained" color="primary" style={{ marginBottom: '1rem' }}>{id ? 'Actualizar Profesor' : 'Agregar Profesor'} </Button>
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

export default ProfesorForm;
