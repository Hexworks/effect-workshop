import { randomUUID } from "crypto";
import { Router } from "express";
import { Task, type UnsavedTask } from "../domain";
import { MATRICES } from "./MatrixRouter";

const findTask = (id: string) =>
    [...MATRICES.values()]
        .map(({ tasks }) => tasks)
        .flatMap((tasks) => tasks)
        .find((task) => task.id === id);

export const make = () => {
    const router = Router();

    router.post(`/`, async (req, res) => {
        // TODO:
        const unsavedTask: UnsavedTask = req.body;
        const matrix = MATRICES.get(unsavedTask.matrixId);
        if (matrix) {
            const task: Task = new Task(
                randomUUID(),
                unsavedTask.name,
                false,
                new Date(unsavedTask.dueDate),
                unsavedTask.urgency,
                unsavedTask.importance
            );
            console.log("Creating Task", task);
            matrix.tasks.push(task);
            res.status(201);
            res.json(task);
        } else {
            res.status(404);
            res.json({
                message: "Matrix Not Found",
            });
        }
    });

    router.patch(`/:taskId`, async (req, res) => {
        // TODO:
        const id = req.params.taskId;
        const task = findTask(id);
        if (task) {
            task.completed = true;
            console.log("Updating task", task);
            res.status(200);
            res.json(task);
        } else {
            res.status(404);
            res.json({
                message: "Task Not Found",
            });
        }
    });

    router.delete(`/:taskId`, async (req, res) => {
        // TODO:
        const id = req.params.taskId;
        console.log("Deleting task", id);
        const task = findTask(id);
        if (task) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const matrix = [...MATRICES.values()].find((matrix) =>
                matrix.tasks.includes(task)
            )!;
            matrix.tasks = matrix.tasks.filter((t) => t.id !== id);
            res.status(204);
            res.json(task);
        } else {
            res.status(404);
            res.json({
                message: "Task Not Found",
            });
        }
    });

    return router;
};
