import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  centerText: {
    textAlign: "center",
    marginTop: theme.spacing(20),
  },
  title: {
    fontSize: "3rem",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: "1.2rem",
    marginTop: theme.spacing(2),
  },
  imageContainer: {
    marginTop: theme.spacing(4), // Añade margen superior para separar la imagen del texto
    textAlign: "center", // Asegura que la imagen esté centrada
  },
  image: {
    maxWidth: "30%", // Hace que la imagen sea responsiva
    height: "auto",
  },
}));

export default function Dashboard() {
  const classes = useStyles();
  return (
    <GridContainer justify="center">
      <GridItem xs={12}>
        <div className={classes.centerText}>
          <Typography className={classes.title}>MANTENIMIENTOS UMES</Typography>
          <Typography className={classes.subtitle}>
            Pablo Daniel Vásquez Monzón - 202108025
          </Typography>
          <Typography className={classes.subtitle}>
            Angely Esmeralda Thomas Cortéz - 202108047
          </Typography>
        </div>
      </GridItem>
      <GridItem xs={12}>
        <div className={classes.imageContainer}>
          {/* Aquí puedes agregar la etiqueta img para la imagen */}
          <img
            src={require("assets/img/logo-meso.png").default} // Asegúrate de que la ruta sea correcta
            alt="Descripción de la imagen"
            className={classes.image}
          />
        </div>
      </GridItem>
    </GridContainer>
  );
}
