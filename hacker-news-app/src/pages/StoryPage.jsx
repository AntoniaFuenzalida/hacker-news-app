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

export default function StoryPage() {
  const { id } = useParams();

  const [story, setStory] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [error, setError] = useState("");
  const [offlineMessage, setOfflineMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setCommentsLoading(true);
        setError("");
        setOfflineMessage("");

        if (!id) {
          throw new Error("ID inválido");
        }

        const storyData = await getStoryById(id);

        if (!storyData) {
          throw new Error("Historia no encontrada");
        }

        setStory(storyData);

        const commentIds = storyData.kids || [];
        const commentsData = await getCommentsByIds(commentIds);

        const validComments = commentsData.filter(
          (c) => c && !c.deleted && !c.dead
        );

        setComments(validComments);

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

        const cached = localStorage.getItem(`${STORY_CACHE_KEY}_${id}`);

        if (cached) {
          const parsed = JSON.parse(cached);

          setStory(parsed.story || null);
          setComments(parsed.comments || []);
          setOfflineMessage(
            "Mostrando contenido guardado previamente (modo offline)."
          );
        } else {
          setError("No se pudo cargar la historia.");
        }
      } finally {
        setLoading(false);
        setCommentsLoading(false);
      }
    }

    fetchData();
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
        <Toolbar sx={{ justifyContent: "space-between", minHeight: 72 }}>
          <Button
            component={Link}
            to="/top"
            startIcon={<ArrowBackIcon />}
            sx={{
              color: "white",
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 3,
              px: 2,
            }}
          >
            Volver
          </Button>

          <Typography
            variant="h6"
            fontWeight={800}
            sx={{
              color: "white",
              textAlign: "center",
              flex: 1,
            }}
          >
            Detalle de historia
          </Typography>

          <Chip
            label={`ID: ${story.id}`}
            sx={{
              bgcolor: "rgba(59,130,246,0.18)",
              color: "#bfdbfe",
              border: "1px solid rgba(59,130,246,0.28)",
              fontWeight: 600,
            }}
          />
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
            mb: 4,
            borderRadius: 4,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "white",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={3}>
              <Typography
                variant="h4"
                fontWeight={800}
                sx={{
                  lineHeight: 1.2,
                  color: "white",
                }}
              >
                {story.title}
              </Typography>

              <Stack direction="row" spacing={1.2} flexWrap="wrap" useFlexGap>
                <Chip
                  icon={<PersonIcon />}
                  label={story.by || "Desconocido"}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.06)",
                    color: "white",
                  }}
                />
                <Chip
                  icon={<TrendingUpIcon />}
                  label={`Score: ${story.score ?? 0}`}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.06)",
                    color: "white",
                  }}
                />
                <Chip
                  icon={<ChatIcon />}
                  label={`${story.descendants ?? 0} comentarios`}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.06)",
                    color: "white",
                  }}
                />
              </Stack>

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
                      px: 2.5,
                      py: 1,
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
          <Typography
            variant="h5"
            fontWeight={800}
            sx={{ color: "white", mb: 0.5 }}
          >
            Comentarios
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.7)" }}>
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
            No hay comentarios.
          </Alert>
        ) : (
          <Stack spacing={2}>
            {comments.map((c) => (
              <CommentCard key={c.id} comment={c} />
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
}