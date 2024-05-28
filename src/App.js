import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import EstudiantesList from './components/Estudiantes/EstudiantesList';
import EstudianteForm from './components/Estudiantes/EstudianteForm';
import ProfesoresList from './components/Profesores/ProfesoresList';
import ProfesorForm from './components/Profesores/ProfesorForm';
import ClasesList from './components/Clases/ClasesList';
import ClaseForm from './components/Clases/ClaseForm';
import { AppBar, Toolbar, Button, Container, Grid } from '@mui/material';

const App = () => {
  return (
    <Router>
      <div>
      {/* Appbar - BARRA DE NAVEGACION EN APP PARA QUE SEA PERSISTENTE */}
        <AppBar position="static">
          <Toolbar>
            <Container>
              <Grid container justifyContent="center">
                <Grid item>
                  <Button color="inherit" component={Link} to="/estudiantes">Estudiantes</Button>
                </Grid>
                <Grid item>
                  <Button color="inherit" component={Link} to="/profesores">Profesores</Button>
                </Grid>
                <Grid item>
                  <Button color="inherit" component={Link} to="/clases">Clases</Button>
                </Grid>
              </Grid>
            </Container>
          </Toolbar>
        </AppBar>
        {/* Routes- RUTAS DEL APLICATIVO  */}
        <Routes>
          <Route path="/" element={<EstudiantesList />} />
          <Route path="/estudiantes" element={<EstudiantesList />} />
          <Route path="/estudiantes/nuevo" element={<EstudianteForm />} />
          <Route path="/estudiantes/:id" element={<EstudianteForm />} />
          <Route path="/profesores" element={<ProfesoresList />} />
          <Route path="/profesores/nuevo" element={<ProfesorForm />} />
          <Route path="/profesores/:id" element={<ProfesorForm />} />
          <Route path="/clases" element={<ClasesList />} />
          <Route path="/clases/nuevo" element={<ClaseForm />} />
          <Route path="/clases/:id" element={<ClaseForm />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
