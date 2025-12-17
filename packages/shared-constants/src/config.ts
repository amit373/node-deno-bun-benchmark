export const APP_CONFIG = {
  API_VERSION: 'v1',
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  JWT_EXPIRY: '15m',
  JWT_REFRESH_EXPIRY: '7d',
  BCRYPT_ROUNDS: 12,
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000,
  RATE_LIMIT_MAX_REQUESTS: 100,
} as const;

export const GRADE_SCALE = {
  A_PLUS: { min: 97, max: 100, letter: 'A+' },
  A: { min: 93, max: 96, letter: 'A' },
  A_MINUS: { min: 90, max: 92, letter: 'A-' },
  B_PLUS: { min: 87, max: 89, letter: 'B+' },
  B: { min: 83, max: 86, letter: 'B' },
  B_MINUS: { min: 80, max: 82, letter: 'B-' },
  C_PLUS: { min: 77, max: 79, letter: 'C+' },
  C: { min: 73, max: 76, letter: 'C' },
  C_MINUS: { min: 70, max: 72, letter: 'C-' },
  D: { min: 60, max: 69, letter: 'D' },
  F: { min: 0, max: 59, letter: 'F' },
} as const;
