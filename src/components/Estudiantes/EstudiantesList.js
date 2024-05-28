import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEstudiantes, deleteEstudiante } from '../../api/estudiantes';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, Alert, Snackbar } from '@mui/material';
import DeleteDialog from '../DeleteDialog/Deletedialog';

const EstudiantesList = () => {
  //HOOKS PARA ALMACENAR ESTUDIANTES
  const [estudiantes, setEstudiantes] = useState([]);
  //MANEJO ALERTAS O NOTIFICACIONES
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  //ESTADO DEL DIALOGO DEL DELETE
  const [openDialog, setOpenDialog] = useState(false);

  //ID DEL ESTUDIANTE PARA ELIMINAR
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  //FUNCION INICIAL
  useEffect(() => {
    fetchEstudiantes();
  }, []);

  //TRAER ESTUDIANTES
  const fetchEstudiantes = async () => {
    const response = await getEstudiantes();
    setEstudiantes(response.data);
  };

  //ELIMINAR ESTUDIANTE
  const handleDelete = async () => {
    if (selectedStudentId !== null) {
      //VERIFICA QUE SE HAYA SELECCIONADO EL ESTUDIANTE
      try {
        //ELIMINA Y GENERA ALERTAS
        await deleteEstudiante(selectedStudentId)
        setSnackbarMessage('Estudiante eliminado exitosamente');
        setSnackbarSeverity('success');
        fetchEstudiantes();
        //MANEJO DE ERRORES Y ALERTA
      } catch (error) {
        setSnackbarMessage('Error al eliminar el estudiante');
        setSnackbarSeverity('error');
      } finally {
        setOpenSnackbar(true);
        setOpenDialog(false);
      }
    }
    //RECARGA ESTUDIANTES
    fetchEstudiantes();
  };

  //ABIR DIALOGO DEL DELETE
  const handleOpenDialog = (id) => {
    setSelectedStudentId(id);
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
        Lista de Estudiantes
      </Typography>
      <Button variant="contained" color="primary" component={Link} to="/estudiantes/nuevo">
        Agregar Estudiante
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
            {estudiantes.map(estudiante => (
              <TableRow key={estudiante.id}>
                <TableCell>{estudiante.nombre}</TableCell>
                <TableCell>{estudiante.apellido}</TableCell>
                {/* BOTONES ACCIONES */}
                <TableCell align="center">
                  <Button component={Link} to={`/estudiantes/${estudiante.id}`} variant="contained" color="primary" style={{ marginRight: '1rem' }}>
                    Editar
                  </Button>
                  <Button onClick={() => handleOpenDialog(estudiante.id)} variant="contained" color="secondary">
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
       {/* VALIDACION ESTUDIANTES */}
       {estudiantes.length === 0 && (
        <Typography variant="body1" style={{ marginTop: 20 }}>
          No hay estudiantes registrados.
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
        description="¿Estás seguro de que deseas eliminar este estudiante? Esta acción no se puede deshacer."
      />
    </Container>
  );
};

export default EstudiantesList;
