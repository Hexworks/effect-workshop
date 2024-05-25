# Eisenhower Matrix Instructor Notes

## Exploring the Repo

Before we start coding, let's explore the project:

-   In the `.vscode` directory there are some recommended extensions
-   We can create a `terminals.json` there to include a script that automatically starts docker
-   There is a `docker-compose.yml` file that defines the services we will need later
-   Utilities are in the `packages` folder, the app is in `apps`
-   The slides are also included in the monorepo
-   There are also scripts in the `script` folder that can be used to call the endpoints

## Implementing The First Service

A good candidate for this is the `UUIDProvider` because it is relatively simple. Let's apply what we've learned from the slides. This is how it looks now:

```ts
import { Tag, type Effect } from "effect/Effect";

export class UUIDProvider extends Tag("Service/UUIDProvider")<
    UUIDProvider,
    {
        generate: () => Effect<string>;
    }
>() {}
```

First we need to add a `make` function:

> Calling it `make` is a convention often observable in Effect projects.

```ts
import { randomUUID } from "crypto";
import { Tag, succeed, sync, type Effect } from "effect/Effect";

// ...

const make = sync(() =>
    UUIDProvider.of({
        generate: () => succeed(randomUUID()),
    })
);
```

Then we can put it in a layer:

```ts
import { Layer } from "effect";

// ...

const layer = Layer.effect(UUIDProvider, make);
```

Since this is a "final" implementation with no other dependencies we can also export it as a live version:

> By convention we postfix live implementations with `Live`.

```ts
export const UUIDProviderLive = layer;
```

> Mention that the type of this is `Layer.Layer<UUIDProvider, never, never>` because it has no requirements.

Now that we have the service we can add it to our context in the `index.ts` file:

```ts
import { UUIDProviderLive } from "./service";
import { Layer, ManagedRuntime } from "effect";

const CONTEXT = Layer.mergeAll(UUIDProviderLive);
```

## Testing

It is a good idea to write tests along the way. Let's start by creating a test for our new service.

> There is an example in index.spec.ts

Let's create a new spec file in `service/UUIDprovider.spec.ts`:

```ts
import { describe, test, beforeEach } from "vitest";

describe("Given a UUIDProvider", () => {
    test("When calling generate Then it returns a valid UUID", () => {});
});
```

We'll immediately have a problem when we try to create a test because using Effect requires a runtime. Let's see if someone realizes that there should be a better approach, but for now let's do it the "regular" way.

First let's introduce a way to get the service type of a Tag:

> Put this in a util file

```ts
import { Context } from "effect";
import { Tag, type TagClassShape } from "effect/Context";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ServiceOf<T extends Tag<any, any> | TagClassShape<any, any>> =
    Context.Tag.Service<T>;
```

Then create a `beforeEach` function that creates the `UUIDProvider`.

We'll realize that we don't have `make` exported, and it would be awkward to import it, so let's refactor `UUIDProvider` to have these as static variables:

```ts
import { randomUUID } from "crypto";
import { Layer } from "effect";
import { Tag, succeed, sync, type Effect } from "effect/Effect";

export class UUIDProvider extends Tag("Service/UUIDProvider")<
    UUIDProvider,
    {
        generate: () => Effect<string>;
    }
>() {
    static make = sync(() =>
        UUIDProvider.of({
            generate: () => succeed(randomUUID()),
        })
    );

    static layer = Layer.effect(UUIDProvider, UUIDProvider.make);

    static live = UUIDProvider.layer;
}
```

> Note that this is a best practice in Effect.

Now we just refactor the `index.ts`:

```ts
import { UUIDProvider } from "./service";

// ...

const CONTEXT = Layer.mergeAll(UUIDProvider.live);
```

Now we can create the `beforeEach` function:

```ts
import { runSync } from "effect/Effect";

let target: ServiceOf<typeof UUIDProvider>;

beforeEach(() => {
    target = runSync(UUIDProvider.make);
});
```

and write our test:

```ts
import { describe, test, beforeEach, expect } from "vitest";

test("When calling generate Then it returns a valid UUID", () => {
    const result = runSync(target.generate());

    expect(typeof result).toBe("string");
});
```

Now ask them how they would do this if UUIDProvider had dependencies?

This would quickly become a tedium... so let's take a look at our test utilities and explain how it works.

Also note that this works because we added `@test/utils` as a dev dependency:

```json
"devDependencies": {
    "@test/utils": "workspace:*"
}
```

