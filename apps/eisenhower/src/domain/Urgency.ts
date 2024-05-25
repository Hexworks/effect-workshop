export const Urgency = {
    URGENT: "URGENT",
    NOT_URGENT: "NOT_URGENT",
} as const;

export type Urgency = keyof typeof Urgency;
