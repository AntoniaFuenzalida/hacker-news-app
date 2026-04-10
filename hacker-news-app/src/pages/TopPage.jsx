import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Box,
  Chip,
  CircularProgress,
  Container,
  Stack,
  Typography,
  Alert,
  AppBar,
  Toolbar,
  Pagination,
} from "@mui/material";
import { getBestStories, getStoriesByIds } from "../services/hnApi";
import StoryCard from "../components/StoryCard";

const TOP_CACHE_KEY = "hn_top_cache";

// Página principal de la aplicación.
// Muestra las mejores historias de Hacker News con paginación de 50 elementos.
export default function TopPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [offlineMessage, setOfflineMessage] = useState("");
  const [page, setPage] = useState(1);
  const [totalStories, setTotalStories] = useState(0);

  const ITEMS_PER_PAGE = 50;

  useEffect(() => {
    async function fetchStories() {
      try {
        setLoading(true);
        setError("");
        setOfflineMessage("");

        // Obtiene todos los IDs de las mejores historias.
        const ids = await getBestStories();
        setTotalStories(ids.length);

        // Calcula el rango correspondiente a la página actual.
        const start = (page - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const paginatedIds = ids.slice(start, end);

        // Obtiene las historias de la página actual ya adaptadas al modelo de UI.
        const validStories = await getStoriesByIds(paginatedIds);
        setStories(validStories);

        // Guarda una copia local de la página actual como respaldo para modo offline.
        localStorage.setItem(
          `${TOP_CACHE_KEY}_${page}`,
          JSON.stringify({
            stories: validStories,
            totalStories: ids.length,
            page,
            savedAt: new Date().toISOString(),
          })
        );

        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        console.error(err);

        // Si la petición falla, se intenta recuperar la última versión almacenada localmente.
        const cached = localStorage.getItem(`${TOP_CACHE_KEY}_${page}`);

        if (cached) {
          const parsed = JSON.parse(cached);
          setStories(parsed.stories || []);
          setTotalStories(parsed.totalStories || 0);
          setOfflineMessage(
            "Mostrando historias guardadas previamente en este dispositivo."
          );
        } else {
          setError("No se pudieron cargar las historias.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchStories();
  }, [page]);

  // Memoiza el total de páginas para evitar recalcularlo en cada render.
  const totalPages = useMemo(() => {
    return Math.ceil(totalStories / ITEMS_PER_PAGE);
  }, [totalStories]);

  // Handler memoizado para evitar recrear la función en cada render.
  const handlePageChange = useCallback((_, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #0f172a 0%, #111827 45%, #0b1220 100%)",
        pb: 6,
      }}
    >
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: "rgba(15, 23, 42, 0.85)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight={700} sx={{ color: "white" }}>
            Hacker News Viewer
          </Typography>
          <Chip
            label={`Página ${page}`}
            color="primary"
            variant="filled"
            sx={{ fontWeight: 600 }}
          />
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ pt: 5 }}>
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography
            variant="h3"
            fontWeight={800}
            gutterBottom
            sx={{ color: "white" }}
          >
            Top Stories
          </Typography>

          <Typography variant="body1" sx={{ color: "rgba(255,255,255,0.7)" }}>
            Las mejores historias de Hacker News, paginadas de 50 en 50.
          </Typography>
        </Box>

        {!loading && !error && (
          <Stack
            direction="row"
            spacing={1.5}
            justifyContent="center"
            flexWrap="wrap"
            useFlexGap
            sx={{ mb: 4 }}
          >
            {/* Resumen rápido de la página cargada */}
            <Chip
              label={`${stories.length} historias en esta página`}
              sx={{
                bgcolor: "rgba(59,130,246,0.15)",
                color: "#bfdbfe",
                border: "1px solid rgba(59,130,246,0.25)",
              }}
            />
            <Chip
              label={`${totalStories} historias totales`}
              sx={{
                bgcolor: "rgba(16,185,129,0.15)",
                color: "#bbf7d0",
                border: "1px solid rgba(16,185,129,0.25)",
              }}
            />
          </Stack>
        )}

        {loading && (
          <Box
            sx={{
              minHeight: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <CircularProgress />
            <Typography sx={{ color: "rgba(255,255,255,0.8)" }}>
              Cargando historias...
            </Typography>
          </Box>
        )}

        {offlineMessage && (
          <Alert severity="info" sx={{ mb: 3, borderRadius: 3 }}>
            {offlineMessage}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && (
          <Stack spacing={2.5}>
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </Stack>
        )}

        {!loading && !error && totalPages > 1 && (
          <Box sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "white",
                  borderColor: "rgba(255,255,255,0.15)",
                },
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}