Now we can create our own test runtime and `test` function:

Create a new file `runtime.ts` in the root of the `test` folder:

```ts
import { Layer, ManagedRuntime } from "effect";
import { UUIDProvider } from "../src/service";

const createRuntime = () => {
    const UUIDProviderLive = UUIDProvider.live;

    const context = Layer.mergeAll(UUIDProviderLive);
    return ManagedRuntime.make(context);
};
```

Then add a `test` function that uses this:

```ts
import { toViteTestRuntime } from "@test/utils";

export const test = toViteTestRuntime(createRuntime);
```

Now we can refactor our test:

```ts
import { gen } from "effect/Effect";
import { describe, expect } from "vitest";
import { UUIDProvider } from "../../src/service";
import { test } from "../runtime";

describe("Given a UUIDProvider", () => {
    test(
        "When calling generate Then it returns a valid UUID",
        gen(function* () {
            const result = yield* UUIDProvider.generate();

            expect(typeof result).toBe("string");
        })
    );
});
```

Lo and behold!

> Explain how this will work in the future with multiple services added to our context.

> Someone might ask how to mock / stub things, we'll go into more detail about that later if we have time.

## Connecting To A Database

Now that we can generate UUIDs, let's connect to a database. We'll use Drizzle for this.

> Note that there is a `generate` script that we can run to generate migrations. This is already generated for us.

First we need to run `docker-compose up -d` to start the database.

> Now is a good time to add that script to the `terminals.json` that will run `docker-compose up -d` every time VSCode is started

Now let's add a db connection and a migration script into our `index.ts`:

```ts
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import * as schema from "./db/schema";
import pg from "pg";

// ...

const DB_URL =
    "postgresql://postgres-effect:postgres-effect@localhost:5434/postgres-effect?schema=public";

const start = async () => {
    const client = new pg.Client({
        connectionString: DB_URL,
    });
    await client.connect();
    const db = drizzle(client, { schema });
    await migrate(db, {
        migrationsSchema: "public",
        migrationsFolder: "./migrations",
    });

    // ...
};
```

If we run this it will automatically establish a connection to our database and perform a migration.

## Implementing A Repository

Now we'll create a live implementation for our repositories. Let's look at how we can do this. First, we create a `repository` folder in `src/db`, then we can start by adding a Drizzle repository for our matrices:

```ts
import { sync } from "effect/Effect";
import { MatrixRepository } from "../../service";

export const make = sync(() => {
    return MatrixRepository.of({
        create: (matrix) => {
            return sync(() => {
                throw new Error("Not implemented");
            });
        },
        findById: (id) => {
            throw new Error("Not implemented");
        },
        findAll: () => {
            throw new Error("Not implemented");
        },
    });
});
```

Oh, but wait...we need the database connection! Let's see what we can do. Since the repository functions don't have requirements we can create a context element that holds the database connection and
`yield*` it in the constructor. Create a new context element in the `service` folder named `Db.ts` and move the initialization logic there:

```ts
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Tag, gen, tryPromise } from "effect/Effect";
import pg from "pg";
import * as schema from "../db/schema";
import { Layer } from "effect";

const DB_URL =
    "postgresql://postgres-effect:postgres-effect@localhost:5434/postgres-effect?schema=public";

export class Db extends Tag("Service/Db")<Db, NodePgDatabase<typeof schema>>() {
    static make = gen(function* () {
        const client = new pg.Client({
            connectionString: DB_URL,
        });
        yield* tryPromise({
            try: () => client.connect(),
            catch: () => "DatabaseError",
        });
        const db = drizzle(client, { schema });
        yield* tryPromise({
            try: () =>
                migrate(db, {
                    migrationsSchema: "public",
                    migrationsFolder: "./migrations",
                }),
            catch: () => "DatabaseError",
        });
        return db;
    });

    static layer = Layer.effect(Db, Db.make);

    static live = Db.layer;
}
```

Then remove it from `index.ts`, and add `Db` to the context:

```ts
import { Layer, ManagedRuntime } from "effect";
import express, { json } from "express";
import { ExcelRouter, MatrixRouter, TaskRouter } from "./router";
import { Db, UUIDProvider } from "./service";

const PORT = 3333;

const CONTEXT = Layer.mergeAll(UUIDProvider.live, Db.live);
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
```

Now we can change `sync` to `gen` in our repository implementation:

