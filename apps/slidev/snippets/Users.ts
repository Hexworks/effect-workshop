import { Context, Layer } from "effect";
import { Effect, fail, succeed, sync } from "effect/Effect";

export type User = { name: string };
export type UserNotFound = "User Not Found";

export class UserRepository extends Context.Tag("Service/UserRepository")<
    UserRepository,
    {
        findById: (id: string) => Effect<User, UserNotFound>;
        save: (user: { name: string }) => Effect<User>;
    }
>() {
    static stub() {
        return make;
    }

    static layer() {
        return Layer.effect(UserRepository, make);
    }
}

export const make = sync(() => {
    const users = new Map<string, User>();
    return UserRepository.of({
        findById: (id) => {
            const user = users.get(id);
            return user ? succeed(user) : fail("User Not Found");
        },
        save: (user) => {
            users.set(user.name, user);
            return succeed(user);
        },
    });
});
