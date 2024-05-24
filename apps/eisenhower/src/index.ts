import { NodeSdk } from "@effect/opentelemetry";
import {
    BatchSpanProcessor,
    ConsoleSpanExporter,
} from "@opentelemetry/sdk-trace-base";
import { Layer, ManagedRuntime, pipe, HashMap, HashSet, Console, Schedule, Fiber } from "effect";
import {
    Tag,
    all,
    dieSync,
    fail,
    fork,
    gen,
    logInfo,
    never,
    repeat,
    sleep,
    succeed,
    suspend,
    sync,
    withSpan,
    type Effect,
} from "effect/Effect";

export type User = { id: string; name: string };
export type UnsavedUser = { name: string };
export type UserNotFound = "User Not Found";

export class UUIDProvider extends Tag("Service/UUIDProvider")<
    UUIDProvider,
    {
        generate: () => Effect<string>;
    }
>() {
    static live() {
        let counter = 0;
        return sync(() =>
            UUIDProvider.of({
                generate: () => {
                    counter++;
                    return succeed(`${counter}`);
                },
            })
        );
    }

    static layer() {
        return Layer.effect(UUIDProvider, UUIDProvider.live());
    }
}

export class UserRepository extends Tag("Service/UserRepository")<
    UserRepository,
    {
        findById: (id: string) => Effect<User, UserNotFound>;
        save: (user: UnsavedUser) => Effect<User>;
    }
>() {
    static stub() {
        return make;
    }

    static layer() {
        return Layer.effect(UserRepository, make);
    }

    static live(): Layer.Layer<UserRepository, never, never> {
        return pipe(
            UserRepository.layer(),
            Layer.provide(UUIDProvider.layer())
        );
    }
}

export const make = gen(function* () {
    const users = new Map<string, User>();
    const uuidProvider = yield* UUIDProvider;
    return UserRepository.of({
        findById: (id) => {
            const user = users.get(id);
            return user ? succeed(user) : fail("User Not Found");
        },
        save: ({ name }) =>
            gen(function* () {
                const id = yield* uuidProvider.generate();
                const user = { id, name };
                users.set(user.id, user);
                return user;
            }),
    });
});

const NodeSdkLive = NodeSdk.layer(() => ({
    resource: { serviceName: "Workshop" },
    spanProcessor: new BatchSpanProcessor(new ConsoleSpanExporter()),
}));

const CONTEXT = Layer.merge(UserRepository.live(), NodeSdkLive);
const RUNTIME = ManagedRuntime.make(CONTEXT);


const fiddleAround = (ms: number) => gen(function* () {
    console.log("Fiddling around");
    yield* sleep(ms);
})


const program = all([
    fiddleAround(500),
    fiddleAround(500),
    fiddleAround(500),
], {
    // or "inherit", or number
    concurrency: "unbounded",
    // or "either" or "validate"
    mode: "default",
});

console.log(RUNTIME.runPromise(program));