```ts
import { gen } from "effect/Effect";
import { Db, MatrixRepository } from "../../service";

export const make = gen(function* () {
    const db = yield* Db;
    return MatrixRepository.of({
        create: (matrix) => {
            throw new Error("Not implemented");
        },
        findById: (id) => {
            throw new Error("Not implemented");
        },
        findAll: () => {
            throw new Error("Not implemented");
        },
    });
});
```

With these in place now we can create an actual implementation:

> Use `tryPromise` when calling drizzle

```ts
import { eq } from "drizzle-orm";
import { fail, gen, tryPromise } from "effect/Effect";
import { Matrix, Task } from "../../domain";
import { Db, MatrixRepository, UUIDProvider } from "../../service";
import { matrices } from "../schema";

const DatabaseError = "DatabaseError" as const;
const EntityNotFound = "EntityNotFound" as const;

export const make = gen(function* () {
    const db = yield* Db;
    const { generate: uuid } = yield* UUIDProvider;
    return MatrixRepository.of({
        create: ({ name }) =>
            gen(function* () {
                const id = yield* uuid();
                yield* tryPromise({
                    try: () =>
                        db.insert(matrices).values({ id, name }).execute(),
                    catch: () => DatabaseError,
                });
                return new Matrix(id, name, []);
            }),
        findById: (id) =>
            gen(function* () {
                const result = yield* tryPromise({
                    try: () =>
                        db.query.matrices.findFirst({
                            where: eq(matrices.id, id),
                            with: {
                                tasks: true,
                            },
                        }),
                    catch: () => DatabaseError,
                });
                if (result) {
                    const { id, name, tasks } = result;
                    return new Matrix(
                        id,
                        name,
                        tasks.map(
                            ({
                                id,
                                name,
                                completed,
                                dueDate,
                                urgency,
                                importance,
                            }) =>
                                new Task(
                                    id,
                                    name,
                                    completed,
                                    dueDate,
                                    urgency,
                                    importance
                                )
                        )
                    );
                } else {
                    return yield* fail(EntityNotFound);
                }
            }),
        findAll: () => tryPromise({
                    try: () =>
                        db.query.matrices.findMany({
                            columns: {
                                id: true,
                                name: true,
                            },
                        }),
                    catch: () => DatabaseError,
                }),
    });
});
```

Ask them when did they start to feel the pain?

## Introducing `Data`

> Here we can refactor our domain objects to use `Data.Class`:

```ts
export class Task extends Data.Class<{
    id: string;
    name: string;
    completed: boolean;
    dueDate: Date;
    urgency: Urgency;
    importance: Importance;
}> {}

// We can use Pick!
export type UnsavedTask = Pick<
    Task,
    "name" | "dueDate" | "urgency" | "importance"
> & {
    matrixId: string;
};

export type TaskUpdate = Pick<Task, "completed">;

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

export type MatrixSummary = Pick<Matrix, "id" | "name">;
```

This will yield something that's more bearable:

```ts
export const make = gen(function* () {
    const db = yield* Db;
    const { generate: uuid } = yield* UUIDProvider;
    return MatrixRepository.of({
        create: ({ name }) =>
            gen(function* () {
                const id = yield* uuid();
                yield* tryPromise({
                    try: () =>
                        db.insert(matrices).values({ id, name }).execute(),
                    catch: () => DatabaseError,
                });
                return new Matrix({ id, name, tasks: [] });
            }),
        findById: (id) =>
            gen(function* () {
                const result = yield* tryPromise({
                    try: () =>
                        db.query.matrices.findFirst({
                            where: eq(matrices.id, id),
                            with: {
                                tasks: true,
                            },
                        }),
                    catch: () => DatabaseError,
                });
                if (result) {
                    const { id, name, tasks } = result;
                    return new Matrix({
                        id,
                        name,
                        tasks: tasks.map((task) => new Task(task)),
                    });
                } else {
                    return yield* fail(EntityNotFound);
                }
            }),
        findAll: () => tryPromise({
                    try: () =>
                        db.query.matrices.findMany({
                            columns: {
                                id: true,
                                name: true,
                            },
                        }),
                    catch: () => DatabaseError,
                }),
    });
});
```

but still not ideal. Let's add a few mapping functions to our domain objects:

