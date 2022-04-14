export function badRequest(message: string) {
  return { typeCode: 409, message };
}

export function unprocessableEntity(message: string) {
  return { typeCode: 422, message };
}

export function unauthorized(message: string) {
  return { typeCode: 401, message };
}