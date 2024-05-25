import { Layer, ManagedRuntime } from "effect";
import express, { json } from "express";
import { ExcelRouter, MatrixRouter, TaskRouter } from "./router";

const PORT = 3333;

const CONTEXT = Layer.empty;

const RUNTIME = ManagedRuntime.make(CONTEXT);

const start = async () => {
    const app = express();
    app.use(json());
    app.use("/matrix", MatrixRouter.make());
    app.use("/task", TaskRouter.make());
    app.use("/excel", ExcelRouter.make());
    app.listen(PORT);
};

start().then(() => {
    console.log(`Eisenhower service started on port ${PORT}`);
});
