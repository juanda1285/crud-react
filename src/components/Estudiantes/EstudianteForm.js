import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createEstudiante, getEstudiante, updateEstudiante } from '../../api/estudiantes';
import { Alert, Button, Container, Snackbar, TextField, Typography } from '@mui/material';

//FORMULARIO PARA ESTUDIANTES , CREACION Y EDICION
//ACA USÉ VALIDACIONES SENCILLAS
const EstudianteForm = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  //MANEJO DE ERRORES
  const [errors, setErrors] = useState({});

  //MANEJO DE NOTIFICACIONES
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const navigate = useNavigate();
  const { id } = useParams();

  //CARGAR TODA LA INFORMACIÓN EN CASO DE EDICIÓN AL INICIAR
  useEffect(() => {
    if (id) {
      fetchEstudiante(id);
    }
  }, [id]);

  //FUNCION PARA CARGAR ESTUDIANTE
  const fetchEstudiante = async (id) => {
    const response = await getEstudiante(id);
    const estudiante = response.data;
    setNombre(estudiante.nombre);
    setApellido(estudiante.apellido);
    setEmail(estudiante.email);
  };

  //VALIDACION DE CAMPOS
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
    //CONSTRUCCION DEL OBJETO (SE PUDO HABER CREADO UN SOLO HOOK PARA ESTO)
    const estudiante = { nombre, apellido, email };
    //SE VALIDA
    if (validate()) {
      try {
        if (id) {
          await updateEstudiante(id, estudiante);
          setSnackbarMessage('Estudiante actualizado exitosamente');
        } else {
          await createEstudiante(estudiante);
          setSnackbarMessage('Estudiante creado exitosamente');
        }
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        //TIMING PARA QUE PUEDA SALIR LA NOTIFICACION ANTES DE REDIRECCIONAR
        setTimeout(() => {
          navigate('/estudiantes');
        }, 1000);
        //MANEJO DE ERRORES
      } catch (error) {
        setSnackbarMessage('Error al crear/actualizar el estudiante');
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      }

    }
  };

  //CERRAR STACKBAR
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container style={{ marginTop: '2rem', textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Formulario de Estudiante
      </Typography>
      {/* FORMULARIO */}
      <form onSubmit={handleSubmit}>
        <TextField label="Nombre" fullWidth style={{ marginBottom: '1rem' }} value={nombre} onChange={(e) => setNombre(e.target.value)} error={!!errors.nombre}
          helperText={errors.nombre} />
        <TextField label="Apellido" fullWidth style={{ marginBottom: '1rem' }} value={apellido} onChange={(e) => setApellido(e.target.value)} error={!!errors.apellido}
          helperText={errors.apellido} />
        <TextField label="Email" fullWidth style={{ marginBottom: '1rem' }} value={email} onChange={(e) => setEmail(e.target.value)} error={!!errors.email}
          helperText={errors.email} />

        <Button type="submit" variant="contained" color="primary" style={{ marginBottom: '1rem' }}>{id ? 'Actualizar Estudiante' : 'Agregar Estudiante'} </Button>
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

export default EstudianteForm;
