import { Tag, type Effect } from "effect/Effect";
import type { Task, UnsavedTask } from "../domain";

type EntityNotFound = "EntityNotFound";
type DatabaseError = "DatabaseError";

export class TaskRepository extends Tag("Service/TaskRepository")<
    TaskRepository,
    {
        create: (task: UnsavedTask) => Effect<Task, DatabaseError>;
        complete: (id: string) => Effect<Task, EntityNotFound | DatabaseError>;
        delete: (id: string) => Effect<Task, EntityNotFound | DatabaseError>;
    }
>() {}
