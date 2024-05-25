export const Importance = {
    IMPORTANT: "IMPORTANT",
    NOT_IMPORTANT: "NOT_IMPORTANT",
} as const;

export type Importance = keyof typeof Importance;
