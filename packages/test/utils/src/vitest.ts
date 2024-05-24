import { AssertionError } from "assert";
import { Cause, Exit } from "effect";
import { type ConfigError } from "effect/ConfigError";
import { type Effect } from "effect/Effect";
import type { ManagedRuntime } from "effect/ManagedRuntime";
import type { TestAPI } from "vitest";
import * as V from "vitest";

export type API = TestAPI<{}>;

const test: API = V.test;

type RuntimeOptions<R> = {
    init?: (runtime: ManagedRuntime<R, ConfigError>) => Effect<void, never, R>;
};

export const toViteTestRuntime = <R>(
    runtimeFn: () => ManagedRuntime<R, ConfigError>,
    { init }: RuntimeOptions<R> = {},
) => {
    const runTest = async <A, E>(self: Effect<A, E, R>) => {
        const runtime = runtimeFn();
        if (init) {
            await runtime.runPromise(init(runtime));
        }
        const result = await runtime.runPromiseExit(self);
        if (Exit.isFailure(result)) {
            const error = Cause.squash(result.cause) as any;
            if ("debugMessage" in error) {
                throw new Error(error.debugMessage);
            }
            if (error instanceof AssertionError) {
                throw error;
            }
        }
    };

    return (() => {
        const f = <E, A>(
            name: string,
            self: Effect<A, E, R>,
            timeout: number | V.TestOptions = 5_000,
        ) => test(name, () => runTest(self), timeout);

        return Object.assign(f, {
            skip: <E, A>(
                name: string,
                self: Effect<A, E, R>,
                timeout = 5_000,
            ) => test.skip(name, () => runTest(self), timeout),
            only: <E, A>(
                name: string,
                self: Effect<A, E, R>,
                timeout = 5_000,
            ) => test.only(name, () => runTest(self), timeout),
        });
    })();
};
