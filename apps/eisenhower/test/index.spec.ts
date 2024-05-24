import { describe, expect, test, beforeEach } from "vitest";

export type Success<A> = { success: true; value: A };
export type Failure<E> = { success: false; error: E };

export type Result<A = never, E = never> = Success<A> | Failure<E>;

export const success = <A>(value: A): Result<A, never> => ({
    success: true,
    value,
});

export const fail = <E>(error: E): Result<never, E> => ({
    success: false,
    error,
});

export const map =
    <A, B, E>(f: (a: A) => B) =>
    (self: Result<A, E>): Result<B, E> =>
        self.success ? success(f(self.value)) : self;

export const flatMap =
    <A, B, E>(f: (a: A) => Result<B, E>) =>
    (self: Result<A, E>): Result<B, E> =>
        self.success ? f(self.value) : self;

export const tap =
    <A, E>(f: (a: A) => Result<void, E>) =>
    (self: Result<A, E>): Result<A, E> => {
        if (self.success) {
            f(self.value);
        }
        return self;
    };

/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
export function pipe<A>(a: A): A;
export function pipe<A, B>(a: A, ab: (a: A) => B): B;
export function pipe<A, B, C>(a: A, ab: (a: A) => B, bc: (b: B) => C): C;
export function pipe(
    a: unknown,
    ab?: Function,
    bc?: Function,
    cd?: Function
): unknown {
    switch (arguments.length) {
        case 1:
            return a;
        case 2:
            return ab!(a);
        case 3:
            return bc!(ab!(a));
        case 4:
            return cd!(bc!(ab!(a)));
        default: {
            let ret = arguments[0];
            for (let i = 1; i < arguments.length; i++) {
                ret = arguments[i](ret);
            }
            return ret;
        }
    }
}

const trace =
    <A>(span: string) =>
    (a: A) => {
        console.log(span, a);
        return success(undefined);
    };

const createUser = (name: string) => {
    return success({ name });
};

describe("Given a Create User operation", () => {
    test("When called with a valid name Then it succeeds", () => {
        const program = () =>
            pipe(createUser("Alice"), tap(trace("Create User")));

        console.log(program());
    });
});
