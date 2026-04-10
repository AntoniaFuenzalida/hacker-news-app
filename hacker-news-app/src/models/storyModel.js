export function adaptStory(item) {
  if (!item) return null;

  return {
    id: item.id ?? 0,
    title: item.title ?? "Sin título",
    by: item.by ?? "Desconocido",
    score: item.score ?? 0,
    url: item.url ?? "",
    descendants: item.descendants ?? 0,
    kids: item.kids ?? [],
    time: item.time ?? 0,
    type: item.type ?? "story",
  };
}