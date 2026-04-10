import { adaptStory } from "../models/storyModel";
import { adaptComment } from "../models/commentModel";

const BASE_URL = "https://hacker-news.firebaseio.com/v0";

// Función base para centralizar las peticiones HTTP a la API.
async function requestJson(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}`);

  if (!res.ok) {
    throw new Error(`Error en la petición: ${endpoint}`);
  }

  return res.json();
}

// Obtiene el listado de IDs de las mejores historias.
export async function getBestStories() {
  return requestJson("/beststories.json");
}

// Obtiene un item crudo por ID.
export async function getItemById(id) {
  return requestJson(`/item/${id}.json`);
}

// Obtiene y adapta una historia a un modelo consistente.
export async function getStoryById(id) {
  const item = await getItemById(id);
  return adaptStory(item);
}

// Obtiene y adapta un comentario a un modelo consistente.
export async function getCommentById(id) {
  const item = await getItemById(id);
  return adaptComment(item);
}

// Obtiene múltiples historias en paralelo.
export async function getStoriesByIds(ids = []) {
  const results = await Promise.all(ids.map((id) => getStoryById(id)));
  return results.filter(Boolean);
}

// Obtiene múltiples comentarios en paralelo.
export async function getCommentsByIds(ids = []) {
  const results = await Promise.all(ids.map((id) => getCommentById(id)));
  return results.filter(Boolean);
}