```ts
// ...

export class Matrix extends Data.Class<{
    id: string;
    name: string;
    tasks: Task[];
}> {
    // ...

    static fromRaw({ id, name, tasks }: Pick<Matrix, "id" | "name" | "tasks">) {
        return new Matrix({ id, name, tasks: tasks.map(Task.fromRaw) });
    }
}

// ...

export class Task extends Data.Class<{
    id: string;
    name: string;
    completed: boolean;
    dueDate: Date;
    urgency: Urgency;
    importance: Importance;
}> {
    static fromRaw(raw: Omit<Task, never>) {
        return new Task(raw);
    }
}
```

> We can discuss when to use Omit and Pick.

Then our repo becomes much more readable:

```ts
export const make = gen(function* () {
    const db = yield* Db;
    const { generate: uuid } = yield* UUIDProvider;
    return MatrixRepository.of({
        create: ({ name }) =>
            gen(function* () {
                const id = yield* uuid();
                yield* tryPromise({
                    try: () =>
                        db.insert(matrices).values({ id, name }).execute(),
                    catch: () => DatabaseError,
                });
                return new Matrix({ id, name, tasks: [] });
            }),
        findById: (id) =>
            gen(function* () {
                const result = yield* tryPromise({
                    try: () =>
                        db.query.matrices.findFirst({
                            where: eq(matrices.id, id),
                            with: {
                                tasks: true,
                            },
                        }),
                    catch: () => DatabaseError,
                });
                if (result) {
                    return Matrix.fromRaw(result);
                } else {
                    return yield* fail(EntityNotFound);
                }
            }),
        findAll: () => tryPromise({
                    try: () =>
                        db.query.matrices.findMany({
                            columns: {
                                id: true,
                                name: true,
                            },
                        }),
                    catch: () => DatabaseError,
                }),
    });
});
```

There is still a lot of boilerplate here, for example we can lift the tryPromise into a utility function:

```ts
// put this in utils.ts in the repo folder
import { tryPromise } from "effect/Effect";

const DatabaseError = "DatabaseError" as const;

export const query = <T>(fn: () => Promise<T>) =>
    tryPromise({
        try: () => fn(),
        catch: () => DatabaseError,
    });
```

Then we can refactor our repository once more:

```ts
export const make = gen(function* () {
    const db = yield* Db;
    const { generate: uuid } = yield* UUIDProvider;
    return MatrixRepository.of({
        create: ({ name }) =>
            gen(function* () {
                const id = yield* uuid();
                yield* query(() =>
                    db.insert(matrices).values({ id, name }).execute()
                );
                return new Matrix({ id, name, tasks: [] });
            }),
        findById: (id) =>
            gen(function* () {
                const result = yield* query(() =>
                    db.query.matrices.findFirst({
                        where: eq(matrices.id, id),
                        with: {
                            tasks: true,
                        },
                    })
                );
                if (result) {
                    return Matrix.fromRaw(result);
                } else {
                    return yield* fail(EntityNotFound);
                }
            }),
        findAll: () => query(() =>
                    db.query.matrices.findMany({
                        with: {
                            tasks: true,
                        },
                    })
                ),
    });
});
```

One last problematic part is that we yield a `fail` when there is an error. We can do better by using the `Data` module's `Error` class. Let's create an `error` folder in our `service` folder and put this there:

```ts
import { TaggedError } from "effect/Data";

export class DatabaseError extends TaggedError("DatabaseError")<{
    message: string;
}> {}

export class EntityNotFound extends TaggedError("EntityNotFound")<{
    entity: string;
    filter: Record<string, unknown>;
}> {}
```

> We can discuss Error vs TaggedError and how TaggedError helps with `catchTag` / `catchTags`

Now we can refactor our repository to use these instead of plain strings:

```ts
export const make = gen(function* () {
    const db = yield* Db;
    const { generate: uuid } = yield* UUIDProvider;
    return MatrixRepository.of({
        // ...
        findById: (id) =>
            gen(function* () {
                const result = yield* query(() =>
                    db.query.matrices.findFirst({
                        where: eq(matrices.id, id),
                        with: {
                            tasks: true,
                        },
                    })
                );
                if (result) {
                    return Matrix.fromRaw(result);
                } else {
                    return yield* fail(
                        new EntityNotFound({
                            entity: "Matrix",
                            filter: { id },
                        })
                    );
                }
            }),
        // ...
    });
});
```

and also the `query` function:

```ts
import { tryPromise } from "effect/Effect";
import { DatabaseError } from "../../service";

export const query = <T>(fn: () => Promise<T>) =>
    tryPromise({
        try: () => fn(),
        catch: (error) =>
            new DatabaseError({
                message:
                    error instanceof Error ? error.message : "Unknown error",
            }),
    });
```

