import { Tag, type Effect } from "effect/Effect";
import type { Matrix, MatrixSummary } from "../domain/Matrix";

type DatabaseError = "DatabaseError";
type EntityNotFound = "EntityNotFound";

type UnsavedMatrix = {
    name: string;
};

export class MatrixRepository extends Tag("Service/MatrixRepository")<
    MatrixRepository,
    {
        create: (matrix: UnsavedMatrix) => Effect<Matrix, DatabaseError>;
        findById: (
            id: string
        ) => Effect<Matrix, DatabaseError | EntityNotFound>;
        findAll(): Effect<MatrixSummary[], DatabaseError>;
    }
>() {}
