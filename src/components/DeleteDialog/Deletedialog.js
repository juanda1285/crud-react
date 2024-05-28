import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button
} from '@mui/material';

//COMPONENTE DEL DIALOGO DE BORRAR
const DeleteDialog = ({ open, onClose, onConfirm, title, description }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={onConfirm} color="secondary">
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
