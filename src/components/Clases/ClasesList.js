// src/components/Clases/ClasesList.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getClases, deleteClase } from '../../api/clases';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, Alert, Snackbar, Modal, Box } from '@mui/material';
import DeleteDialog from '../DeleteDialog/Deletedialog';

const ClasesList = () => {
  //HOOKS PARA ALMACENAR CLASE(S)
  const [clases, setClases] = useState([]);
  const [selectedClase, setSelectedClase] = useState(null);

  //ESTADO DEL MODAL
  const [openModal, setOpenModal] = useState(false);

  const [estudiantes, setEstudiantes] = useState([]);

  //MANEJO ALERTAS O NOTIFICACIONES
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  //ESTADO DEL DIALOGO DEL DELETE
  const [openDialog, setOpenDialog] = useState(false);

  //CLASE SELECIONADA PARA EL DELETE
  const [selectedClassId, setSelectedClassId] = useState(null);

  //FUNCION INICIAL
  useEffect(() => {
    fetchClases();
  }, []);

  //RECIBE LAS CLASES Y LAS SETEA
  const fetchClases = async () => {
    const response = await getClases();
    setClases(response.data);
  };

  //ELIMINAR CLASE
  const handleDelete = async () => {
    //VERIFICA QUE SE HAYA SELECCIONADO LA CLASE
    if (selectedClassId !== null) {
      try {
        //ELIMINA Y GENERA ALERTAS
        await deleteClase(selectedClassId);
        setSnackbarMessage('Clase eliminada exitosamente');
        setSnackbarSeverity('success');
        fetchClases();
        //MANEJO DE ERRORES Y ALERTA
      } catch (error) {
        setSnackbarMessage('Error al eliminar la clase');
        setSnackbarSeverity('error');
      } finally {
        setOpenSnackbar(true);
        setOpenDialog(false);
      }
    }
    //RECARGA CLASES
    fetchClases();
  };

  //ABIR DIALOGO DEL DELETE
  const handleOpenDialog = (id) => {
    setSelectedClassId(id);
    setOpenDialog(true);
  };

  //CERRAR DIALOGO DEL DELETE
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  //CERRAR NOTIFICACIONES
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  //ABRIR MODAL DE ESTUDIANTES
  const handleOpenModal = async (clase) => {
    setSelectedClase(clase);
    setEstudiantes(clase.estudiantes);
    setOpenModal(true);
  };

  //CERRAR MODAL DE ESTUDIANTES
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedClase(null);
    //LIMPIA EL HOOK
    setEstudiantes([]);
  };

  return (
    <Container style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom align="center">
        Lista de Clases
      </Typography>
      <Button variant="contained" color="primary" component={Link} to="/clases/nuevo">
        Agregar Clase
      </Button>
      {/* TABLA */}
      <TableContainer component={Paper} style={{ marginTop: '1rem' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre de la Clase</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Profesor</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clases.map(clase => (
              <TableRow key={clase.id}>
                <TableCell>{clase.nombre}</TableCell>
                <TableCell>{clase.descripcion}</TableCell>
                <TableCell>{clase.profesor ? clase.profesor.nombre + ' ' + clase.profesor.apellido : 'Sin Asignar'}</TableCell>
                {/* BOTONES ACCIONES */}
                <TableCell align="center">
                  <Button disabled={!clase.estudiantes.length > 0} variant="contained" color="primary" onClick={() => handleOpenModal(clase)} style={{ marginRight: '1rem' }}>
                    Ver Estudiantes
                  </Button>
                  <Button component={Link} to={`/clases/${clase.id}`} variant="contained" color="primary" style={{ marginRight: '1rem' }}>
                    Editar
                  </Button>
                  <Button onClick={() => handleOpenDialog(clase.id)} variant="contained" color="secondary">
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
       {/* VALIDACION CLASES */}
      {clases.length === 0 && (
        <Typography variant="body1" style={{ marginTop: 20 }}>
          No hay clases creadas.
        </Typography>
      )}
      {/* ALERTAS NOTIFICAICONES */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      {/* COMPONENTE DIALOG IMPORTADO */}
      <DeleteDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleDelete}
        title="Confirmar Eliminación"
        description="¿Estás seguro de que deseas eliminar esta clase? Esta acción no se puede deshacer."
      />
      {/* MODAL CON LA LISTA DE ESTUDIANTES */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box style={{ padding: 20, backgroundColor: 'white', margin: '10% auto', maxWidth: 500 }}>
          <Typography variant="h6">Estudiantes de {selectedClase?.nombre}</Typography>
          <ul>
            {estudiantes.map((estudiante) => (
              <li key={estudiante.id}>{estudiante.nombre} {estudiante.apellido}</li>
            ))}
          </ul>
          <Button variant="contained" color="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Box>
      </Modal>
    </Container>

  );
};

export default ClasesList;
