import { Data } from "effect";
import type { Importance } from "./Importance";
import type { Task } from "./Task";
import type { Urgency } from "./Urgency";

// TODO: we'll rewrite this to use Data.Class
// export class Matrix {
//     constructor(
//         public id: string,
//         public title: string,
//         public description: string,
//         public tasks: Task[]
//     ) {}
// }


type UnsavedMatrix = Pick<Matrix, "name">;


//? We're using a class because we want to add smart accessors
export class Matrix extends Data.Class<{
    id: string;
    name: string;
    tasks: Task[];
}> {
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
