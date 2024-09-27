import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import { Card, CardContent } from "@material-ui/core";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  header: {
    backgroundColor: "#2e7d32", // Color verde oscuro
    color: "#ffffff", // Color de texto blanco para contraste
  },
  createButton: {
    backgroundColor: "#2e7d32", // Color verde
    color: "#ffffff", // Color de texto blanco
    marginTop: 16, // Margen superior para separación
  },
  card: {
    marginTop: 16,
    padding: 16,
  },
  image: {
    width: "100%",
  },
});

export default function IncidenciaTable() {
  const classes = useStyles();
  const [incidencias, setIncidencias] = useState([]);
  const [open, setOpen] = useState(false);
  const [fotografias, setFotografias] = useState([]);
  const [openFotografias, setOpenFotografias] = useState(false);
  const [newIncidencia, setNewIncidencia] = useState({
    idTipoIncidencia: "",
    comentario: "",
    fecha: new Date().toISOString().slice(0, 10), // Fecha actual
    usuarioId: "",
  });

  useEffect(() => {
    const fetchIncidencias = async () => {
      try {
        const response = await axios.get("http://localhost:8000/incidencias/");
        setIncidencias(response.data);
      } catch (error) {
        console.error("Error fetching incidencias:", error);
      }
    };

    fetchIncidencias();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewIncidencia({ ...newIncidencia, [name]: value });
  };

  const handleCreate = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/incidencias/create",
        newIncidencia
      );

      setIncidencias([...incidencias, response.data]);
      handleClose();
      setNewIncidencia({
        idTipoIncidencia: "",
        comentario: "",
        fecha: new Date().toISOString().slice(0, 10),
        usuarioId: "",
      });
    } catch (error) {
      console.error("Error creating incidencia:", error);
    }
  };

  const handleOpenFotografias = async (idIncidencia) => {
    if (!idIncidencia) return;
    try {
      const response = await axios.get(
        `http://localhost:8000/fotografiasincidencia/${idIncidencia}` // Cambia esta línea para incluir el ID de la incidencia
      );
      setFotografias(response.data);
      setOpenFotografias(true);
    } catch (error) {
      console.error("Error fetching fotografias:", error);
      alert("Error al cargar las fotografías. Intenta nuevamente.");
    }
  };

  const handleCloseFotografias = () => {
    setOpenFotografias(false);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow className={classes.header}>
              <TableCell>ID Incidencia</TableCell>
              <TableCell>ID Tipo Incidencia</TableCell>
              <TableCell>Comentario</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>ID Usuario</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {incidencias.map((row) => (
              <TableRow key={row.idIncidencia}>
                <TableCell component="th" scope="row">
                  {row.idIncidencia}
                </TableCell>
                <TableCell>{row.idTipoIncidencia}</TableCell>
                <TableCell>{row.comentario}</TableCell>
                <TableCell>{new Date(row.fecha).toLocaleString()}</TableCell>
                <TableCell>{row.usuarioId}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleOpenFotografias(row.idIncidencia)}
                    color="primary"
                  >
                    Ver Fotografías
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button className={classes.createButton} onClick={handleClickOpen}>
        Crear Incidencia
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Crear Incidencia</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="idTipoIncidencia"
            label="ID Tipo Incidencia"
            type="text"
            fullWidth
            value={newIncidencia.idTipoIncidencia}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="comentario"
            label="Comentario"
            type="text"
            fullWidth
            value={newIncidencia.comentario}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="fecha"
            label="Fecha"
            type="date"
            fullWidth
            value={newIncidencia.fecha}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="usuarioId"
            label="ID Usuario"
            type="text"
            fullWidth
            value={newIncidencia.usuarioId}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleCreate} color="primary">
            Crear
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para mostrar fotografías */}
      <Dialog open={openFotografias} onClose={handleCloseFotografias}>
        <DialogTitle>Fotografías de Incidencia</DialogTitle>
        <DialogContent>
          <Card className={classes.card}>
            <CardContent>
              {fotografias.length > 0 ? (
                fotografias.map((foto) => (
                  <div key={foto.id}>
                    <img
                      src={`data:image/png;base64,${foto.foto}`} // Asegúrate de que 'foto' sea la cadena base64
                      alt={`Fotografía ${foto.id}`}
                      className={classes.image}
                    />
                  </div>
                ))
              ) : (
                <p>No se encontraron fotografías.</p>
              )}
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFotografias} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
