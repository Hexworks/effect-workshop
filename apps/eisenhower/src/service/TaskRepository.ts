import { Tag, type Effect } from "effect/Effect";

type TaskNotFound = "TaskNotFound";
type DatabaseError = "DatabaseError";

export class TaskRepository extends Tag("Service/TaskRepository")<
    TaskRepository,
    {
        completeTask: (
            id: string
        ) => Effect<void, TaskNotFound | DatabaseError>;
        deleteTask: (id: string) => Effect<void, TaskNotFound | DatabaseError>;
    }
>() {}
