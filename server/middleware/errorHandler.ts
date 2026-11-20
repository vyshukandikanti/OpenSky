export interface StandardErrorResponse {
  readonly success: false;
  readonly error: {
    readonly code: string;
    readonly message: string;
  };
}

export function formatErrorResponse(code: string, message: string): StandardErrorResponse {
  return {
    success: false,
    error: { code, message },
  };
}
