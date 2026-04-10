import { memo } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ChatIcon from "@mui/icons-material/Chat";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PersonIcon from "@mui/icons-material/Person";

// Componente presentacional para mostrar una historia individual.
// Se memoiza para evitar renders innecesarios cuando sus props no cambian.
function StoryCard({ story }) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        color: "white",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Box>
            {/* Si la historia tiene URL, se permite navegar al artículo original.
                En caso contrario, solo se muestra el título. */}
            {story.url ? (
              <Button
                component="a"
                href={story.url}
                target="_blank"
                rel="noopener noreferrer"
                endIcon={<OpenInNewIcon />}
                sx={{
                  p: 0,
                  textTransform: "none",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  color: "#93c5fd",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  lineHeight: 1.35,
                  "&:hover": {
                    background: "transparent",
                    color: "#bfdbfe",
                  },
                }}
              >
                {story.title}
              </Button>
            ) : (
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{ color: "#e5e7eb" }}
              >
                {story.title}
              </Typography>
            )}
          </Box>

          {/* Metadatos principales de la historia */}
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
              label={`${story.descendants} comentarios`}
              sx={{
                bgcolor: "rgba(255,255,255,0.06)",
                color: "white",
              }}
            />
          </Stack>

          {/* Navegación interna hacia la vista de detalle de la historia */}
          <Box>
            <Button
              component={Link}
              to={`/story/${story.id}`}
              variant="contained"
              startIcon={<ChatIcon />}
              sx={{
                borderRadius: 3,
                px: 2.2,
                py: 1,
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              Ver comentarios
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default memo(StoryCard);