There is one last neat trick that we can do. `TaggedError`s are yieldable:

```ts
return (
    yield *
    new EntityNotFound({
        entity: "Matrix",
        filter: { id },
    })
);
```

> As an exercise ask them if they can do all this with pipes instead of gen.

> Can they figure out how to map the `undefined` instead of using an if statement?

> Now have them implement `TaskRepository` on their own!

Solution is:

```ts
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { eq } from "drizzle-orm";
import { gen } from "effect/Effect";
import { Task } from "../../domain";
import { Db, TaskRepository, UUIDProvider } from "../../service";
import { tasks } from "../schema";
import { query } from "./util";

export const make = gen(function* () {
    const db = yield* Db;
    const { generate: uuid } = yield* UUIDProvider;
    return TaskRepository.of({
        create: (task) =>
            gen(function* () {
                const id = yield* uuid();
                const result = {
                    id,
                    completed: false,
                    ...task,
                };
                yield* query(() => db.insert(tasks).values(result).execute());
                return result;
            }),
        complete: (id) =>
            gen(function* () {
                const task = yield* query(() =>
                    db
                        .update(tasks)
                        .set({ completed: true })
                        .where(eq(tasks.id, id))
                        .returning()
                );

                return Task.fromRaw(task[0]!);
            }),
        delete: (id) =>
            gen(function* () {
                const task = yield* query(() =>
                    db.delete(tasks).where(eq(tasks.id, id)).returning()
                );

                return Task.fromRaw(task[0]!);
            }),
    });
});
```

Now we can put these repos into layers and do a barrel export:

```ts
// in DrizzleMatrixRepository.ts
import { Layer } from "effect";
import { UUIDProvider } from "../../service";
//! Move Db next to it!
import { Db } from "./Db";

export const layer = Layer.effect(MatrixRepository, make);

// This will make requirements `never`
export const live = pipe(
    layer,
    Layer.provide(Db.live),
    Layer.provide(UUIDProvider.live)
);
```

in DrizzleTaskRepository.ts

```ts
import { Layer } from "effect";
import { UUIDProvider } from "../../service";
//! Move Db next to it!
import { Db } from "./Db";

export const layer = Layer.effect(MatrixRepository, make);

// This will make requirements `never`
export const live = pipe(
    layer,
    Layer.provide(Db.live),
    Layer.provide(UUIDProvider.live)
);
```

in DrizzleTaskRepository.ts

```ts
export const layer = Layer.effect(TaskRepository, make);

// This will make requirements `never`
export const live = pipe(
    layer,
    Layer.provide(Db.live),
    Layer.provide(UUIDProvider.live)
);
```

in index.ts

```ts
export * from "./Db";
export * as DrizzleMatrixRepository from "./DrizzleMatrixRepository";
export * as DrizzleTaskRepository from "./DrizzleTaskRepository";
```

Now we can add all these to our context:

```ts
import { Layer, ManagedRuntime } from "effect";
import express, { json } from "express";
import { ExcelRouter, MatrixRouter, TaskRouter } from "./router";
import { UUIDProvider } from "./service";
import {
    Db,
    DrizzleMatrixRepository,
    DrizzleTaskRepository,
} from "./db/repository";

// ...

const CONTEXT = Layer.mergeAll(
    UUIDProvider.live,
    Db.live,
    DrizzleMatrixRepository.live,
    DrizzleTaskRepository.live
);

// ...
```

## Creating An Effectful Router

Right now none of this is used yet, as we still have our old routers. Now let's refactor them to use our repositories.

First let's create a type that represents our runtime:

```ts
import type { ManagedRuntime } from "effect/ManagedRuntime";
import type { Db } from "./db/repository";
import type { MatrixRepository, TaskRepository, UUIDProvider } from "./service";

export type EisenhowerRuntime = ManagedRuntime<
    UUIDProvider | Db | MatrixRepository | TaskRepository,
    string
>;
```

Now we can pass this to our `make` functions in our routers and use the runtime to execute the effects:

