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

export default function MantenimientoTable() {
  const classes = useStyles();
  const [mantenimientos, setMantenimientos] = useState([]);
  const [open, setOpen] = useState(false);
  const [fotografias, setFotografias] = useState([]);
  const [openFotografias, setOpenFotografias] = useState(false);
  const [newMantenimiento, setNewMantenimiento] = useState({
    idTipoMantenimiento: "",
    idUbicacion: "",
    comentario: "",
    fecha: new Date().toISOString().slice(0, 10), // Fecha actual
    usuarioId: "",
  });

  useEffect(() => {
    const fetchMantenimientos = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/mantenimiento/`
        );
        setMantenimientos(response.data);
      } catch (error) {
        console.error("Error fetching mantenimientos:", error);
      }
    };

    fetchMantenimientos();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewMantenimiento({ ...newMantenimiento, [name]: value });
  };

  const handleCreate = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/mantenimiento/create`,
        newMantenimiento
      );
      setMantenimientos([...mantenimientos, response.data]); // Añadir el nuevo mantenimiento al estado
      handleClose(); // Cerrar el modal
      setNewMantenimiento({
        idTipoMantenimiento: "",
        idUbicacion: "",
        comentario: "",
        fecha: new Date().toISOString().slice(0, 10),
        usuarioId: "",
      }); // Resetear el formulario
    } catch (error) {
      console.error("Error creating mantenimiento:", error);
    }
  };

  const handleOpenFotografias = async (idMantenimiento) => {
    if (!idMantenimiento) return;
    try {
      const response = await axios.get(
        `http://localhost:8000/fotografiasmantenimiento/${idMantenimiento}`
      );
      console.log(response.data); // Imprimir la respuesta
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
              <TableCell>ID Mantenimiento</TableCell>
              <TableCell>ID Tipo Mantenimiento</TableCell>
              <TableCell>ID Ubicación</TableCell>
              <TableCell>Comentario</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>ID Usuario</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mantenimientos.map((row) => (
              <TableRow key={row.idMantenimiento}>
                <TableCell component="th" scope="row">
                  {row.idMantenimiento}
                </TableCell>
                <TableCell>{row.idTipoMantenimiento}</TableCell>
                <TableCell>{row.idUbicacion}</TableCell>
                <TableCell>{row.comentario}</TableCell>
                <TableCell>{new Date(row.fecha).toLocaleString()}</TableCell>
                <TableCell>{row.usuarioId}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleOpenFotografias(row.idMantenimiento)}
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

      {/* Modal para crear un nuevo mantenimiento */}
      <Button className={classes.createButton} onClick={handleClickOpen}>
        Create
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create Mantenimiento</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="idTipoMantenimiento"
            label="ID Tipo Mantenimiento"
            type="text"
            fullWidth
            value={newMantenimiento.idTipoMantenimiento}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="idUbicacion"
            label="ID Ubicación"
            type="text"
            fullWidth
            value={newMantenimiento.idUbicacion}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="comentario"
            label="Comentario"
            type="text"
            fullWidth
            value={newMantenimiento.comentario}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="fecha"
            label="Fecha"
            type="date"
            fullWidth
            value={newMantenimiento.fecha}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            name="usuarioId"
            label="ID Usuario"
            type="text"
            fullWidth
            value={newMantenimiento.usuarioId}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreate} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para mostrar fotografías */}
      <Dialog open={openFotografias} onClose={handleCloseFotografias}>
        <DialogTitle>Fotografías de Mantenimiento</DialogTitle>
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
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
