export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;
