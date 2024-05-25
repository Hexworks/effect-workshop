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

export const use =
    <A, R, E>({
        acquire,
        release,
    }: {
        acquire: () => Result<R, E>;
        release: (r: R) => Result<void>;
    }) =>
    (f: (resource: R) => Result<A, E>): Result<A, E> => {
        const r = acquire();
        if (r.success) {
            const result = f(r.value);
            release(r.value);
            return result;
        } else {
            return r;
        }
    };
