import { Box, Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import WarningIcon from "@mui/icons-material/Warning";

// Vista de respaldo para rutas no definidas en la aplicación.
export default function NotFoundPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #0f172a 0%, #111827 45%, #0b1220 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: "center" }}>
        <WarningIcon
          sx={{
            fontSize: 80,
            color: "#60a5fa",
            mb: 2,
          }}
        />

        <Typography
          variant="h2"
          fontWeight={800}
          sx={{ color: "white", mb: 1 }}
        >
          404
        </Typography>

        <Typography
          variant="h5"
          sx={{ color: "rgba(255,255,255,0.8)", mb: 3 }}
        >
          Página no encontrada
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "rgba(255,255,255,0.6)", mb: 4 }}
        >
          La ruta que estás buscando no existe o fue movida.
        </Typography>

        <Button
          component={Link}
          to="/top"
          variant="contained"
          size="large"
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1.5,
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          Volver al inicio
        </Button>
      </Container>
    </Box>
  );
}