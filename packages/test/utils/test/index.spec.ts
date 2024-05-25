import { toViteTestRuntime } from "@test/utils";
import { Context, Effect, Layer, ManagedRuntime } from "effect";
import { gen } from "effect/Effect";
import { describe, expect } from "vitest";

export class UUIDProvider extends Context.Tag("Service/UUIDProvider")<
    UUIDProvider,
    {
        generateId: () => string;
    }
>() {}

const ID = "e9a6a9d3-13b4-4ddd-a6df-800e303d8e7b";

export const make = Effect.sync(() =>
    UUIDProvider.of({
        generateId: () => ID,
    }),
);

const TEST_SERVICES = Layer.mergeAll(Layer.effect(UUIDProvider, make));

const test = toViteTestRuntime(() => ManagedRuntime.make(TEST_SERVICES));

describe("Given an effect test", () => {
    test(
        "When trying to run it Then it succeeds",
        gen(function* () {
            const uuidProvider = yield* UUIDProvider;
            expect(uuidProvider.generateId()).toBe(ID);
        }),
    );
});
