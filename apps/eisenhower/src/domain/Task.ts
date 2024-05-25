import type { Importance } from "./Importance";
import type { Urgency } from "./Urgency";

export class Task {
    constructor(
        public id: string,
        public name: string,
        public completed: boolean,
        public dueDate: Date,
        public urgency: Urgency,
        public importance: Importance
    ) {}
}

export type UnsavedTask = {
    matrixId: string;
    name: string;
    dueDate: string;
    urgency: Urgency;
    importance: Importance;
};
