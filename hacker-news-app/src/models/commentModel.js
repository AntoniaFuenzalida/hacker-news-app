export function adaptComment(item) {
  if (!item) return null;

  return {
    id: item.id ?? 0,
    by: item.by ?? "Usuario desconocido",
    text: item.text ?? "Sin contenido",
    kids: item.kids ?? [],
    time: item.time ?? 0,
    type: item.type ?? "comment",
    deleted: item.deleted ?? false,
    dead: item.dead ?? false,
  };
}