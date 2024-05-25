import { NodeSdk } from "@effect/opentelemetry";
import {
    BatchSpanProcessor,
    ConsoleSpanExporter,
} from "@opentelemetry/sdk-trace-base";
import {
    Console,
    Context,
    Exit,
    Fiber,
    Layer,
    ManagedRuntime,
    Schedule,
    Scope,
    flow,
    pipe,
} from "effect";
import {
    acquireRelease,
    acquireUseRelease,
    addFinalizer,
    all,
    async,
    catchAll,
    catchTag,
    catchTags,
    die,
    either,
    fail,
    flatMap,
    fork,
    gen,
    log,
    logDebug,
    logError,
    logInfo,
    logTrace,
    map,
    mapError,
    match,
    sleep,
    matchEffect,
    never,
    orElse,
    orElseFail,
    promise,
    provide,
    provideService,
    provideServiceEffect,
    repeat,
    runPromise,
    runPromiseExit,
    runSync,
    runSyncExit,
    scoped,
    succeed,
    suspend,
    sync,
    tap,
    tryPromise,
    withSpan,
    type Effect as Eff,
} from "effect/Effect";
import { isLeft, isRight } from "effect/Either";

export {
    BatchSpanProcessor,
    Console,
    ConsoleSpanExporter,
    Context,
    Exit,
    Fiber,
    Layer,
    ManagedRuntime,
    NodeSdk, Schedule, Scope,
    acquireRelease,
    acquireUseRelease,
    addFinalizer, all, async,
    catchAll,
    catchTag,
    catchTags,
    die,
    either,
    fail,
    flatMap,
    flow,
    fork, gen, isLeft,
    sleep,
    isRight,
    log,
    logDebug,
    logError,
    logInfo,
    logTrace,
    map,
    mapError,
    match,
    matchEffect, never,
    orElse,
    orElseFail,
    pipe,
    promise, provide,
    provideService,
    provideServiceEffect, repeat, runPromise,
    runPromiseExit,
    runSync,
    runSyncExit,
    scoped,
    succeed, suspend, sync,
    tap,
    tryPromise,
    withSpan
};

export type Effect<A, E, R> = Eff<A, E, R>;
