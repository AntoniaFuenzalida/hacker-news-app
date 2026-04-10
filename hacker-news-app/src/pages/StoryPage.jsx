import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Stack,
  Typography,
  AppBar,
  Toolbar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ChatIcon from "@mui/icons-material/Chat";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PersonIcon from "@mui/icons-material/Person";
import { getStoryById, getCommentsByIds } from "../services/hnApi";
import CommentCard from "../components/CommentCard";

const STORY_CACHE_KEY = "hn_story_cache";

// Página de detalle de una historia.
// Obtiene la historia desde la URL y carga sus comentarios principales.
export default function StoryPage() {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [error, setError] = useState("");
  const [offlineMessage, setOfflineMessage] = useState("");

  useEffect(() => {
    async function fetchStoryAndComments() {
      try {
        setLoading(true);
        setCommentsLoading(true);
        setError("");
        setOfflineMessage("");

        const storyData = await getStoryById(id);
        setStory(storyData);

        const commentIds = storyData?.kids || [];
        const commentsData = await getCommentsByIds(commentIds);

        // Se filtran comentarios inválidos o marcados como eliminados.
        const validComments = commentsData.filter(
          (comment) => comment && !comment.deleted && !comment.dead
        );

        setComments(validComments);

        // Se almacena una copia local para reutilizarla en modo offline.
        localStorage.setItem(
          `${STORY_CACHE_KEY}_${id}`,
          JSON.stringify({
            story: storyData,
            comments: validComments,
            savedAt: new Date().toISOString(),
          })
        );
      } catch (err) {
        console.error(err);

        // Si falla la red, se intenta recuperar la última versión guardada.
        const cached = localStorage.getItem(`${STORY_CACHE_KEY}_${id}`);

        if (cached) {
          const parsed = JSON.parse(cached);
          setStory(parsed.story || null);
          setComments(parsed.comments || []);
          setOfflineMessage(
            "Mostrando historia y comentarios guardados previamente en este dispositivo."
          );
        } else {
          setError("No se pudo cargar la historia.");
        }
      } finally {
        setLoading(false);
        setCommentsLoading(false);
      }
    }

    fetchStoryAndComments();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(180deg, #0f172a 0%, #111827 45%, #0b1220 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography sx={{ color: "white" }}>Cargando historia...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!story) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ borderRadius: 3 }}>
          No se encontró la historia.
        </Alert>
      </Container>
    );
  }

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
        <Toolbar>
          <Button
            component={Link}
            to="/top"
            startIcon={<ArrowBackIcon />}
            sx={{ color: "white", textTransform: "none", fontWeight: 700 }}
          >
            Volver a Top Stories
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ pt: 5 }}>
        {offlineMessage && (
          <Alert severity="info" sx={{ mb: 3, borderRadius: 3 }}>
            {offlineMessage}
          </Alert>
        )}

        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "white",
            mb: 4,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={3}>
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{ lineHeight: 1.2 }}
              >
                {story.title}
              </Typography>

              {/* Resumen rápido de la historia */}
              <Stack direction="row" spacing={1.2} flexWrap="wrap" useFlexGap>
                <Chip
                  icon={<PersonIcon />}
                  label={story.by}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.06)",
                    color: "white",
                  }}
                />
                <Chip
                  icon={<TrendingUpIcon />}
                  label={`Score: ${story.score}`}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.06)",
                    color: "white",
                  }}
                />
                <Chip
                  icon={<ChatIcon />}
                  label={`Comentarios: ${story.descendants}`}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.06)",
                    color: "white",
                  }}
                />
              </Stack>

              {/* Acceso al artículo original si existe URL */}
              {story.url && (
                <Box>
                  <Button
                    component="a"
                    href={story.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="contained"
                    endIcon={<OpenInNewIcon />}
                    sx={{
                      borderRadius: 3,
                      textTransform: "none",
                      fontWeight: 700,
                    }}
                  >
                    Ir a la noticia
                  </Button>
                </Box>
              )}
            </Stack>
          </CardContent>
        </Card>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" fontWeight={800} sx={{ color: "white" }}>
            Comentarios
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.7)", mt: 0.5 }}>
            Comentarios principales de la historia seleccionada.
          </Typography>
        </Box>

        {commentsLoading ? (
          <Box
            sx={{
              minHeight: 220,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <CircularProgress />
            <Typography sx={{ color: "white" }}>
              Cargando comentarios...
            </Typography>
          </Box>
        ) : comments.length === 0 ? (
          <Alert severity="info" sx={{ borderRadius: 3 }}>
            Esta historia no tiene comentarios.
          </Alert>
        ) : (
          <Stack spacing={2}>
            {comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
}