import { randomUUID } from "crypto";
import { Router } from "express";
import { Matrix } from "../domain";

export const MATRICES = new Map<string, Matrix>();

export const make = () => {
    const router = Router();

    router.get(`/`, async (req, res) => {
        // TODO:
        console.log("Getting all matrices");
        res.json([...MATRICES.values()].map(({ id, name }) => ({ id, name })));
    });

    router.get(`/:matrixId`, async (req, res) => {
        // TODO:
        const id = req.params.matrixId;
        console.log("Getting Matrix", id);
        const matrix = MATRICES.get(id);
        if (matrix) {
            res.status(200);
            res.json(matrix);
        } else {
            res.status(404);
            res.json({
                message: "Matrix Not Found",
            });
        }
    });

    router.post(`/`, async (req, res) => {
        // TODO:
        const { name }: { name: string} = req.body;
        const id = randomUUID();
        const matrix = new Matrix(id, name, []);
        console.log("Creating Matrix", matrix);
        MATRICES.set(id, matrix);
        res.json(matrix);
    });

    return router;
};
