import type { Importance } from "./Importance";
import type { Task } from "./Task";
import type { Urgency } from "./Urgency";

export class Matrix {
    constructor(public id: string, public name: string, public tasks: Task[]) {}

    getBy({
        importance,
        urgency,
    }: {
        importance?: Importance;
        urgency?: Urgency;
    }) {
        return this.tasks.filter(
            (task) =>
                (!importance || task.importance === importance) &&
                (!urgency || task.urgency === urgency)
        );
    }
}

export type MatrixSummary = {
    id: string;
    name: string;
};
