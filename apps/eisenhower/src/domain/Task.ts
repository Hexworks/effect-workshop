import type { DateTime } from "luxon";
import type { Importance } from "./Importance";
import type { Urgency } from "./Urgency";
import { Data } from "effect";

// export class Task {
//     constructor(
//         public id: string,
//         public title: string,
//         public description: string,
//         public dueDate: DateTime,
//         public urgency: Urgency,
//         public importance: Importance
//     ) {}
// }

export class Task extends Data.Class<{
    id: string;
    title: string;
    description: string;
    completed: boolean;
    dueDate: DateTime;
    urgency: Urgency;
    importance: Importance;
}> {}
