export function typeToStatusCode(type: string) {
  const errorTypesToStatusCode = {
    badRequest: 409,
    notFound: 404,
    unprocessableEntity: 422,
    unauthorized: 401,
  };

  return errorTypesToStatusCode[type];
}