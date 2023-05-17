export const extractTokenFromHeader = (request: any): string | undefined => {
  const [type, token] = request.headers.cookie?.split("=") ?? [];
  return type === "Authentication" ? token : undefined;
};

export const AUTH_SERVICE = "AUTH";
