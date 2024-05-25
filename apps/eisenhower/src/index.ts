import { Layer, ManagedRuntime } from "effect";
import express from "express";

const CONTEXT = Layer.empty;
const RUNTIME = ManagedRuntime.make(CONTEXT);

const start = async () => {
    const app = express();
    app.use(express.json());
    app.listen(3333);
};

start().then(() => {
    console.log(`Producer service started on port 3333`);
});
