import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProfesores, deleteProfesor } from '../../api/profesores';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, Snackbar, Alert } from '@mui/material';
import DeleteDialog from '../DeleteDialog/Deletedialog';

const ProfesoresList = () => {
  //HOOKS PARA ALMACENAR PROFESORES
  const [profesores, setProfesores] = useState([]);
  //MANEJO ALERTAS O NOTIFICACIONES
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  //ESTADO DEL DIALOGO DEL DELETE
  const [openDialog, setOpenDialog] = useState(false);
  //ID DEL PROFESOR PARA ELIMINAR
  const [selectedProfessorId, setSelectedProfessorId] = useState(null);

  //FUNCION INICIAL
  useEffect(() => {
    fetchProfesores();
  }, []);

  //TRAER PROFESORES
  const fetchProfesores = async () => {
    const response = await getProfesores();
    setProfesores(response.data);
  };

  //ELIMINAR PROFESOR
  const handleDelete = async () => {

    //VERIFICA QUE SE HAYA SELECCIONADO EL PROFESOR
    if (selectedProfessorId !== null) {
      try {
        //ELIMINA Y GENERA ALERTAS
        await deleteProfesor(selectedProfessorId);
        setSnackbarMessage('Profesor eliminado exitosamente');
        setSnackbarSeverity('success');
        fetchProfesores();
        //MANEJO DE ERRORES Y ALERTA
      } catch (error) {
        setSnackbarMessage('Error al eliminar el profesor');
        setSnackbarSeverity('error');
      } finally {
        setOpenSnackbar(true);
        setOpenDialog(false);
      }
    }
    //RECARGA PROFESORES
    fetchProfesores();
  };

  //ABIR DIALOGO DEL DELETE
  const handleOpenDialog = (id) => {
    setSelectedProfessorId(id);
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

  return (
    <Container style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom align="center">
        Lista de Profesores
      </Typography>
      <Button variant="contained" color="primary" component={Link} to="/profesores/nuevo">
        Agregar Profesor
      </Button>
      {/* TABLA */}
      <TableContainer component={Paper} style={{ marginTop: '1rem' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {profesores.map(profesor => (
              <TableRow key={profesor.id}>
                <TableCell>{profesor.nombre}</TableCell>
                <TableCell>{profesor.apellido}</TableCell>
                {/* BOTONES ACCIONES */}
                <TableCell align="center">
                  <Button component={Link} to={`/profesores/${profesor.id}`} variant="contained" color="primary" style={{ marginRight: '1rem' }}>
                    Editar
                  </Button>
                  <Button onClick={() => handleOpenDialog(profesor.id)} variant="contained" color="secondary">
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
        {/* VALIDACION PROFESORES */}
        {profesores.length === 0 && (
        <Typography variant="body1" style={{ marginTop: 20 }}>
          No hay profesores registrados.
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
        description="¿Estás seguro de que deseas eliminar este profesor? Esta acción no se puede deshacer."
      />
    </Container>
  );
};

export default ProfesoresList;
