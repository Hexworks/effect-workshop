import { Tag, type Effect } from "effect/Effect";
import type { DateTime } from "luxon";
import type { Importance, Urgency } from "../domain";
import type { Matrix } from "../domain/Matrix";

type DatabaseError = "DatabaseError";
type MatrixNotFound = "MatrixNotFound";

type UnsavedMatrix = {
    name: string;
};

type UnsavedTask = {
    title: string;
    description: string;
    dueDate: DateTime;
    urgency: Urgency;
    importance: Importance;
};

export class MatrixRepository extends Tag("Service/MatrixRepository")<
    MatrixRepository,
    {
        create: (matrix: UnsavedMatrix) => Effect<Matrix | DatabaseError>;
        addTask: (
            matrixId: string,
            task: UnsavedTask
        ) => Effect<Matrix, DatabaseError>;
        find: (id: string) => Effect<Matrix, MatrixNotFound>;
        findAll(): Effect<Matrix[]>;
    }
>() {}
