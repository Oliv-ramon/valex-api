export function badRequest(message: string) {
  return { type: "badRequest", message };
}

export function notFound(message: string) {
  return { type: "notFound", message };
}

export function unprocessableEntity(message: string) {
  return { type: "unprocessableEntity", message };
}

export function unauthorized(message: string) {
  return { type: "unauthorized", message };
}