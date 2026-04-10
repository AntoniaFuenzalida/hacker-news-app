import { memo } from "react";
import { Box, Card, CardContent, Divider, Stack, Typography } from "@mui/material";

function CommentCard({ comment }) {
  if (!comment || !comment.id) return null;

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        color: "white",
        transition: "transform 0.2s ease, border-color 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          borderColor: "rgba(96,165,250,0.35)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              {comment.by || "Usuario desconocido"}
            </Typography>
          </Box>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

          <Box
            sx={{
              color: "rgba(255,255,255,0.9)",
              lineHeight: 1.7,
              "& a": { color: "#93c5fd" },
              "& pre": {
                overflowX: "auto",
                p: 2,
                borderRadius: 2,
                backgroundColor: "rgba(255,255,255,0.05)",
              },
              "& code": {
                fontFamily: "monospace",
              },
              "& p": {
                mb: 1,
              },
            }}
            dangerouslySetInnerHTML={{
              __html: comment.text || "Sin contenido",
            }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}

export default memo(CommentCard);