```ts
import { either } from "effect/Effect";
import { isRight } from "effect/Either";
import { Router } from "express";
import { MatrixRepository } from "../service";
import type { EisenhowerRuntime } from "../types";

export const make = ({ runPromise }: EisenhowerRuntime) => {
    const router = Router();

    router.get(`/`, async (req, res) => {
        console.log("Getting all matrices");
        const result = await runPromise(either(MatrixRepository.findAll()));
        if (isRight(result)) {
            res.status(200);
            res.json(result.right);
        } else {
            res.status(500);
            res.json(result.left);
        }
    });

    router.get(`/:matrixId`, async (req, res) => {
        const id = req.params.matrixId;
        console.log("Getting Matrix", id);
        const matrix = await runPromise(either(MatrixRepository.findById(id)));
        if (isRight(matrix)) {
            res.status(200);
            res.json(matrix.right);
        } else {
            res.status(404);
            res.json(matrix.left);
        }
    });

    router.post(`/`, async (req, res) => {
        const { name }: { name: string } = req.body;
        const matrix = await runPromise(
            either(MatrixRepository.create({ name }))
        );
        if (isRight(matrix)) {
            res.json(matrix.right);
        } else {
            res.status(500);
            res.json(matrix.left);
        }
    });

    return router;
};
```

We also need to add the parameter in the index file:

```ts
const start = async () => {
    const app = express();
    app.use(json());
    app.use("/matrix", MatrixRouter.make(RUNTIME));
    app.use("/task", TaskRouter.make());
    app.use("/excel", ExcelRouter.make());
    app.listen(PORT);
};
```

> Now they should try to run this. Chances are that most of the participants will get some error that crashes the whole process! This is because if the migration files weren't generated, then the migration can't' be run. This is a good opportunity to show them how to produce proper error messages and how the error type in the service `Layer`s work (we had a `string` up until now).

So let's refactor the `Db` service to use the `query` utility function that we already have:

```ts
export class Db extends Tag("Service/Db")<Db, NodePgDatabase<typeof schema>>() {
    static make = gen(function* () {
        const client = new pg.Client({
            connectionString: DB_URL,
        });

        yield* query(() => client.connect());
        const db = drizzle(client, { schema });
        yield* query(() =>
            migrate(db, {
                migrationsSchema: "public",
                migrationsFolder: "./migrations",
            })
        );
        return db;
    });

    static layer = Layer.effect(Db, Db.make);

    static live = Db.layer;
}
```

We also need to fix our runtime type:

```ts
import type { ManagedRuntime } from "effect/ManagedRuntime";
import type { Db } from "../db/repository";
import type {
    DatabaseError,
    MatrixRepository,
    TaskRepository,
    UUIDProvider,
} from "../service";

export type EisenhowerRuntime = ManagedRuntime<
    UUIDProvider | Db | MatrixRepository | TaskRepository,
    DatabaseError
>;
```

Now if we start the app and run a function there should be a proper error message like:

```
DatabaseError: Can't find meta/_journal.json file
```

And the fix is to run the generate script: `pnpm generate`.

> Now they should try implementing the `TaskRouter` on their own.

The solution:

```ts
import { either } from "effect/Effect";
import { isRight } from "effect/Either";
import { Router } from "express";
import { type UnsavedTask } from "../domain";
import { TaskRepository } from "../service";
import type { EisenhowerRuntime } from "../types";

export const make = ({ runPromise }: EisenhowerRuntime) => {
    const router = Router();

    router.post(`/`, async (req, res) => {
        // This is a tricky one because we get string, not Date
        const { dueDate, ...rest }: UnsavedTask = req.body;
        const result = await runPromise(
            either(
                TaskRepository.create({
                    ...rest,
                    dueDate: new Date(dueDate),
                })
            )
        );
        if (isRight(result)) {
            res.status(201);
            res.json(result.right);
        } else {
            res.status(404);
            res.json(result.left);
        }
    });

    router.patch(`/:taskId`, async (req, res) => {
        const id = req.params.taskId;
        const task = await runPromise(either(TaskRepository.complete(id)));
        if (isRight(task)) {
            res.status(200);
            res.json(task.right);
        } else {
            res.status(404);
            res.json(task.left);
        }
    });

    router.delete(`/:taskId`, async (req, res) => {
        const id = req.params.taskId;
        const task = await runPromise(either(TaskRepository.delete(id)));
        if (isRight(task)) {
            res.status(200);
            res.json(task.right);
        } else {
            res.status(404);
            res.json(task.left);
        }
    });

    return router;
};
```

> Note that there are a few small changes, such as not having `completed` in the body of the patch request since we have a `complete` not an `update` function in the repository.


## Sending Notifications