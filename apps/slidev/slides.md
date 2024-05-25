---
theme: seriph
title: Effect Workshop
info: |
    These are the slides for the Effect Workshop
class: text-center
highlighter: shiki
drawings:
    persist: false
transition: slide-left
mdc: true
twoslash: true
lineNumbers: true
---

A gentle introduction to

# Effect

<!--
-->

---
---

# Getting Started

Before we start, let's make sure you have everything you need.

<ul>
  <li v-click>Check the project out: <code>git clone https://github.com/Hexworks/effect-workshop.git</code></li>
  <li v-click>Move to the project directory <code>cd effect-workshop</code></li>
  <li v-click>Run <code>pnpm install</code></li>
  <li v-click>Install the recommended extensions</li>
</ul>

<!--
Note that it is possible that `pnpm` is not present for everybody. You can install it with
```bash
npm install -g pnpm
```
or
```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

- Terminals Manager needs a little explanation (automatically runs docker-compose then exits)
- Let's also look at the docker-compose file
-->

---
---

# What We'll Do

<ul>
  <li v-click>What's Effect?</li>
  <li v-click>Introduction to fp basics</li>
  <li v-click>Basic Effect usage</li>
  <li v-click>Effect modules in detail</li>
  <li v-click>We'll write our own Effect program</li>
</ul>
<!--
-->

---
layout: two-cols-header
layoutClass: gap-16
---

# What is Effect?

<blockquote v-click>The missing standard library for Typescript</blockquote>

::left::

<div v-click>Most desired JS features</div>

<ul>
  <li v-click>Standard Library</li>
  <li v-click>Immutable Data Structures</li>
  <li v-click>Observability</li>
  <li v-click>Pipe Operator</li>
  <li v-click>Pattern Matching</li>
</ul>

::right::

<div v-click>What Else?</div>

<ul>
  <li v-click>Error Handling</li>
  <li v-click>Context Management</li>
  <li v-click>Resource Management</li>
  <li v-click>Config Management</li>
  <li v-click>Concurrency</li>
  <li v-click>...</li>
</ul>

<!--

-->

---
layout: two-cols-header
layoutClass: gap-16
---

# Effect FAQ

::left::

<div v-click>❓ Isn't this like Rx?</div>
<div v-click>💡 Less restrictive</div>
<div v-click>💡 Can be used in an imperative style</div>

<div v-click class="mt-4">❓ Isn't this too new?</div>
<div v-click>💡 Based on fp-ts and ZIO</div>

<div v-click class="mt-4">❓ Isn't it hard?</div>
<div v-click>💡 Most features are opt-in</div>

<div v-click class="mt-4">❓ Is it compatible with <code>x</code>?</div>
<div v-click>💡 Comes with an imperoperability layer</div>

::right::

<div v-click>❓ Isn't it too costly to adopt?</div>
<div v-click>💡 Can be adopted gradually</div>

<div v-click class="mt-4">❓ Is it safe to adopt?</div>
<div v-click>💡 Not a 1-man project <em>anymore</em></div>

<div v-click class="mt-4">❓ Will I get support?</div>
<div v-click>💡 Very active community on Discord</div>

<div v-click class="mt-4">❓ My <code>x</code> doesn't like it</div>
<div v-click>💡 Is there a better alternative?</div>

<!--
- Mention that the learning curve is like a hyperbole. x: difficulty, y: frequency. Most features are not hard.
-->

---
---

# What Is An Effect?

<blockquote v-click> An Effect is a description of a program that is lazy and immutable</blockquote>

<!--
-->

---
---

# Immutability

```ts {monaco-run} {autorun:false}
let a = 1;

a = 2; // ✅

const b = 1;

b = 2; // ❌
```

<!--
A constant primitive is immutable, trying to mutate it will yield an error.
-->

---
---

# Immutability

```ts {monaco-run} {autorun:false}
const plusOne = (x: number) => x + 1;

console.log(plusOne(1));
```

<!--
A pure function is also immutable. It will always return the same output for the same input and there is no way to change its internal state.
Note that a program is also immutable after we run it.
-->

---
---

# What's Laziness?

````md magic-move

```ts
console.log("Hello");
```

```ts
const printHello = () => console.log("Hello");
```

````

<!--
Note that this is an example of a side-effect.
The first function is evaluated when the program is called (eager), but the second one is only evaluated when it is called (lazy)
-->



---
---

# Typical Problems in a Program

<ul>
  <li v-click>Error Handling is ad-hoc</li>
  <li v-click>Composability is lacking</li>
  <li v-click>Dependency injection is not type-safe</li>
  <li v-click>Hard to test</li>
  <li v-click>Resource handling is ad-hoc</li>
  <li v-click>Observability is ad-hoc</li>
  <li v-click>...</li>
</ul>

<!--
Tell them that we'll discover these problems in the following slides.
Also ask them what their problems are.
-->

---
---

# Missing from JS: Error Handling

```ts {monaco-run} {autorun:false}
const loadUsers = () => {
    throw new Error("Failed to load users"); // 💥 oops
};

const program = () => {
    const users = loadUsers();
    console.log(users);
};

program();
```

<!--
There is no indication that loadUsers can fail or how it will fail
-->

---
---

# Error Handling With Result Types

```ts {monaco-run} {autorun:false}
type Result<A, E> = { success: true; value: A } | { success: false; error: E };

const loadUsers = (): Result<never, string> => ({
    success: false,
    error: "Failed to load users",
});

const program = () => {
    const users = loadUsers();
    users.success ? console.log(users.value) : console.error(users.error);
};

program();
```

<!--
Here we'll know that loadUsers can fail and how it will fail
-->

---
---

# Composing Results

```ts
type Result<A, E> = { success: true; value: A } | { success: false; error: E };

const success = <A>(value: A): Result<A, never> => ({
    success: true,
    value,
});

const fail = <E>(error: E): Result<never, E> => ({
    success: false,
    error,
});

const map =
    <A, B, E>(f: (a: A) => B) =>
    (self: Result<A, E>): Result<B, E> =>
        self.success ? success(f(self.value)) : self;

const flatMap =
    <A, B, E>(f: (a: A) => Result<B, E>) =>
    (self: Result<A, E>): Result<B, E> =>
        self.success ? f(self.value) : self;
```

<!--
We can talk about how success/fail wraps the value in a Result type and how map and flatMap can be used to compose them. Composability is a core theme in FP, so we should talk about it.
Also mention what a combinator is and that we'll discover this more later.
-->


---
---

# Composing Results: Usage

```ts {monaco-run} {autorun:false}
import { success, fail, map, flatMap } from "./Result";

const times2 = (n: number) => n * 2;

const fromString = (s: string) => {
    const n = parseInt(s);
    return isNaN(n) ? fail("Not a number") : success(n);
};

const div10 = (n: number) => {
    if (n === 0) {
        return fail("Division by zero");
    }
    return success(10 / n);
};

const one = fromString("1");
const times2Result = map<number, number, string>(times2)(one);

const result = flatMap(div10)(times2Result);
console.log(result);
```

<!--
Ask about whether they think this looks good (probably not). This is when pipe comes in.
-->

---
---

# Composing Results: Piping

```ts
export function pipe<A>(a: A): A
export function pipe<A, B>(a: A, ab: (a: A) => B): B
export function pipe<A, B, C>(a: A, ab: (a: A) => B, bc: (b: B) => C): C
export function pipe(
  a: unknown,
  ab?: Function,
  bc?: Function,
  cd?: Function,
): unknown {
  // ...
}
```

<!--
Here we can introduce the idea of piping, and how it solves the problem of having awakward code.
Also note that there are plans to introduce a |> pipe |> operator in the future.
-->

---
---

# Composing Results: Piping

```ts {monaco-run} {autorun:false}
import { success, fail, map, flatMap } from "./Result";
import { pipe } from "./Functions";

const times2 = (n: number) => n * 2;

const fromString = (s: string) => {
    const n = parseInt(s);
    return isNaN(n) ? fail("Not a number") : success(n);
};
const div10 = (n: number) =>
    n === 0 ? fail("Division by zero") : success(10 / n);

const result = pipe(
    fromString("1"),
    map(times2),
    flatMap(div10)
);

console.log(result);
```

<!--
**Important**: mention that pipe is the same as nesting the function calls, this will be
important later...maybe show them a rewritten example with nested calls.
-->

---
---

# But I Want MY `async` / `await` Back!

<style>
    .marquee {
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      position: relative;
    }

    .marquee span {
      display: inline-block;
      animation: marquee 10s linear infinite;
    }

    @keyframes marquee {
      0% {
        transform: translateX(100vw);
      }
      100% {
        transform: translateX(-100%);
      }
    }
</style>

<blockquote v-click>We've got your back...</blockquote>
<div v-click class="marquee">
    <span>👀 SNEAK PEEK INCOMING 👀</span>
</div>

<div v-click>
```ts
gen(function* () {
    const one = yield* fromString("1");
    const times2Result = times2(one);
    return yield* div10(times2Result);
});
```
</div>


<!--
Mention that this is a little more elaborate so we can't reproduce it in the slides, but we'll get to it later.
-->

---
---

# Dependency Injection

<blockquote v-click>What are the most common problems with dependency-injection frameworks?</blockquote>

<ul>
  <li v-click>No type safety</li>
  <li v-click>Hard to test</li>
  <li v-click>Only fails at runtime</li>
  <li v-click>Lackluster async features</li>
  <li v-click>Tight coupling with the rest of the framework</li>
  <li v-click>...</li>
</ul>

<!--
Just ask them about the problems they face before revealing the list.
-->

---
---

# Dependency Injection: A Simple Solution

<blockquote>How can we inject the repository into this function?</blockquote>

````md magic-move

```ts
type User = { name: string; };
type UserNotFound = "User Not Found";

type UserRepository = {
    findById: (id: string) => Result<User, UserNotFound>;
    save: (user: any) => Result<User>;
};

const createUser = (name: string) => {
    // ...
}
```

```ts
type User = { name: string; };
type UserNotFound = "User Not Found";

type UserRepository = {
    findById: (id: string) => Result<User, UserNotFound>;
    save: (user: any) => Result<User>;
};

type Deps = { userRepository: UserRepository; };

const CreateUser =
    ({ userRepository }: Deps) =>
    (name: string) => userRepository.save({ name });

const operation = CreateUser({ userRepository });

const result = operation("John Doe");
```

```ts
type User = { name: string; };
type UserNotFound = "User Not Found";

type UserRepository = {
    findById: (id: string) => Result<User, UserNotFound>;
    save: (user: any) => Result<User>;
};

type Deps = { userRepository: UserRepository; };

// 👇 this is called "currying"
const CreateUser =
    ({ userRepository }: Deps) =>
    (name: string) => userRepository.save({ name });

const operation = CreateUser({ userRepository });

const result = operation("John Doe");
```

```ts
type User = { name: string; };
type UserNotFound = "User Not Found";

type UserRepository = {
    findById: (id: string) => Result<User, UserNotFound>;
    save: (user: any) => Result<User>;
};

type Deps = { userRepository: UserRepository; };

// 👇 this is called "currying" ... has nothing to do with the food
const CreateUser =
    ({ userRepository }: Deps) =>
    (name: string) => userRepository.save({ name });

const operation = CreateUser({ userRepository });

const result = operation("John Doe");
```

```ts
type User = { name: string; };
type UserNotFound = "User Not Found";

type UserRepository = {
    findById: (id: string) => Result<User, UserNotFound>;
    save: (user: any) => Result<User>;
};

type Deps = { userRepository: UserRepository; };

// 👇 this is called "currying" ... has nothing to do with the food
const CreateUser =
    ({ userRepository }: Deps) => // 👈 Creates a closure
    (name: string) => userRepository.save({ name });

const operation = CreateUser({ userRepository });

const result = operation("John Doe");
```

````

<!--
Ask them how they would do it. Mention that deps can be passed as arguments before revealing the solution.
Somebody will probably say that hand-wiring is tedious, in this case we can mention that Effect has as solution for this that we'll discuss later.
-->

---
---

# Let's go back to our list ...

<ul>
  <li>✅ Error Handling is ad-hoc</li>
  <li>✅ Composability is lacking</li>
  <li>✅ Dependency injection is not type-safe</li>
  <li>❓ Hard to test</li>
  <li>❓ Resource handling is ad-hoc</li>
  <li>❓ Observability is ad-hoc</li>
</ul>

<!--
Let's reiterate what we've learned so far...We'll talk about testability next
-->

---
---

# Testability

<blockquote v-click>Does this design help with testability?</blockquote>

<ul class="mt-4">
  <li v-click>✅ (Pure) Functions are testable by design</li>
  <li v-click>✅ The Result type makes it explicit that an error can happen</li>
  <li v-click>✅ Dependencies can be mocked / stubbed</li>
</ul>


<!--
Talk about how pure functions only operate on inputs and outputs == easy to test.
-->

---
---

# Testability: Functions

<blockquote>Pure functions are trivial to test</blockquote>

````md magic-move

```ts
const div10 = (n: number) => {
    if (n === 0) {
        return fail("Division by zero");
    }
    return success(10 / n);
};
```

```ts
const div10 = (n: number) => {
    if (n === 0) {
        return fail("Division by zero");
    }
    return success(10 / n);
};

describe("Given a div10 function", () => {
    test("When called with a valid number Then it returns a success", () => {
        const result = div10(2);
        expect(result).toEqual(success(5));
    });
});
```

```ts
const div10 = (n: number) => {
    if (n === 0) {
        return fail("Division by zero");
    }
    return success(10 / n);
};

describe("Given a div10 function", () => {
    test("When called with a valid number Then it returns a success", () => {
        const result = div10(2);
        expect(result).toEqual(success(5));
    });
    test("When called with zero Then it returns a failure", () => {
        const result = div10(0);
        expect(result).toEqual(fail("Division by zero"));
    });
});
```

````

<!--
-->


---
---

# Testability: Services

<blockquote>Services adhering to DIP are easy to test</blockquote>

````md magic-move
```ts
type User = { name: string };
type UserNotFound = "User Not Found";

type UserRepository = {
    findById: (id: string) => Result<User, UserNotFound>;
    save: (user: any) => Result<User>;
};

type Deps = { userRepository: UserRepository };

const CreateUser =
    ({ userRepository }: Deps) =>
    (name: string) => userRepository.save({ name });
```

```ts
const InMemoryUserRepository = (users: Map<string, User>): UserRepository => {
    return {
        findById: (id) => {
            const user = users.get(id);
            return user ? success(user) : fail("User Not Found");
        },
        save: (user) => {
            users.set(user.name, user);
            return success(user);
        },
    };
};
```

```ts
type CreateUser = ReturnType<typeof CreateUser>;

describe("Given a Create User operation", () => {
    let users: Map<string, User>;
    let target: CreateUser;
    let userRepository: UserRepository;

    beforeEach(() => {
        users = new Map();
        userRepository = InMemoryUserRepository(users);
        target = CreateUser({ userRepository });
    });

    test("When called with a valid name Then it succeeds", () => {
        const result = target("John Doe");
        expect(result).toEqual(
            success({
                name: "John Doe",
            })
        );
    });
});
```

````

<!--
Note that the in-memory repository accepts a Map so that it can be checked in the tests.
Mention that we can create a "reference" implementation of our services and provide (contract) tests for them. These can be applied against the "live" implementations as well.
-->

---
---

# What's Left?

<ul>
  <li>✅ Error Handling is ad-hoc</li>
  <li>✅ Composability is lacking</li>
  <li>✅ Dependency injection is not type-safe</li>
  <li>✅ Hard to test</li>
  <li>❓ Resource handling is ad-hoc</li>
  <li>❓ Observability is ad-hoc</li>
</ul>

<!--
Here we should mention that these two are integrated into Effect and we'll talk about them.
Next we'll look at a few examples of how these can be implemented easily by composition.
It is important to mention that these are not strictly business code, so they are usually
achieved by decoration.
-->

---
---

# What's on Tap?

> This function can be used to create side-effects

````md magic-move

```ts
export const tap =
    <A, E>(f: (a: A) => Result<void, E>) =>
    (self: Result<A, E>): Result<A, E> => {
        if (self.success) {
            f(self.value);
        }
        return self;
    }
```

```ts
export const tap =
    <A, E>(f: (a: A) => Result<void, E>) =>
    (self: Result<A, E>): Result<A, E> => {
        if (self.success) {
            f(self.value);
        }
        return self;
    }

const trace =
    <A>(span: string) =>
    (a: A) => {
        console.log(span, a);
        return success(undefined);
    };
```

```ts
export const tap =
    <A, E>(f: (a: A) => Result<void, E>) =>
    (self: Result<A, E>): Result<A, E> => {
        if (self.success) {
            f(self.value);
        }
        return self;
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
```

````
<!--
Mention that `trace` is a very simplistic example of how observability would work.
-->

---
---

# Putting It Together

```ts {monaco-run} {autorun:false}
import { success, tap } from "./Result";
import { pipe } from "./Functions";

const trace = <A>(span: string) => (a: A) => {
        console.log(span, a);
        return success(undefined);
};

const createUser = (name: string) => success({ name });

const program = () => pipe(
    createUser("Alice"),
    tap(trace("Create User"))
);

console.log(program());
```

<!--
Mention that this is similar to how middlewares or the decorator pattern works
and how composability helps to add these features to the program without touching
the business logic or increasing complexity.
-->

---
---

# How About Resource Handling?

````md magic-move

```ts
// ???
```

```ts
type Params<R, E> = {
    acquire: () => Result<R, E>;
    release: (r: R) => Result<void>;
};

const use =
    <A, R, E>({ acquire, release }: Params<R, E>) =>
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
```

```ts
type Params<R, E> = {
    acquire: () => Result<R, E>;
    release: (r: R) => Result<void>; // 👈 We assume no error here
};

const use =
    <A, R, E>({ acquire, release }: Params<R, E>) =>
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
```

```ts
type Params<R, E> = {
    acquire: () => Result<R, E>;
    release: (r: R) => Result<void>; // 👈 We assume no error here
};

const use =
    <A, R, E>({ acquire, release }: Params<R, E>) =>
    (f: (resource: R) => Result<A, E>): Result<A, E> => {
        const r = acquire();
        if (r.success) {
            const result = f(r.value); // 👈 We assume that this won't throw
            release(r.value);
            return result;
        } else {
            return r;
        }
    };
```

````

---
---

# Putting It Together

```ts {monaco-run} {autorun:false}
import { success, use } from "./Result";

const MY_RESOURCE = 1;

const withMyResource = use({
    acquire: () => success(MY_RESOURCE),
    release: () => success(undefined),
});

const result = withMyResource((myNum) => success(myNum + 1));

console.log(result);
```

<!--
Note that this is a very simplistic example of how resource handling would work.
-->

---
---

# Questions So Far?
  
<div>❓🙋‍♂️ ❔🙋‍♀️</div>

<!--
Here they'll probably ask about the details and how `x` or `y` will work and what problems
are there with the current code. Luckily Effect has solutions for most of these ...
-->

---
---

# Let's Look at Effect

```ts
declare interface Effect<out A, out E = never, out R = never>
```

<ul>
  <li v-click><code>A</code> is the output of the effect</li>
  <li v-click><code>E</code> is the type of the error (if any)</li>
  <li v-click><code>R</code> is the type of the requirements</li>
  <li v-click>An Effect describes the computation</li>
  <li v-click>It can be sync or async</li>
</ul>

<!--
We'll take a look at requirements later, but we can mention that it is similar to the dependency injection we've seen before.
An effect is inherently lazy too.
Also mention that sync / async is handled by the concurrency model (explained later).
-->

---
---

# How To Create Effects?

````md magic-move

```ts
import { succeed, runSync } from "./Effect";

const program = succeed("Hello, world!"); // 👈 Describes our program
```

```ts
import { succeed, runSync } from "./Effect";

const program = succeed("Hello, world!"); // 👈 Describes our program
                                          // 👈 Doesn't run on its own
```

```ts
import { fail } from "./Effect";

const program = fail("💥 Oops");       // 👈 Creates a failure
```

```ts
import { sync } from "./Effect";

const program = sync(() => "Hello, world!"); // 👈 Lazy success
```

```ts
import { promise } from "./Effect";

const program = promise(() => "Hello, world!"); // 👈 Async success (assumes no reject)
```

```ts
import { tryPromise } from "./Effect";

const program = tryPromise({                    // 👈 Async, can fail
    try: async () => "Hello, world!",
    catch: (e: unknown) => e,
});

```

````

<!--
-->

---
---
# How To Run Effects?

> `runSync` runs the effect synchronously
>
> 💥 Async effects can't be run this way

```ts {monaco-run} {autorun:false}
import { succeed, runSync } from "./Effect";

const program = succeed("Hello, world!");

console.log(runSync(program)); // 👈 Will throw if there was an error
```

<!--
-->

---
---
# How To Run Effects?

> `runPromise` runs the effect asynchronously

```ts {monaco-run} {autorun:false}
import { tryPromise, runPromise } from "./Effect";

const program = tryPromise({                    
    try: async () => "Hello, world!",
    catch: (e: unknown) => e,
});

const result = await runPromise(program); // 👈 Will reject on failure

console.log(result);
```

<!--
-->

---
---
# How To Run Effects?

> `runSyncExit` runs the effect synchronously
>
> It returns an `Exit` value that contains the result and the possible errors

```ts {monaco-run} {autorun:false}
import { succeed, runSyncExit } from "./Effect";

const program = succeed("Hello, world!");

console.log(runSyncExit(program));
```

<!--
Mention that `Exit` will be explained later.
-->

---
---
# How To Run Effects?

> `runPromiseExit` runs the effect asynchronously
>
> It returns an `Exit` value

```ts {monaco-run} {autorun:false}
import { tryPromise, runPromiseExit } from "./Effect";

const program = tryPromise({                    
    try: async () => "Hello, world!",
    catch: (e: unknown) => e,
});

const result = await runPromiseExit(program);

console.log(result);
```

<!--
-->

---
---
# Writing Our First Program

```ts {monaco-run} {autorun:false}
import { succeed, fail, map, flatMap, pipe, runSync } from "./Effect";

const times2 = (n: number) => n * 2;

const fromString = (s: string) => {
    const n = parseInt(s);
    return isNaN(n) ? fail("Not a number") : succeed(n);
};

const div10 = (n: number) =>
    n === 0 ? fail("Division by zero") : succeed(10 / n);

const program = pipe(
    fromString("1"),
    map(times2),
    flatMap(div10)
);

console.log(runSync(program));
```

<!--
Note that this is very similar to what we did in the previous example, only a few names changed.
-->

---
---
# Writing Our First Program: Flows

````md magic-move

```ts
import { succeed, fail, map, flatMap, pipe, runSync } from "./Effect";

const times2 = (n: number) => n * 2;

const fromString = (s: string) => {
    const n = parseInt(s);
    return isNaN(n) ? fail("Not a number") : succeed(n);
};

const div10 = (n: number) =>
    n === 0 ? fail("Division by zero") : succeed(10 / n);

const program = pipe(
    fromString("1"),    // 👈 What if we want to pass "1" as a parameter?
    map(times2),
    flatMap(div10)
);

console.log(runSync(program));
```

```ts
import { succeed, fail, map, flatMap, flow, runSync } from "./Effect";

const times2 = (n: number) => n * 2;

const fromString = (s: string) => {
    const n = parseInt(s);
    return isNaN(n) ? fail("Not a number") : succeed(n);
};

const div10 = (n: number) =>
    n === 0 ? fail("Division by zero") : succeed(10 / n);

const program = flow(
    fromString,
    map(times2),
    flatMap(div10)
);

console.log(runSync(program("1")));
```

````

<!--
Note that this is very similar to what we did in the previous example, only a few names changed.
-->

---
---

# Composing Effects: map

```ts
declare const map: {
  <A, B>(f: (a: A) => B): <E, R>(self: Effect<A, E, R>) => Effect<B, E, R>
  <A, E, R, B>(self: Effect<A, E, R>, f: (a: A) => B): Effect<B, E, R>
}
```

<ul>
  <li v-click>Unwraps a value <code>A</code> and transforms it to a <code>B</code></li>
  <li v-click>Will not run if <code>self</code> is not a success</li>
</ul>

<!--
Mention that all combinators have a curried and uncurried form.
-->

---
---

# Composing Effects: flatMap

```ts
declare const flatMap: {
  <A, B, E1, R1>(f: (a: A) => Effect<B, E1, R1>): <E, R>(self: Effect<A, E, R>) => Effect<B, E1 | E, R1 | R>
  <A, E, R, B, E1, R1>(self: Effect<A, E, R>, f: (a: A) => Effect<B, E1, R1>): Effect<B, E | E1, R | R1>
}
```

<ul>
  <li v-click>Unwraps a value <code>A</code> and re-wraps it into an <code>Effect</code> of <code>B</code></li>
  <li v-click>Will not run if <code>self</code> is not a success</li>
</ul>

<!--
Mention that we can also return a `fail` from a `flatMap` so it is useful when we want to produce some error based on what happens within `f`
-->

---
---

# Composing Effects: tap

```ts
declare const tap: {
  <X>(
    f: NotFunction<X>
  ): <A, E, R>(
    self: Effect<A, E, R>
  ) => Effect<A, E, R>
}
```

<ul>
  <li v-click>Unwraps a value form an effect, and does a side-effect</li>
  <li v-click>Will not run if <code>self</code> is not a success</li>
</ul>

<!--
-->

---
---

# Composing Effects: all

```ts
declare const all: <
  const Arg extends Iterable<Effect<any, any, any>> | Record<string, Effect<any, any, any>>,
  O extends {
    readonly concurrency?: Concurrency | undefined
    readonly batching?: boolean | "inherit" | undefined
    readonly discard?: boolean | undefined
    readonly mode?: "default" | "validate" | "either" | undefined
  }
>(arg: Arg, options?: O)
```

<ul>
  <li v-click>Runs all the provided effects in sequence respecting the structure provided in input.</li>
  <li v-click>Will respect the options provided (concurrency, etc ...)</li>
</ul>

<!--
Mention that this ties into the concurrency model, which we'll discuss later.
-->



---
---

# Tip: importing from Effect

````md magic-move

```ts
import { Effect, pipe } from "effect"; // 👈 importing "effect"

const program = pipe(
    Effect.succeed(1),
    Effect.map((x) => x + 1),
);
```

```ts
import { pipe } from "effect";
import { succeed, map } from "effect/Effect"; // 👈 subpath import

const program = pipe(
    succeed(1),
    map((x) => x + 1),
);
```

````

<!--
Mention that many more modules can be imported like this (such as Either)
-->

---
---

# What if I Hate pipes?

<blockquote>💡 Use generators!</blockquote>

````md magic-move

```ts
import { pipe } from "effect";
import { succeed, map, gen } from "effect/Effect"; // 👈 subpath import

const program = pipe(
    succeed(1),
    map((x) => x + 1)
);
```

```ts
import { succeed, gen } from "effect/Effect";

const getNum = succeed(1);

const program = gen(function* () {
    const num = yield* getNum;
    return num + 1;
});
```

````

<!--
A little more info is in the next slide
-->

---
---

# How Do Generators Work?

```ts {monaco-run} {autorun:false}
import { succeed, gen, runSync } from "./Effect";

const getNum = succeed(1);

const program = gen(function* () {
    const num = yield* getNum;
    return num + 1;
});

console.log(runSync(program));
```

<ul>
  <li v-click>A generator and a pipe is very similar in nature</li>
  <li v-click>Usage is similar to async / await</li>
  <li v-click>Error-handling is built-in</li>
  <li v-click>Effect handles concurrency internally</li>
</ul>

<!--
Explain how both generators and pipes are dealing with sequences of values.
Point out the similarities between async / await and function* / yield*.
We'll explain error handling in the next topic.
We'll go into more detail later regarding concurrency.
-->

---
---

# Generators vs Promises

````md magic-move

```ts
const getNum = async () => 1;

const program = async () => {
    const num = await getNum();
    return num + 1;
}
```

```ts
const getNum = async () => 1;

const program = async () => {
    const num = await getNum(); // 👈 Can fail here
    return num + 1;
}
```

```ts
const getNum = (): Effect<number, never, never> => succeed(1); // 👈 error is `never`

const program = gen(function* () {
    const num = yield* getNum(); // 👈 Can't fail
    return num + 1;
});
```

```ts
const getNum = (): Effect<number, never, never> => succeed(1);
const getOtherNum = () => 2;

const program = gen(function* () {
    const num = yield* getNum(); // 👈 Can't fail
    return num + getOtherNum();  // 👈 No yield* 
});
```

````

<!--
We'll go into more detail later regarding concurrency.
-->

---
---

# Error Handling

> What's gonna happen if we run this?

```ts {monaco-run} {autorun:false}
import { map, fail, tap, runSync, pipe, type Effect } from "./Effect";

const getNum = (): Effect<number, Error, never> => fail(new Error("💥 Uh-oh"))

const program = pipe(
    getNum(),
    map((num: number) => num + 1 ),
    tap((num: number) => console.log(num)),
);

runSync(program);
```

<ul>
  <li v-click>The program "short-circuits"</li>
  <li v-click>A weird error is thrown!</li>
</ul>

<!--
Ask them about what is supposed to happen here.
The error we see is the Exit value, we'll talk about it later
-->

---
---

# Error Handling: Our Options

<ul>
  <li v-click>die: dies (unrecoverable error)</li>
  <li v-click>catchAll: recovers from all recoverable errors, returns an Effect</li>
  <li v-click>catchTag: recovers from the specified tagged error</li>
  <li v-click>catchTags: recovers from the specified tagged errors</li>
  <li v-click>orElse: ignores the error and returns another effect</li>
  <li v-click>orElseFail: ignores the error and returns another error</li>
  <li v-click>mapError: maps the error(s) to another error</li>
  <li v-click>match: maps both success and error channels</li>
  <li v-click>matchEffect: like flatMap but for both channels</li>
</ul>

<!--
-->

---
---

# Error Handling: die

```ts {monaco-run} {autorun:false}
import { map, fail, tap, runSync, pipe, catchAll, die, type Effect } from "./Effect";

class GetNumError extends Error {
    constructor() { super(`💥 Failed to get number`); }
}

const getNum = (): Effect<number, Error, never> => fail(new GetNumError())

const program = pipe(
    getNum(),
    catchAll(die),
    map((num: number) => num + 1),
    tap((num: number) => console.log(num))
);

runSync(program);
```

<!--
Note that we get the same error as before: by default `runSync` dies
-->

---
---

# Error Handling: catchAll

```ts {monaco-run} {autorun:false}
import { map, fail, tap, runSync, pipe, catchAll, die, succeed, type Effect } from "./Effect";

class GetNumError extends Error {
    constructor() { super(`💥 Failed to get number`); }
}
const getNum = (): Effect<number, Error, never> => fail(new GetNumError())
const fallback = () => succeed(0);

const program = pipe(
    getNum(),
    catchAll(fallback),
    map((num: number) => num + 1),
    tap((num: number) => console.log(num))
);

runSync(program);
```

<!--
Note that we get the same error as before: by default `runSync` dies
-->

---
---

# Error Handling: catchTag

```ts {monaco-run} {autorun:false}
import { map, fail, tap, runSync, pipe, catchTag, succeed, type Effect } from "./Effect";

class GetNumError extends Error {
    public _tag = "GetNumError";
    constructor() { super(`💥 Failed to get number`); }
}
const getNum = (): Effect<number, Error, never> => fail(new GetNumError())
const fallback = () => succeed(0);

const program = pipe(
    getNum(),
    catchTag("GetNumError", fallback),
    map((num: number) => num + 1),
    tap((num: number) => console.log(num))
);

runSync(program);
```

<!--
Mention that Effect uses `_tag` all over the place, that's why this works out of the box.
-->

---
---

# Error Handling: catchTags

```ts {monaco-run} {autorun:false}
import { map, fail, tap, runSync, pipe, catchTags, succeed, type Effect } from "./Effect";

class GetNumError extends Error {
    public _tag = "GetNumError";
    constructor() { super(`💥 Failed to get number`); }
}
const getNum = (): Effect<number, Error, never> => fail(new GetNumError())
const fallback = () => succeed(0);

const program = pipe(
    getNum(),
    catchTags({
        GetNumError: fallback,
    }),
    map((num: number) => num + 1),
    tap((num: number) => console.log(num))
);

runSync(program);
```

<!--
-->

---
---

# Error Handling: orElse

```ts {monaco-run} {autorun:false}
import { map, fail, tap, runSync, pipe, orElse, succeed, type Effect } from "./Effect";

class GetNumError extends Error {
    public _tag = "GetNumError";
    constructor() { super(`💥 Failed to get number`); }
}
const getNum = (): Effect<number, Error, never> => fail(new GetNumError())
const fallback = () => succeed(0);

const program = pipe(
    getNum(),
    orElse(fallback),
    map((num: number) => num + 1),
    tap((num: number) => console.log(num))
);

runSync(program);
```

<!--
The difference between orElse and catchAll is that orElse ignores the error
-->

---
---

# Error Handling: orElseFail

```ts {monaco-run} {autorun:false}
import { map, fail, tap, runSync, pipe, orElseFail, succeed, type Effect } from "./Effect";

class GetNumError extends Error {
    public _tag = "GetNumError";
    constructor() { super(`💥 Failed to get number`); }
}

class ProgramError extends Error {
    public _tag = "ProgramError";
    constructor() { super(`💥 Program Error`); }
}

const getNum = (): Effect<number, GetNumError, never> => fail(new GetNumError());

const program = pipe(
    getNum(),
    orElseFail(() => new ProgramError()),
    map((num: number) => num + 1),
    tap((num: number) => console.log(num))
);

runSync(program);
```

<!--
-->


---
---

# Error Handling: mapError

```ts {monaco-run} {autorun:false}
import { map, fail, tap, runSync, pipe, mapError, succeed, type Effect } from "./Effect";

class GetNumError extends Error {
    public _tag = "GetNumError";
    constructor() { super(`💥 Failed to get number`); }
}

class ExternalError extends Error {
    constructor() { super(`3rd party lib error`); }
}

const getNum = (): Effect<number, ExternalError, never> => fail(new ExternalError());

const program = pipe(
    getNum(),
    mapError(() => new GetNumError()),
    map((num: number) => num + 1),
    tap((num: number) => console.log(num))
);

runSync(program);
```

<!--
Here we can manually  match the error. Useful when we have no control over the error types (for example it has no _tag field).
-->

---
---

# Error Handling: match

```ts {monaco-run} {autorun:false}
import { map, fail, tap, runSync, pipe, match, succeed, type Effect } from "./Effect";

class GetNumError extends Error {
    public _tag = "GetNumError";
    constructor() { super(`💥 Failed to get number`); }
}

const getNum = (): Effect<number, GetNumError, never> => fail(new GetNumError());

const program = pipe(
    getNum(),
    match({
        onFailure: () => 0,
        onSuccess: (num: number) => (num < 0 ? 0 : num),
    }),
    map((num: number) => num + 1),
    tap((num: number) => console.log(num))
);

runSync(program);
```

<!--
match is useful when we want to transform both the success and error channels.
-->

---
---

# Error Handling: matchEffect

```ts {monaco-run} {autorun:false}
import { map, fail, tap, runSync, pipe, matchEffect, succeed, type Effect } from "./Effect";

class GetNumError extends Error {
    public _tag = "GetNumError";
    constructor() { super(`💥 Failed to get number`); }
}

const getNum = (): Effect<number, GetNumError, never> => fail(new GetNumError());

const fallback = () => succeed(0);

const program = pipe(
    getNum(),
    matchEffect({
        onFailure: () => fallback(),
        onSuccess: (num: number) => succeed(num < 0 ? 0 : num),
    }),
    map((num: number) => num + 1),
    tap((num: number) => console.log(num))
);

runSync(program);
```

<!--
Same as match but returns effects
-->

---
---

# What If I Want To Use A Generator?

````md magic-move

```ts
class GetNumError extends Error {
    public _tag = "GetNumError";
    constructor() {
        super(`💥 Failed to get number`);
    }
}

const getNum = (): Effect<number, GetNumError, never> => fail(new GetNumError());

const fallback = () => succeed(0);

const program = pipe(
    getNum(),
    map((num: number) => num + 1),
    tap((num: number) => console.log(num))
);

runSync(program);
```

```ts
class GetNumError extends Error {
    public _tag = "GetNumError";
    constructor() {
        super(`💥 Failed to get number`);
    }
}

const getNum = (): Effect<number, GetNumError, never> => fail(new GetNumError());

const fallback = () => succeed(0);

const program = gen(function* () {
    const num = yield* getNum();
    const result = num + 1;
    console.log(result);
    return result;
})

runSync(program);
```

```ts
class GetNumError extends Error {
    public _tag = "GetNumError";
    constructor() {
        super(`💥 Failed to get number`);
    }
}

const getNum = (): Effect<number, GetNumError, never> => fail(new GetNumError());

const fallback = () => succeed(0);

const program = gen(function* () {
    const num = yield* getNum(); // 👈 Execution short-cirtuits here
    const result = num + 1;      
    console.log(result);
    return result;
})

runSync(program);
```

```ts
class GetNumError extends Error {
    public _tag = "GetNumError";
    constructor() {
        super(`💥 Failed to get number`);
    }
}

const getNum = (): Effect<number, GetNumError, never> => fail(new GetNumError());

const fallback = () => succeed(0);

const program = gen(function* () {
    const num = yield* getNum(); // 👈 Execution short-cirtuits here
    const result = num + 1;      // 👈 These won't run
    console.log(result);
    return result;
})

runSync(program);
```

````

<!--
-->

---
---

# Solution #1: use pipe at the end

```ts {monaco-run} {autorun:false}
import { gen, fail, runSync, catchAll, succeed, type Effect } from "./Effect";

class GetNumError extends Error {
    public _tag = "GetNumError";
    constructor() { super(`💥 Failed to get number`); }
}

const getNum = (): Effect<number, GetNumError, never> => fail(new GetNumError());

const fallback = () => succeed(0);

const program = gen(function* () {
    const num = yield* getNum();
    const result = num + 1;
    console.log(result);
    return result;
}).pipe(catchAll(fallback))

console.log(runSync(program));
```

<!--
-->

---
---

# Solution #2: pipe the parts that can fail

```ts {monaco-run} {autorun:false}
import { gen, fail, runSync, catchAll, succeed, pipe, type Effect } from "./Effect";

class GetNumError extends Error {
    public _tag = "GetNumError";
    constructor() { super(`💥 Failed to get number`); }
}

const getNum = (): Effect<number, GetNumError, never> => fail(new GetNumError());

const fallback = () => succeed(0);

const program = gen(function* () {
    const num = yield* pipe(
        getNum(),
        catchAll(fallback)
    );
    return num + 1;
})

console.log(runSync(program));
```

<!--
-->

---
---

# Solution #3: use either

```ts {monaco-run} {autorun:false}
import { gen, fail, runSync, either, isLeft, type Effect } from "./Effect";

class GetNumError extends Error {
    public _tag = "GetNumError";
    constructor() { super(`💥 Failed to get number`); }
}

const getNum = (): Effect<number, GetNumError, never> =>
    fail(new GetNumError());

const program = gen(function* () {
    const result = yield* either(getNum());
    if (isLeft(result)) {
        return 0;
    } else return result.right + 1;
});

console.log(runSync(program));
```

<!--
-->

---
---

# So What's That Funky Fiber Failure Thingy?

```ts {monaco-run} {autorun:false}
import { map, fail, tap, runSync, pipe, catchAll, die, type Effect } from "./Effect";

class GetNumError extends Error {
    constructor() { super(`💥 Failed to get number`); }
}

const getNum = (): Effect<number, Error, never> => fail(new GetNumError())

const program = pipe(
    getNum(),
    catchAll(die),
    map((num: number) => num + 1),
    tap((num: number) => console.log(num))
);

runSync(program);
```

<!--
-->

---
---

# It's an Exit!

```ts {monaco-run} {autorun:false}
import { map, fail, tap, runSyncExit, pipe, catchAll, die, type Effect } from "./Effect";

class GetNumError extends Error {
    constructor() { super(`💥 Failed to get number`); }
}

const getNum = (): Effect<number, Error, never> => fail(new GetNumError())

const program = pipe(
    getNum(),
    catchAll(die),
    map((num: number) => num + 1),
    tap((num: number) => console.log(num))
);

const result = runSyncExit(program);
console.log(result);
```

<!--
Next slide has more info ...
-->

---
---

# What's an Exit?

```ts
declare type Exit<A, E = never> = Success<A, E> | Failure<A, E>
declare interface Success<out A, out E> {
  readonly _tag: "Success"
  readonly value: A
}
declare interface Failure<out A, out E> {
  readonly _tag: "Failure"
  readonly cause: Cause.Cause<E>
}
declare type Cause<E> = Empty | Fail<E> | Die | Interrupt | Sequential<E> | Parallel<E>
```

<ul>
  <li v-click>Either a Success or a Failure</li>
  <li v-click>Failure contains all possbile causes</li>
  <li v-click>The rest are unrecoverable errors</li>
  <li v-click>All effects finish with an Exit</li>
</ul>

<!--
Fail is a recoverable error, the rest are coming from the concurrency model.
-->

---
---

# Questions, Questions ...
  
<div>❓🙋‍♂️ ❔🙋‍♀️</div>

<!--
Next topic is Context management
-->

---
---

# Context Management

> Let's revisit our User example

````md magic-move

```ts
type User = { name: string; };
type UserNotFound = "User Not Found";

type UserRepository = {
    findById: (id: string) => Result<User, UserNotFound>;
    save: (user: { name: string }) => Result<User>;
};

type Deps = { userRepository: UserRepository; };

const CreateUser =
    ({ userRepository }: Deps) =>
    (name: string) => userRepository.save({ name });

const operation = CreateUser({ userRepository });

const result = operation("John Doe");
```

```ts
type User = { name: string; };
type UserNotFound = "User Not Found";

type UserRepository = { // 👈 This is a service that we want to pass around
    findById: (id: string) => Result<User, UserNotFound>;
    save: (user: { name: string }) => Result<User>;
};

type Deps = { userRepository: UserRepository; };

const CreateUser =
    ({ userRepository }: Deps) =>
    (name: string) => userRepository.save({ name });

const operation = CreateUser({ userRepository });

const result = operation("John Doe");
```

```ts
type User = { name: string; };
type UserNotFound = "User Not Found";

type UserRepository = { // 👈 This is a service that we want to pass around
    findById: (id: string) => Result<User, UserNotFound>;
    save: (user: { name: string }) => Result<User>;
};

type Deps = { userRepository: UserRepository; };  // 👈 We describe the dependency

const CreateUser =
    ({ userRepository }: Deps) =>
    (name: string) => userRepository.save({ name });

const operation = CreateUser({ userRepository });

const result = operation("John Doe");
```

```ts
type User = { name: string; };
type UserNotFound = "User Not Found";

type UserRepository = { // 👈 This is a service that we want to pass around
    findById: (id: string) => Result<User, UserNotFound>;
    save: (user: { name: string }) => Result<User>;
};

type Deps = { userRepository: UserRepository; };  // 👈 We describe the dependency

const CreateUser =
    ({ userRepository }: Deps) =>                
    (name: string) => userRepository.save({ name });

const operation = CreateUser({ userRepository }); // 👈 We pass the dependency

const result = operation("John Doe");
```

````

<!--
-->

---
---

# Creating An Effect Service

````md magic-move

```ts
type User = { name: string };
type UserNotFound = "User Not Found";

class UserRepository extends Context.Tag("Service/UserRepository")<
    UserRepository,
    {
        findById: (id: string) => Effect<User, UserNotFound>;
        save: (user: { name: string }) => Effect<User>;
    }
>() {}
```

```ts
type User = { name: string };
type UserNotFound = "User Not Found";

// 👇 We extend Context.Tag
class UserRepository extends Context.Tag("Service/UserRepository")<
    UserRepository,
    {
        findById: (id: string) => Effect<User, UserNotFound>;
        save: (user: { name: string }) => Effect<User>;
    }
>() {}
```

```ts
type User = { name: string };
type UserNotFound = "User Not Found";

// 👇 We extend Context.Tag
class UserRepository extends Context.Tag("Service/UserRepository")<
                                         // 👆 Simulates nominal typing
    UserRepository,
    {
        findById: (id: string) => Effect<User, UserNotFound>;
        save: (user: { name: string }) => Effect<User>;
    }
>() {}
```

```ts
type User = { name: string };
type UserNotFound = "User Not Found";

// 👇 We extend Context.Tag
class UserRepository extends Context.Tag("Service/UserRepository")<
                                         // 👆 Simulates nominal typing
    UserRepository,  // 👈 Identifier of the service
    {
        findById: (id: string) => Effect<User, UserNotFound>;
        save: (user: { name: string }) => Effect<User>;
    }
>() {}
```

```ts
type User = { name: string };
type UserNotFound = "User Not Found";

// 👇 We extend Context.Tag
class UserRepository extends Context.Tag("Service/UserRepository")<
                                         // 👆 Simulates nominal typing
    UserRepository,  // 👈 Identifier of the service
    {                // 👇 Shape of the service
        findById: (id: string) => Effect<User, UserNotFound>;
        save: (user: { name: string }) => Effect<User>;
    }
>() {}
```

````
<!--
All important parts are outlined in the comments, we can click through them.
We can also talk about how this worked in the past and what happens if we don't use unique names.
-->

---
---

# Implementing A Service

````md magic-move

```ts
const InMemoryUserRepository = (users: Map<string, User>): UserRepository => {
    return {
        findById: (id) => {
            const user = users.get(id);
            return user ? success(user) : fail("User Not Found");
        },
        save: (user) => {
            users.set(user.name, user);
            return success(user);
        },
    };
};
```

```ts
const make = sync(() => {
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
    })
})
```

```ts
const make = sync(() => {
    // 👆 We use sync because we need to perform some setup (users)
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
    })
})
```

```ts
const make = sync(() => {
    // 👆 We use sync because we need to perform some setup (users)
    const users = new Map<string, User>();
    return UserRepository.of({ // 👈 of will provide us the "shape"
        findById: (id) => {
            const user = users.get(id);
            return user ? succeed(user) : fail("User Not Found");
        },
        save: (user) => {
            users.set(user.name, user);
            return succeed(user);
        },
    })
})
```

````
<!--
Note that we'll talk about how to inject `users` later.
-->

---
---

# Putting It Together

````md magic-move

```ts
type User = { name: string };
type UserNotFound = "User Not Found";

class UserRepository extends Context.Tag("Service/UserRepository")<
    UserRepository,
    {
        findById: (id: string) => Effect<User, UserNotFound>;
        save: (user: { name: string }) => Effect<User>;
    }
>() {}
```

```ts
class UserRepository extends Context.Tag("Service/UserRepository")<
    UserRepository,
    {
        findById: (id: string) => Effect<User, UserNotFound>;
        save: (user: { name: string }) => Effect<User>;
    }
>() {
    static stub() {
        return make;
    }
}
```

```ts
class UserRepository extends Context.Tag("Service/UserRepository")<
    UserRepository,
    {
        findById: (id: string) => Effect<User, UserNotFound>;
        save: (user: { name: string }) => Effect<User>;
    }
>() {
    // 👇 Since we're using classes we can create a factory method
    static stub() {
        return make;
    }
}
```

````

<!--
Note that we'll talk about how to inject `users` later.
-->

---
---

# Using A Service

```ts {monaco-run} {autorun:false}
import { gen, runSync } from "./Effect";
import { UserRepository } from "./Users";

const CreateUser = (name: string) =>
    gen(function* () {
        const userRepository = yield* UserRepository;

        return yield* userRepository.save({ name });
    });

console.log(runSync(CreateUser("Alice")));
```

<!--
Ask them what will happen when we run this. It will fail (but it will also not compile).
-->

---
---

# Providing Services

> So what's the matter with this code?

````md magic-move

```ts
const CreateUser = (name: string) =>
    gen(function* () {
        const userRepository = yield* UserRepository;

        return yield* userRepository.save({ name });
    });

console.log(runSync(CreateUser("Alice")));
```

```ts
const CreateUser = (name: string) =>
    gen(function* () {
        const userRepository = yield* UserRepository;

        return yield* userRepository.save({ name });
    });

console.log(runSync(CreateUser("Alice")));
// 👆 Type 'UserRepository' is not assignable to type 'never'.
```

```ts
const CreateUser = (name: string) =>
    gen(function* () {
        const userRepository = yield* UserRepository;

        return yield* userRepository.save({ name });
    });

// 💡 We need to provide a service!
console.log(runSync(CreateUser("Alice")));
// 👆 Type 'UserRepository' is not assignable to type 'never'.
```

```ts
const CreateUser = (name: string) =>
    gen(function* () {
        const userRepository = yield* UserRepository;

        return yield* userRepository.save({ name });
    });

// 💡 We need to provide a service!
console.log(runSync(CreateUser("Alice")));
// 👆 Type 'UserRepository' is not assignable to type 'never'.
```

```ts
const CreateUser = (name: string) =>
    gen(function* () {
        const userRepository = yield* UserRepository;

        return yield* userRepository.save({ name });
    });

const program = flow(
    CreateUser,
    provideServiceEffect(UserRepository, UserRepository.stub()),
)

console.log(runSync(program("Alice")));
```

```ts
const CreateUser = (name: string) =>
    gen(function* () {
        const userRepository = yield* UserRepository;

        return yield* userRepository.save({ name });
    });

// 👇 We use flow to expose the parameter to the program
const program = flow(
    CreateUser,
    provideServiceEffect(UserRepository, UserRepository.stub()),
)

console.log(runSync(program("Alice")));
```

```ts
const CreateUser = (name: string) =>
    gen(function* () {
        const userRepository = yield* UserRepository;

        return yield* userRepository.save({ name });
    });

// 👇 We use flow to expose the parameter to the program
const program = flow(
    CreateUser,
    // 👇 We provide the stub service to our effect
    provideServiceEffect(UserRepository, UserRepository.stub()),
)

console.log(runSync(program("Alice")));
```

```ts
const CreateUser = (name: string) =>
    gen(function* () {
        const userRepository = yield* UserRepository;

        return yield* userRepository.save({ name });
    });

// 👇 We use flow to expose the parameter to the program
const program = flow(
    CreateUser,
    // 👇 We provide the stub service to our effect
    provideServiceEffect(UserRepository, UserRepository.stub()),
)

// 👇 Now we can run the program
console.log(runSync(program("Alice")));
```

````

<!--
Note that we could have used `provideService` if `stub` was returning a plain object.
-->

---
---

# Our Service In Action

```ts {monaco-run} {autorun:false}
import { gen, runSync, flow, provideServiceEffect } from "./Effect";
import { UserRepository } from "./Users";

const CreateUser = (name: string) =>
    gen(function* () {
        const userRepository = yield* UserRepository;

        return yield* userRepository.save({ name });
    });

const program = flow(
    CreateUser,
    provideServiceEffect(UserRepository, UserRepository.stub()),
)

console.log(runSync(program("Alice")));
```

<!--
Mention that since we wrap async operations in effect it is no longer relevant whether
the underlying service call is async or not, we can just unwrap its value with yield*
-->

---
---

# How Does This Work?

````md magic-move

```ts
import { gen, runSync, flow, provideServiceEffect } from "./Effect";
import { UserRepository } from "./Users";

const CreateUser = (name: string) =>
    gen(function* () {
        const userRepository = yield* UserRepository;

        return yield* userRepository.save({ name });
    });

const program = flow(
    CreateUser,
    provideServiceEffect(UserRepository, UserRepository.stub()),
)

console.log(runSync(program("Alice")));
```

```ts
import { gen, runSync, flow, provideServiceEffect } from "./Effect";
import { UserRepository } from "./Users";

const CreateUser = (name: string) =>
    gen(function* () {
        const context = yield* Effect.context<UserRepository>();
        const userRepository = Context.get(context, UserRepository);

        return yield* userRepository.save({ name });
    });

const program = flow(
    CreateUser,
    provideServiceEffect(UserRepository, UserRepository.stub()),
)

console.log(runSync(program("Alice")));
```

```ts
import { gen, runSync, flow, provideServiceEffect } from "./Effect";
import { UserRepository } from "./Users";

const CreateUser = (name: string) =>
    gen(function* () {
        // 👇 Effect puts all services into a Context object
        const context = yield* Effect.context<UserRepository>();
        const userRepository = Context.get(context, UserRepository);

        return yield* userRepository.save({ name });
    });

const program = flow(
    CreateUser,
    provideServiceEffect(UserRepository, UserRepository.stub()),
)

console.log(runSync(program("Alice")));
```

```ts
import { gen, runSync, flow, provideServiceEffect } from "./Effect";
import { UserRepository } from "./Users";

const CreateUser = (name: string) =>
    gen(function* () {
        // 👇 Effect puts all services into a Context object
        //    A context is like a service id -> service mapping
        const context = yield* Effect.context<UserRepository>();
        const userRepository = Context.get(context, UserRepository);

        return yield* userRepository.save({ name });
    });

const program = flow(
    CreateUser,
    provideServiceEffect(UserRepository, UserRepository.stub()),
)

console.log(runSync(program("Alice")));
```

```ts
import { gen, runSync, flow, provideServiceEffect } from "./Effect";
import { UserRepository } from "./Users";

const CreateUser = (name: string) =>
    gen(function* () {
        // 👇 Effect puts all services into a Context object
        //    A context is like a service id -> service mapping
        //    Using a context element will add its type to our program
        //    This is why we got a compiler error before
        const context = yield* Effect.context<UserRepository>();
        const userRepository = Context.get(context, UserRepository);

        return yield* userRepository.save({ name });
    });

const program = flow(
    CreateUser,
    provideServiceEffect(UserRepository, UserRepository.stub()),
)

console.log(runSync(program("Alice")));
```

```ts
import { gen, runSync, flow, provideServiceEffect } from "./Effect";
import { UserRepository } from "./Users";

const CreateUser = (name: string) =>
    gen(function* () {
        // 👇 Effect puts all services into a Context object
        //    A context is like a service id -> service mapping
        //    Using a context element will add its type to our program
        //    This is why we got a compiler error before
        const context = yield* Effect.context<UserRepository>();
        // 👇 Now we can get the service from the context
        const userRepository = Context.get(context, UserRepository);

        return yield* userRepository.save({ name });
    });

const program = flow(
    CreateUser,
    provideServiceEffect(UserRepository, UserRepository.stub()),
)

console.log(runSync(program("Alice")));
```

```ts
import { gen, runSync, flow, provideServiceEffect } from "./Effect";
import { UserRepository } from "./Users";

const CreateUser = (name: string) =>
    gen(function* () {
        // 👇 Effect puts all services into a Context object
        //    A context is like a service id -> service mapping
        //    Using a context element will add its type to our program
        //    This is why we got a compiler error before
        const context = yield* Effect.context<UserRepository>();
        // 👇 Now we can get the service from the context
        const userRepository = Context.get(context, UserRepository);

        return yield* userRepository.save({ name });
    });

const program = flow(
    CreateUser,
    provideServiceEffect(UserRepository, UserRepository.stub()),
)

console.log(runSync(program("Alice")));
```

```ts
import { gen, runSync, flow, provideServiceEffect } from "./Effect";
import { UserRepository } from "./Users";

const CreateUser = (name: string) =>
    gen(function* () {
        // 👇 This is a shorthand for the above
        const userRepository = yield* UserRepository;

        return yield* userRepository.save({ name });
    });

const program = flow(
    CreateUser,
    provideServiceEffect(UserRepository, UserRepository.stub()),
)

console.log(runSync(program("Alice")));
```

```ts
import { gen, runSync, flow, provideServiceEffect } from "./Effect";
import { UserRepository } from "./Users";

const CreateUser = (name: string) =>
    gen(function* () {
        // 👇 This is a shorthand for the above
        const userRepository = yield* UserRepository;

        return yield* userRepository.save({ name });
    });

const program = flow(
    CreateUser,
    // 👇 Providing a service erases its type from the requirements
    provideServiceEffect(UserRepository, UserRepository.stub()),
)

console.log(runSync(program("Alice")));
```

```ts
import { gen, runSync, flow, provideServiceEffect } from "./Effect";
import { UserRepository } from "./Users";

const CreateUser = (name: string) =>
    gen(function* () {
        // 👇 This is a shorthand for the above
        const userRepository = yield* UserRepository;

        return yield* userRepository.save({ name });
    });

const program: Effect<User, never, never> = flow(
    CreateUser,
    // 👇 Providing a service erases its type from the requirements
    provideServiceEffect(UserRepository, UserRepository.stub()),
)

console.log(runSync(program("Alice")));
```

```ts
import { gen, runSync, flow, provideServiceEffect } from "./Effect";
import { UserRepository } from "./Users";

const CreateUser = (name: string) =>
    gen(function* () {
        // 👇 This is a shorthand for the above
        const userRepository = yield* UserRepository;

        return yield* userRepository.save({ name });
    });

const program: Effect<User, never, never> = flow(
    CreateUser,
    // 👇 Providing a service erases its type from the requirements
    provideServiceEffect(UserRepository, UserRepository.stub()),
)

// 👇 We can only run a program once all its requirements are satisfied
console.log(runSync(program("Alice")));
```

````

<!--
Here we need to explain that Context is like a Map<ServiceId, ServiceImpl> and adding context elements to our program will add their type to the signature making it all type-safe.
-->

---
---


<img src="/provide_service.jpg" class="m-auto h-auto rounded shadow" />

---
---

# Just Joking...

---
---

# Layers

> Describes the blueprint for the effectful construction of a service

```ts
declare interface Layer<
    in ROut,
    out E = never,
    out RIn = never
>
```

<ul class="mt-4">
  <li v-click>ROut: The service(s) this layer provides</li>
  <li v-click>E: The possible errors that can happen during layer construction</li>
  <li v-click>RIn: The requirements of the layer.</li>
</ul>

<div v-click class="mt-4">❓ Does this look familiar?</div>

```ts {hide|all}
declare interface Effect<out A, out E = never, out R = never>
```

<!--
Ask them what this shape reminds them of before revealing the answer.
-->

---
---

# How Do They Work?

````md magic-move

```ts
class UserRepository extends Context.Tag("Service/UserRepository")<
    UserRepository,
    {
        findById: (id: string) => Effect<User, UserNotFound>;
        save: (user: any) => Effect<User>;
    }
>() {
    static stub() {
        return make;
    }
}
```

```ts
class UserRepository extends Context.Tag("Service/UserRepository")<
    UserRepository,
    {
        findById: (id: string) => Effect<User, UserNotFound>;
        save: (user: any) => Effect<User>;
    }
>() {
    static stub() {
        // 👇 Effectful creation of a layer
        return Layer.effect(UserRepository, make);
    }
}
```

```ts
class UserRepository extends Context.Tag("Service/UserRepository")<
    UserRepository,
    {
        findById: (id: string) => Effect<User, UserNotFound>;
        save: (user: any) => Effect<User>;
    }
>() {
    static stub() {
        // 👇 Effectful creation of a layer
        //    make will only be called once by default
        return Layer.effect(UserRepository, make);
    }
}
```

```ts
// 👇 Our original code
const CreateUser = (name: string) =>
    gen(function* () {
        const userRepository = yield* UserRepository;

        return yield* userRepository.save({ name });
    });

const program = flow(
    CreateUser,
    provideServiceEffect(UserRepository, UserRepository.stub())
);
```

```ts
// 👇 Now with layers
const CreateUser = (name: string) =>
    gen(function* () {
        const userRepository = yield* UserRepository;

        return yield* userRepository.save({ name });
    });

const Services = Layer.mergeAll(UserRepository.stub());

const program = flow(
    CreateUser,
    Effect.provide(Services)
);
```

```ts
const CreateUser = (name: string) =>
    gen(function* () {
        const userRepository = yield* UserRepository;

        return yield* userRepository.save({ name });
    });

const Services: Layer.Layer<UserRepository, never, never> = Layer.mergeAll(
    UserRepository.stub()
);

const program: (name: string) => Effect<User, never, never> = flow(
    CreateUser,
    Effect.provide(Services)
);
```

```ts
const CreateUser = (name: string) =>
    gen(function* () {
        const userRepository = yield* UserRepository;

        return yield* userRepository.save({ name });
    });

// 👇 We merge all the layers into a single layer that we can provide to our program
const Services: Layer.Layer<UserRepository, never, never> = Layer.mergeAll(
    UserRepository.stub()
);

const program: (name: string) => Effect<User, never, never> = flow(
    CreateUser,
    Effect.provide(Services)
);
```

```ts
const CreateUser = (name: string) =>
    gen(function* () {
        const userRepository = yield* UserRepository;

        return yield* userRepository.save({ name });
    });

// 👇 This object can be passed around as a value and provided elsewhere
const Services: Layer.Layer<UserRepository, never, never> = Layer.mergeAll(
    UserRepository.stub()
);

const program: (name: string) => Effect<User, never, never> = flow(
    CreateUser,
    Effect.provide(Services)
);
```

```ts
const CreateUser = (name: string) =>
    gen(function* () {
        const userRepository = yield* UserRepository;

        return yield* userRepository.save({ name });
    });

const Services: Layer.Layer<UserRepository, never, never> = Layer.mergeAll(
    UserRepository.stub()
);

// 👇 We use Effect.provide to provide the merged layer
const program: (name: string) => Effect<User, never, never> = flow(
    CreateUser,
    Effect.provide(Services)
);
```

````

---
---

# Putting It Together
```ts {monaco-run} {autorun:false}
import { gen, flow, Layer, runSync, provide } from "./Effect";
import { UserRepository } from "./Users";

const CreateUser = (name: string) =>
    gen(function* () {
        const userRepository = yield* UserRepository;

        return yield* userRepository.save({ name });
    });

const Services = Layer.mergeAll(UserRepository.layer());

const program = flow(
    CreateUser,
    provide(Services)
);

console.log(runSync(program("Alice")));
```

---
---

# What If My Services Have Dependencies?

---
---

# Let's Revisit Our User Example

````md magic-move

```ts
type User = { id: string; name: string };
type UnsavedUser = { name: string };
type UserNotFound = "User Not Found";

class UserRepository extends Context.Tag("Service/UserRepository")<
    UserRepository,
    {
        // ...
    }
>() { }

export const make = sync(() => {
    const users = new Map<string, User>();
    return UserRepository.of({
        // ...
        save: (user) => {
            // 💥 oops, missing id
            users.set(user.name, user);
            return succeed(user);
        },
    });
});
```

```ts
export class UUIDProvider extends Context.Tag("Service/UUIDProvider")<
    UUIDProvider,
    {
        generate: () => Effect<string>;
    }
>() {
    static live() {
        return sync(() =>
            UUIDProvider.of({
                generate: () => succeed(randomUUID()),
            })
        );
    }

    static layer() {
        return Layer.effect(UUIDProvider, UUIDProvider.live());
    }
}
```

```ts
export class UUIDProvider extends Context.Tag("Service/UUIDProvider")<
    UUIDProvider,
    {
        generate: () => Effect<string>;
    }
>() {
    // 👇 production implementations are called "live" by convention
    static live() {
        return sync(() =>
            UUIDProvider.of({
                generate: () => succeed(randomUUID()),
            })
        );
    }

    static layer() {
        return Layer.effect(UUIDProvider, UUIDProvider.live());
    }
}
```

```ts
export const make = sync(() => {
    const users = new Map<string, User>();
    return UserRepository.of({
        findById: (id) => {
            const user = users.get(id);
            return user ? succeed(user) : fail("User Not Found");
        },
        save: (user) => {
            // 💥 oops, missing id
            users.set(user.name, user);
            return succeed(user);
        },
    });
});
```

```ts
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
```

```ts
export const make = gen(function* () {
    // 👆 We use gen to gain access to yield*
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
```

```ts
export const make = gen(function* () {
    const users = new Map<string, User>();
    // 👇 We get the UUIDProvider from the context
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
```

```ts
export const make = gen(function* () {
    const users = new Map<string, User>();
    const uuidProvider = yield* UUIDProvider;
    return UserRepository.of({
        findById: (id) => {
            const user = users.get(id);
            return user ? succeed(user) : fail("User Not Found");
        },
        save: ({ name }) =>
            // 👇 We use gen to be able to call generate easily
            gen(function* () {
                const id = yield* uuidProvider.generate();
                const user = { id, name };
                users.set(user.id, user);
                return user;
            }),
    });
});
```

```ts
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
                // 👇 We store users by id now
                users.set(user.id, user);
                return user;
            }),
    });
});
```

```ts
export class UserRepository extends Context.Tag("Service/UserRepository")<
    UserRepository,
    {
        findById: (id: string) => Effect<User, UserNotFound>;
        save: (user: UnsavedUser) => Effect<User>;
    }
>() {
    // ...

    static layer() {
        return Layer.effect(UserRepository, make);
    }
}
```

```ts
export class UserRepository extends Context.Tag("Service/UserRepository")<
    UserRepository,
    {
        findById: (id: string) => Effect<User, UserNotFound>;
        save: (user: UnsavedUser) => Effect<User>;
    }
>() {
    // ...

    // 👇 Note the requirement
    static layer(): Layer.Layer<UserRepository, never, UUIDProvider> {
        return Layer.effect(UserRepository, make);
    }
}
```

```ts
export class UserRepository extends Context.Tag("Service/UserRepository")<
    UserRepository,
    {
        findById: (id: string) => Effect<User, UserNotFound>;
        save: (user: UnsavedUser) => Effect<User>;
    }
>() {
    // ...

    static layer(): Layer.Layer<UserRepository, never, UUIDProvider> {
        return Layer.effect(UserRepository, make);
    }

    // 👇 The requirement is gone
    static live(): Layer.Layer<UserRepository, never, never> {
        return pipe(
            UserRepository.layer(),
            Layer.provide(UUIDProvider.layer())
        );
    }
}
```

```ts
export class UserRepository extends Context.Tag("Service/UserRepository")<
    UserRepository,
    {
        findById: (id: string) => Effect<User, UserNotFound>;
        save: (user: UnsavedUser) => Effect<User>;
    }
>() {
    // ...

    static layer(): Layer.Layer<UserRepository, never, UUIDProvider> {
        return Layer.effect(UserRepository, make);
    }

    static live(): Layer.Layer<UserRepository, never, never> {
        return pipe(
            UserRepository.layer(),
            // 👇 Layer.provide will memoize the layer by default
            Layer.provide(UUIDProvider.layer())
        );
    }
}
```

```ts
export class UserRepository extends Context.Tag("Service/UserRepository")<
    UserRepository,
    {
        findById: (id: string) => Effect<User, UserNotFound>;
        save: (user: UnsavedUser) => Effect<User>;
    }
>() {
    // ...

    static layer(): Layer.Layer<UserRepository, never, UUIDProvider> {
        return Layer.effect(UserRepository, make);
    }

    static live(): Layer.Layer<UserRepository, never, never> {
        return pipe(
            UserRepository.layer(),
            // 👇 Effect.provide would not
            Layer.provide(UUIDProvider.layer())
        );
    }
}
```

````

---
---

# Putting It All Together

```ts {monaco-run} {autorun:false}
import { flow, provide, runSync, gen } from "./Effect";
import { UserRepository } from "./UsersV2";

const CreateUser = (name: string) =>
    gen(function* () {
        const userRepository = yield* UserRepository;

        return yield* userRepository.save({ name });
    });

const Services = UserRepository.live();

const program = flow(
    CreateUser,
    provide(Services)
);

console.log(runSync(program("Alice")));
```

<!--
Here well introduce a service dependency for the UserRepository
-->

---
---

# Do We Have A Problem Here?

<blockquote v-click>What if I have a lot of services to yield?</blockquote>

<div v-click class="mt-2">There is a solution!</div>

```ts {hide|all}
declare const serviceFunctions: <S, SE, SR>(
  getService: Effect<S, SE, SR>
) => {
  [k in keyof S as S[k] extends (...args: Array<any>) => Effect<any, any, any> ? k : never]: S[k] extends
    (...args: infer Args) => Effect<infer A, infer E, infer R> ? (...args: Args) => Effect<A, SE | E, SR | R>
    : never
} = effect.serviceFunctions as any
```

<div v-click>🤮</div>


<!--
Using a lot of services will clutter the code with yield* calls. We do have a solution for this: Effect.serviceFunctions. Ask them if they can spot this problem.
-->

---
---

# Using `serviceFunctions`

````md magic-move

```ts
export class UserRepository extends Context.Tag("Service/UserRepository")<
    UserRepository,
    {
        findById: (id: string) => Effect<User, UserNotFound>;
        save: (user: UnsavedUser) => Effect<User>;
    }
>() {
    // ...
}
```

```ts
export class UserRepository extends Context.Tag("Service/UserRepository")<
    UserRepository,
    {
        findById: (id: string) => Effect<User, UserNotFound>;
        save: (user: UnsavedUser) => Effect<User>;
    }
>() {
    // ...
}

const { findById, save } = Effect.serviceFunctions(UserRepository);
```

```ts
export class UserRepository extends Context.Tag("Service/UserRepository")<
    UserRepository,
    {
        findById: (id: string) => Effect<User, UserNotFound>;
        save: (user: UnsavedUser) => Effect<User>;
    }
>() {
    // ...
}

const { 
    // (id: string) => Effect<User, "User Not Found", UserRepository>
    findById,
    // (user: UnsavedUser) => Effect<User, never, UserRepository>
    save
} = Effect.serviceFunctions(UserRepository);
```

```ts
// In our business function ...
const CreateUser = (name: string) =>
    gen(function* () {
        const userRepository = yield* UserRepository;

        return yield* userRepository.save({ name });
    });
```

```ts
const CreateUser = (name: string) =>
    gen(function* () {
        // 👇 We no longer need to yield* the service
        return yield* save({ name });
    });
```

```ts
// Nor the generator
const CreateUser = (name: string) => save({ name })
```

```ts
// 👇 We can further simplify this by ...
export class UserRepository extends Context.Tag("Service/UserRepository")<
    UserRepository,
    {
        findById: (id: string) => Effect<User, UserNotFound>;
        save: (user: UnsavedUser) => Effect<User>;
    }
>() {
    // ...
}

const { findById, save } = Effect.serviceFunctions(UserRepository);
```

```ts
// 👇 using Effect.Tag that automatically adds service functions
export class UserRepository extends Effect.Tag("Service/UserRepository")<
    UserRepository,
    {
        findById: (id: string) => Effect<User, UserNotFound>;
        save: (user: UnsavedUser) => Effect<User>;
    }
>() {
    // ...
}
```

````

<!--
We'll demonstrate how serviceFunctions works, then we'll introduce Effect.Tag instead of Context.Tag
Meniton that without Effect.Tag we could export everything as * from "./UUIDProvider" and then use a barrel import.
-->

---
---

# Putting It All Together

```ts {monaco-run} {autorun:false}
import { flow, runSync, provide } from "./Effect";
import { UserRepository } from "./UsersV2";

const CreateUser = (name: string) => UserRepository.save({ name })

const Services = UserRepository.live();

const program = flow(CreateUser, provide(Services));

console.log(runSync(program("Alice")));
```

---
---

<img src="/yoda_questions.jpg" class="h-100 w-100 m-auto rounded shadow" />

---
---

# Resource Management

> What's a Resource?

```ts {hide|all}
declare interface Scope {
  addFinalizer(finalizer: Finalizer): Effect.Effect<void>
  close(exit: Exit<unknown, unknown>): Effect.Effect<void>
}
declare interface Finalizer = (exit: Exit<unknown, unknown>) => Effect<void>
```

<!--
Ask them what they think a resource is and how they would approach handling them...
-->

---
---

# How To Use Scopes

````md magic-move

```ts
gen(function* () {
     const scope = yield* Scope.make();
     yield* Scope.addFinalizer(scope, Console.log("Finalizer 1"));
     yield* Scope.close(scope, Exit.succeed("scope closed"));
});
```

```ts
gen(function* () {
     // 👇 Creates a new scope
     const scope = yield* Scope.make();
     yield* Scope.addFinalizer(scope, Console.log("Finalizer 1"));
     yield* Scope.close(scope, Exit.succeed("scope closed"));
});
```

```ts
gen(function* () {
     const scope = yield* Scope.make();
     // 👇 A finalizer is executed when the scope is closed
     yield* Scope.addFinalizer(scope, Console.log("Finalizer 1"));
     yield* Scope.close(scope, Exit.succeed("scope closed"));
});
```

```ts
// 👇 No mention of Scope
const program: Effect<void, never, never> = gen(function* () {
     const scope = yield* Scope.make();
     yield* Scope.addFinalizer(scope, Console.log("Finalizer 1"));
     yield* Scope.close(scope, Exit.succeed("scope closed"));
});
```

```ts
// 👇 We need to provide a scope just like a service
const program: Effect<void, never, Scope> = gen(function* () {
    yield* Effect.addFinalizer(() => Console.log("Finalizer 1"));
});
```

```ts
const program: Effect<void, never, Scope> = gen(function* () {
    yield* Effect.addFinalizer(() => Console.log("Finalizer 1"));
});

// 👇 Effect.scoped defines the boundaries of a scope
const scopedProgram: Effect<void, never, never> = Effect.scoped(program);

```

````

<!--
Note that Scope gets added to the requirements of an effect, and can be "provided" by closing it.
-->

---
---

# A Working Example
    
```ts {monaco-run} {autorun:false}
import { gen, runSync, addFinalizer, scoped, succeed } from "./Effect";

const program = gen(function* () {
    yield* addFinalizer(() => {
        console.log("#2");
        return succeed(undefined);
    });
    console.log("#1");
});

runSync(scoped(program))
```

<!--
Ask them what will get printed and why.
-->

---
---


# Nested Scopes
    
```ts {monaco-run} {autorun:false}
import { gen, runSync, addFinalizer, scoped, succeed, pipe } from "./Effect";

const program = gen(function* () {
    yield* pipe(
        addFinalizer(() => {
            console.log("#2");
            return succeed(undefined);
        }),
        scoped
    );
    console.log("#1");
});

runSync(program)
```

<!--
What will it print? Why?
-->

---
---

# Acquire-Release

````md magic-move

```ts
class File { constructor(public name: string) {} }

// 👇 Acquire opens the file for us
const acquire: Effect<File, Error, never> = pipe(
    succeed(new File("file.txt")),
    tap((file: File) => console.log(`Opened: ${file.name}`))
);
```

```ts
class File { constructor(public name: string) {} }

const acquire: Effect<File, Error, never> = pipe(
    succeed(new File("file.txt")),
    tap((file: File) => console.log(`Opened: ${file.name}`))
);

// 👇 Release will be called after we're done with it
const release = (file: File) => {
    console.log(`Released: ${file.name}`);
    return succeed(undefined);
};
```

```ts
class File { constructor(public name: string) {} }

const acquire: Effect<File, Error, never> = pipe(
    succeed(new File("file.txt")),
    tap((file: File) => console.log(`Opened: ${file.name}`))
);

const release = (file: File) => {
    console.log(`Released: ${file.name}`);
    return succeed(undefined);
};

// 👇 acquireRelease makes it sure that both run to completion
const withFile = acquireRelease(acquire, release);
// 👇 convenience function for working with files
const useFile = (fn: (file: File) => Effect<void, never, never>) => withFile.pipe(flatMap(fn));

```

```ts
class File { constructor(public name: string) {} }

const acquire: Effect<File, Error, never> = pipe(
    succeed(new File("file.txt")),
    tap((file: File) => console.log(`Opened: ${file.name}`))
);

const release = (file: File) => {
    console.log(`Released: ${file.name}`);
    return succeed(undefined);
};

const withFile = acquireRelease(acquire, release);
const useFile = (fn: (file: File) => Effect<void, never, never>) => withFile.pipe(flatMap(fn));

// 👇 Here we just call useFile and do our work with it
const program = useFile((file) => succeed(console.log(`Using: ${file.name}`)));

runSync(scoped(program));
```

```ts
class File { constructor(public name: string) {} }

const acquire: Effect<File, Error, never> = pipe(
    succeed(new File("file.txt")),
    tap((file: File) => console.log(`Opened: ${file.name}`))
);

const release = (file: File) => {
    console.log(`Released: ${file.name}`);
    return succeed(undefined);
};

const withFile = acquireRelease(acquire, release);
const useFile = (fn: (file: File) => Effect<void, never, never>) => withFile.pipe(flatMap(fn));

const program = useFile((file) => succeed(console.log(`Using: ${file.name}`)));

// 👇 scoped establishes the scope
runSync(scoped(program));
```

````

---
---

# A Working Example
    
```ts {monaco-run} {autorun:false}
import { tap, runSync, acquireRelease, scoped, succeed, pipe, flatMap, type Effect } from "./Effect";

class File { constructor(public name: string) {} }

const acquire = pipe(
    succeed(new File("file.txt")),
    tap((file: File) => console.log(`Opened: ${file.name}`))
);

const release = (file: File) => {
    console.log(`Released: ${file.name}`);
    return succeed(undefined);
};

const withFile = acquireRelease(acquire, release);
const useFile = (fn: (file: File) => Effect<void, never, never>) => withFile.pipe(flatMap(fn));

const program = useFile((file) => succeed(console.log(`Using: ${file.name}`)));
runSync(scoped(program));
```

---
---

# Acquire-Use-Release
    
```ts {monaco-run} {autorun:false}
import { tap, runSync, acquireUseRelease, scoped, succeed, pipe, flatMap, type Effect } from "./Effect";

class File { constructor(public name: string) {} }

const acquire = pipe(
    succeed(new File("file.txt")),
    tap((file: File) => console.log(`Opened: ${file.name}`))
);
const release = (file: File) => {
    console.log(`Released: ${file.name}`);
    return succeed(undefined);
};
// 👇 Use is passed as a function
const useFile = (file: File) => {
    console.log(`Using file: ${file.name}`);
    return succeed(undefined);
}

// 👇 No explicit scope management
runSync(acquireUseRelease(acquire, useFile, release));
```

---
---

# Before We Move On ...

<div>❓❔ 🙋‍♀️ ❓❔ 🙋‍♂️ ❓❔</div>

---
---

# Introducing Runtime

> The `Runtime<R>` data type represents a Runtime System that can execute effects. To execute any effect, we need a Runtime that includes the necessary requirements for that effect.

```ts
declare interface Runtime<in R> {
  /**
   * The context used as initial for forks
   */
  readonly context: Context.Context<R>
  /**
   * The runtime flags used as initial for forks
   */
  readonly runtimeFlags: RuntimeFlags.RuntimeFlags
  /**
   * The fiber references used as initial for forks
   */
  readonly fiberRefs: FiberRefs.FiberRefs
}
```


<!--
This is where we should discuss that whenever `runSync` was called before we implicitly used a runtime. We can now make it explicit.
We'll discuss some of the details when we talk about concurrency. Here the point is to introduce the concept and to show how a custom runtime is created.
-->

---
---

# What A Runtime Does

<ul>
  <li v-click>Executes Effects</li>
  <li v-click>Handles unexpected errors</li>
  <li v-click>Spawns fibers <em>(discussed later)</em></li>
  <li v-click>Manages fiber interactions</li>
  <li v-click>Ensures finalizers are run appropriately</li>
  <li v-click>Handles asynchronous operations</li>
</ul>

<div v-click class="mt-4">So how do we create one?</div>

---
---

# Creating a Runtime

````md magic-move

```ts
// 👇 We start with an empty layer
const CONTEXT: Layer.Layer<never, never, never> = Layer.empty;
```

```ts
const CONTEXT: Layer.Layer<never, never, never> = Layer.empty;
// 👇 We create a runtime from it
const RUNTIME: ManagedRuntime<never, never> = ManagedRuntime.make(CONTEXT);
```

```ts
const CONTEXT: Layer.Layer<never, never, never> = Layer.empty;
const RUNTIME: ManagedRuntime<never, never> = ManagedRuntime.make(CONTEXT);

// 👇 We write our program
const program = gen(function* () {
    yield* Console.log("Hello, world!");
});
```

```ts
const CONTEXT: Layer.Layer<never, never, never> = Layer.empty;
const RUNTIME: ManagedRuntime<never, never> = ManagedRuntime.make(CONTEXT);

const program = gen(function* () {
    yield* Console.log("Hello, world!");
});

// 👇 We use the runtime to execute it
console.log(RUNTIME.runSync(program));
```

```ts
// 👇 We add services to our context
const CONTEXT: Layer.Layer<UUIDProvider | UserRepository, never, never> = Layer.merge(
    UserRepository.live(),
    UUIDProvider.layer()
);
const RUNTIME: ManagedRuntime<UUIDProvider | UserRepository, never> = 
    ManagedRuntime.make(CONTEXT);

const program = gen(function* () {
    yield* Console.log("Hello, world!");
});

console.log(RUNTIME.runSync(program));
```

```ts
const CONTEXT: Layer.Layer<UUIDProvider | UserRepository, never, never> = Layer.merge(
    UserRepository.live(),
    UUIDProvider.layer()
);
const RUNTIME: ManagedRuntime<UUIDProvider | UserRepository, never> = 
    ManagedRuntime.make(CONTEXT);

// 👇 Then we can use them.
const program = gen(function* () {
    return yield* UserRepository.save({ name: "Alice" });
});


console.log(RUNTIME.runSync(program));
```

````

---
---

# Working Example

```ts {monaco-run} {autorun:false}
import { gen, Layer, ManagedRuntime } from "./Effect";
import { UserRepository, UUIDProvider } from "./UsersV2";

const CONTEXT: Layer.Layer<UUIDProvider | UserRepository, never, never> = Layer.merge(
    UserRepository.live(),
    UUIDProvider.layer()
);
const RUNTIME: ManagedRuntime<UUIDProvider | UserRepository, never> = 
    ManagedRuntime.make(CONTEXT);

const program = gen(function* () {
    return yield* UserRepository.save({ name: "Alice" });
});

console.log(RUNTIME.runSync(program));
```

<!--
Mention that if we'll have time at the end we'll explore some runtime features later such as configuration management and logging.
-->

---
---

# Questions?

<!--
Observability is next ...
-->

---
---

# Observability

<blockquote v-click>
Observability is the ability to measure the internal states of a system by examining its outputs. A system is considered “observable” if the current state can be estimated by only using information from outputs, namely sensor data.
</blockquote>

<div v-click class="mt-4">Topics we'll explore ...</div>

<ul>
  <li v-click>Logging</li>
  <li v-click>Telemetry</li>
  <li v-click>Metrics</li>
  <li v-click>Tracing</li>
</ul>

<!--
Ask them what they think observability is before revealing the definition.
-->

---
---

# Logging In Effect

> Advantages over `console.log`:

<ul class="mt-4">
  <li v-click>Dynamic Log Level Control: choose at what level log messages are displayed</li>
  <li v-click>Custom Logging Output: can create custom loggers, saving to custom locations</li>
  <li v-click>Fine-Grained Logging: different log levels at different parts of the application</li>
  <li v-click>Environment-Based Logging: can be tailored for the needs of the environment</li>
  <li v-click>Additional Features: integrates with telemetry tools</li>
</ul>

<!--
Put some emphasis on the integration with telemetry tools.
-->

---
---

# Example

```ts {monaco-run} {autorun:false}
import { log, runSync, gen } from "./Effect";

const program = gen(function* () {
    yield* log("Hello, world!");
});

runSync(program);
```

<!--
Mention that we'll discuss logging in more detail later if we have time.
-->

---
---

# Metrics

Docs can be found [here](https://effect.website/docs/guides/observability/telemetry/metrics)


<!--
TODO: I don't know much about metrics
-->

---
---

# Tracing

> Tracing in software engineering refers to the process of capturing and recording information about the execution of a software program.

<em v-click>Thanks Wikipedia, you can go home ... 😒</em>

<ul class="mt-4">
  <li v-click>Tracing is a form of observability</li>
  <li v-click>It provides a detailed view of the execution of a program</li>
  <li v-click>Across (micro)services</li>
  <li v-click>Can be used to identify bottlenecks and performance issues</li>
  <li v-click>Can be used to debug complex systems</li>
</ul>


<!--
-->


---
---

# Tracing in Effect: Spans

> A span represents a unit of work or operation. It typically contains:

<ul class="mt-4">
  <li v-click>Name: Describes the operation being tracked.</li>
  <li v-click>Time-Related Data: Timestamps to measure when the operation started and how long it took.</li>
  <li v-click>Structured Log Messages: Records essential information during the operation.</li>
  <li v-click>Metadata (Attributes): Additional data that provides context about the operation.</li>
</ul>


<!--
-->

---
---

# Tracing in Effect: Traces

> A trace records the paths taken by requests as they propagate through the system.

<ul class="mt-4">
  <li v-click>Consists of one or more spans</li>
  <li v-click>The first span is the "root"</li>
  <li v-click>The rest are children of the root</li>
  <li v-click>Usually visualized as a waterfall diagram</li>
</ul>


<!--
-->

---
---

# Tracing in Effect: Traces

<img src="/waterfall-trace.svg" class="m-auto h-auto w-100 h-100 rounded shadow" />


<!--
-->

---
---

# Let's Create A Span

````md magic-move

```ts
// 👇 Our original program
const CONTEXT = Layer.merge(
    UserRepository.live(),
    UUIDProvider.layer()
);
const RUNTIME = ManagedRuntime.make(CONTEXT);

const program = gen(function* () {
    return yield* UserRepository.save({ name: "Alice" });
});

console.log(RUNTIME.runSync(program));
```

```ts
const CONTEXT = Layer.merge(
    UserRepository.live(),
    UUIDProvider.layer()
);
const RUNTIME = ManagedRuntime.make(CONTEXT);

// 👇 With a Span
const program = gen(function* () {
    return yield* UserRepository.save({ name: "Alice" });
}).pipe(withSpan("Save User"));

console.log(RUNTIME.runSync(program));
```

```ts
const CONTEXT = Layer.merge(
    UserRepository.live(),
    UUIDProvider.layer()
);
const RUNTIME = ManagedRuntime.make(CONTEXT);

const program = gen(function* () {
    return yield* UserRepository.save({ name: "Alice" });
}).pipe(withSpan("Save User", {
    // 👇 Custom attribute
    attributes: {
        name: "Alice",
    }
}));

console.log(RUNTIME.runSync(program));
```

```ts
const CONTEXT = Layer.merge(
    UserRepository.live(),
    UUIDProvider.layer()
);
const RUNTIME = ManagedRuntime.make(CONTEXT);

const program = gen(function* () {
    // 👇 Will appear in the trace as an event
    yield* logInfo(`Saving user: Alice`);
    return yield* UserRepository.save({ name: "Alice" });
}).pipe(withSpan("Save User", {
    attributes: {
        name: "Alice",
    }
}));

console.log(RUNTIME.runSync(program));
```

````

<!--
Here we should discuss how the log functions integrate with tracing, and how logs will appear
as events in the trace.
-->

---
---

# Let's Try It Out!

```ts {monaco-run} {autorun:false}
import { gen, Layer, ManagedRuntime, withSpan, logInfo } from "./Effect";
import { UserRepository, UUIDProvider } from "./UsersV2";

const CONTEXT = UserRepository.live();
const RUNTIME = ManagedRuntime.make(CONTEXT);

const program = gen(function* () {
    // 👇 Will appear in the trace as an event
    yield* logInfo(`Saving user: Alice`);
    return yield* UserRepository.save({ name: "Alice" });
}).pipe(withSpan("Save User", {
    attributes: {
        name: "Alice",
    }
}));

console.log(RUNTIME.runSync(program));
```

---
---

# It Is The Same As Before

<div>❓ Why?</div>
<div v-click>💡 We didn't set the corresponding service up!</div>

<!--
Ask them if they have an idea why we don't see any change before revealing the answer
-->

---
---

# Setting Up Tracing

````md magic-move

```ts
const CONTEXT = UserRepository.live();
const RUNTIME = ManagedRuntime.make(CONTEXT);

const program = gen(function* () {
    return yield* UserRepository.save({ name: "Alice" });
}).pipe(withSpan("Save User", {
    attributes: {
        name: "Alice",
    }
}));

console.log(RUNTIME.runSync(program));
```

```ts
// 👇 We use the NodeSdk from @effect/opentelemetry
const NodeSdkLive = NodeSdk.layer(() => ({
  resource: { serviceName: "Workshop" },
  // 👇 And the appropriate processor / exporter from @opentelemetry
  spanProcessor: new BatchSpanProcessor(new ConsoleSpanExporter())
}))

const CONTEXT = UserRepository.live();
const RUNTIME = ManagedRuntime.make(CONTEXT);

const program = gen(function* () {
    return yield* UserRepository.save({ name: "Alice" });
}).pipe(withSpan("Save User", {
    attributes: {
        name: "Alice",
    }
}));

console.log(RUNTIME.runSync(program));
```

```ts
const NodeSdkLive = NodeSdk.layer(() => ({
  resource: { serviceName: "Workshop" },
  spanProcessor: new BatchSpanProcessor(new ConsoleSpanExporter())
}))

// 👇 We add the service to the context
const CONTEXT = Layer.mergeAll(UserRepository.live(), NodeSdkLive);
const RUNTIME = ManagedRuntime.make(CONTEXT);

const program = gen(function* () {
    return yield* UserRepository.save({ name: "Alice" });
}).pipe(withSpan("Save User", {
    attributes: {
        name: "Alice",
    }
}));

console.log(RUNTIME.runSync(program));
```

````

---
---

# A Working Example

```ts {monaco-run} {autorun:false}
import { gen, Layer, ManagedRuntime, withSpan } from "./Effect";
import { UserRepository, UUIDProvider } from "./UsersV2";
import { NodeSdk } from "@effect/opentelemetry";
import { BatchSpanProcessor, ConsoleSpanExporter } from "@opentelemetry/sdk-trace-base";

const NodeSdkLive = NodeSdk.layer(() => ({
  resource: { serviceName: "Workshop" },
  spanProcessor: new BatchSpanProcessor(new ConsoleSpanExporter())
}))

const CONTEXT = Layer.mergeAll(UserRepository.live(), NodeSdkLive);
const RUNTIME = ManagedRuntime.make(CONTEXT);

const program = gen(function* () {
    return yield* UserRepository.save({ name: "Alice" });
}).pipe(withSpan("Save User", {
    attributes: { name: "Alice" }
}));

console.log(RUNTIME.runSync(program));
```

<!--
This will show up in the browser console as an Object. We can also add a logInfo to see it appear in events.
We can also discuss other types of exporters and processors.
-->

---
---


```ts
const program = gen(function* () {

    return yield* Questions.get();

}).pipe(withSpan("Questions", {

    attributes: { name: "Are there?" }

}));
```

---
---

# Data Types In Effect

<!--
Ask them what they think a data type is. Then show them in the next slide ...
-->

---
---

# Option

```ts
export type Option<T>

declare const none = <A = never>(): Option<A>

declare const some: <A>(value: A) => Option<A>
```

<!--
Explain how a data type wraps a value and adds functionality to it (like the decorator pattern).
-->

---
---

# Using Option

````md magic-move

```ts
// 👇 No value
const nothing: Option<never> = Option.none();
```

```ts
// 👇 Some value
const one: Option<number> = Option.some(1);
```

```ts
const oops: Option<never> = Option.fromNullable(null);
```

```ts
// 👇 Type guard
const oops = Option.fromNullable(null);

if(Option.isNone(oops)) {
    console.log("Oops");
}
```

```ts
const one = Option.some(1);

if(Option.isSome(one)) {
    console.log(one.value); // 👈 value is accessible
}
```

```ts
const one = Option.some(1);

pipe(
    one,
    Option.map((n) => n + 1),
)
```

```ts
const one = Option.some(1);

pipe(
    one,
    Option.flatMap((n) => (n > 0 ? Option.some(n + 1) : Option.none()))
);
```

```ts
const one = Option.some(1);

pipe(
    one,
    Option.match({
        onSome: (value) => value + 1,
        onNone: () => 0,
    })
);
```

```ts
const one = Option.some(1);

pipe(
    one,
    Option.getOrElse(() => 0),
);
```

```ts
const one = Option.some(1);

pipe(
    one,
    Option.getOrThrow
);
```

```ts
const one = Option.some(1);

pipe(
    one,
    Option.getOrNull
);
```

```ts
const one = Option.some(1);

pipe(
    one,
    Option.getOrUndefined
);
```

````

---
---

# When To Use Option

<div v-click>Don't</div>

<!--
There is usually some context to why a value is missing so Either is almost always better.
-->


---
---

# Either

```ts
type Either<R, L = never> = Left<L, R> | Right<L, R>

interface Left<out L, out R> {
  readonly _tag: "Left"
  readonly left: L
}

interface Right<out L, out R> {
  readonly _tag: "Right"
  readonly right: R
}
```


<!--
Explain the difference between Option and Either
-->

---
---

# Using Either

````md magic-move

```ts
// 👇 creating
const right: Either<string, never> = Either.right("Hello");
const left: Either<never, Error> = Either.left(new Error("No hello."));
```

```ts
// 👇 type guard
const right: Either<string, never> = Either.right("Hello");

if(Either.isRight(right)) {
    console.log(right.right); // 👈 value is accessible
}
```

```ts
const right = Either.right("Hello");

pipe(
    right,
    Either.map((s) => s + " World"),
)
```

```ts
const num = Either.right(1);

pipe(
    num,
    Either.flatMap((n) =>
        n > 0 ? Either.right(n + 1) : Either.left(new Error("Bad number"))
    )
);
```

```ts
const left = Either.left(new Error("Ooops."));

pipe(
    left,
    // 👇 transforms the error channel
    Either.mapLeft(() => new Error("More detailed oops"))
);
```

```ts
const left = Either.left(new Error("Ooops."));

pipe(
    left,
    // 👇 useful when dealing with 3rd party errors
    Either.mapLeft(() => new Error("More detailed oops"))
);
```

```ts
const left = Either.left(new Error("Ooops."));

pipe(
    left,
    // 👇 maps both channels
    Either.mapBoth({
        onRight: (n) => n + 1,
        onLeft: (e) => e.message,
    })
);
```

```ts
const left = Either.left(new Error("Ooops."));

pipe(
    left,
    // 👇 extracts the value
    Either.match({
        onRight: (n) => n + 1,
        onLeft: (e) => e.message,
    })
)

````

---
---

# When To Use Either

<div v-click>When the operation is synchronous</div>
<div v-click>Or...don't. Just use Effect</div>

<!--
I'd ask here if someone has used fp-ts before, then explain why it was a nightmare to have Reader, ReaderEither, ReaderTask, etc... just use ReaderTaskEither for everything.
-->

---
---

# Converting Between Data Types

````md magic-move

```ts
const some = Option.some("some");
```

```ts
const some = Option.some("some");

pipe(
    some,
    // 👇 Takes an option too!
    Effect.map((s) => s.toUpperCase()),
)
```

```ts
const some = Option.some("some");

pipe(
    some,
    // 👇 Uses _tag to determine what to do
    Effect.map((s) => s.toUpperCase()),
)
```

```ts
// Option<string> -> Effect<string, NoSuchElementException>
const some = Option.none("some");

pipe(
    some,
    Effect.map((s) => s.toUpperCase()),
)
```

````

<!--
-->


---
---

# Utility Types

<!--
We'll look at some utility types such as Duration, List, Chunk, etc
-->

---
---

# Duration

```ts
export interface Duration extends Equal {
    value: DurationValue
}

export type DurationValue =
  | { _tag: "Millis"; millis: number }
  | { _tag: "Nanos"; nanos: bigint }
  | { _tag: "Infinity" }
```

<!--
Mention that we'll look at Equal soon
-->


---
---

# Using Duration

````md magic-move

```ts
// Constructors
Duration.millis(1000);
Duration.seconds(1);
Duration.minutes(1);
//...
```

```ts
// Destructors
Duration.toMillis(Duration.millis(1));
Duration.toSeconds(Duration.seconds(1));
//...
```

```ts
// Operations
Duration.greaterThan(Duration.millis(100));
Duration.lessThan(Duration.millis(100));
Duration.sum(Duration.millis(100), Duration.millis(100));
Duration.times(Duration.millis(100), 2);
//...
```

````

---
---

# Data Structures

> More information can be found [here](https://effect.website/docs/other/data-types)

<ul class="mt-4">
  <li v-click>Array</li>
  <li v-click>List</li>
  <li v-click>Chunk</li>
  <li v-click>HashMap</li>
  <li v-click>HashSet</li>
</ul>

---
---

# Array

> Uses regular arrays, implements utility functions on top of it.

````md magic-move

```ts
// Constructors
Array.fromIterable([1, 2, 3]);
Array.fromRecord({ a: 1, b: 2 });
```

```ts
// Operations
Array.take(Array.range(0, 1000), 10);
Array.append([1, 2, 3], 4)
Array.drop([1, 2, 3], 2)
// ... too many to list here
```

````

---
---

# Chunk

> Chunk is purpose-built to amoritize the cost of repeated concatenation of arrays. Therefore, for use-cases that do not involve repeated concatenation of arrays, the overhead of Chunk will result in reduced performance.

---
---

# Using Chunk

```ts
Chunk.empty();
Chunk.make(1, 2, 3);
Chunk.fromIterable([1, 2, 3]);

// ...
```

---
---

# List

> A data type for immutable linked lists representing ordered collections of elements of type `A`.

<blockquote v-click class="mt-4">Optimal for LIFO, stack-like access patterns</blockquote>

<h4 v-click class="mt-4">Performance</h4>


<p v-click>Time: <code>O(1)</code> prepend and head/tail access. Most other operations are <code>O(n)</code></p>

<p v-click>Space: Implements structural sharing of the tail list. This means that many operations are either zero- or constant-memory cost.</p>


---
---

# HashMap & HashSet

> Immutable variants of `Map` and `Set`

---
---

# Questions?

---
---

# Concurrency

````md magic-move

```ts
// Why doesn't this work?
let i = 0;

setInterval(() => console.log("i", i), 250);
while (true) {
    i++;
}
```

```ts
// Why does this work?
const program = gen(function* () {
    let i = 0;
    yield* pipe(
        suspend(() => Console.log("i", i)),
        repeat(Schedule.spaced(250)),
        fork
    )

    while (true) {
        yield* sync(() => i++);
    }
});
```

````

---
layout: two-cols-header
layoutClass: gap-16
---

# Multitasking

::left::

## Cooperative

<ul>
  <li v-click>How Javascript's event loop works</li>
  <li v-click>A task must yield the control (await)</li>
  <li v-click>Tasks are callbacks</li>
  <li v-click>Uses a trampoline</li>
  <li v-click>Concurrency is cheap</li>
</ul>

::right::

## Preemptive

<ul>
  <li v-click>This is how operataing systems work</li>
  <li v-click>No yielding, the scheduler manages tasks</li>
  <li v-click>Uses interrupts</li>
  <li v-click>Tasks can be paused and resumed</li>
  <li v-click>Tasks are thread-like structures with their own stack</li>
</ul>

---
---

# Effect's Fiber Model

<ul>
  <li v-click>Uses lightweight in-memory threads (fibers)</li>
  <li v-click>Can be spawned thousand-fold</li>
  <li v-click>Runtime representation (instance) of an Effect</li>
  <li v-click>Can be paused, restarted, awaited or interrupted</li>
  <li v-click>Abstracts away sync / async</li>
</ul>

---
---

# How Do Fibers Work?

> With Structured Concurrency

<ul>
  <li v-click>Fibers are arranged in a tree structure</li>
  <li v-click>A parent owns its children</li>
  <li v-click>If a fiber terminates its children are terminated too</li>
  <li v-click>Interruption runs all finalizers</li>
</ul>


---
---

# Why Fibers?

> Alternatives are callbacks or global coroutines

<ul>
  <li v-click>Funcions aren't black boxes, they can leak tasks</li>
  <li v-click>If a task errors who is responsible?</li>
  <li v-click>Who cleans up resources?</li>
  <li v-click>How to stop a task? <em>You can't</em></li>
  <li v-click></li>
</ul>


---
---

# Using Fibers: creation

```ts {monaco-run} {autorun:false}
import { gen, fork, never, runPromise } from "./Effect";

const program = gen(function* () {
    // 👇 this effect will never complete
    // RuntimeFiber<never, never>
    const fiber = yield* fork(never);
    // 👇 but we yield, so our program can continue running
    console.log(fiber.id());
});

await runPromise(program);
```

---
---

# Using Fibers: awaiting

```ts {monaco-run} {autorun:false}
import { gen, fork, succeed, runPromise, Fiber } from "./Effect";

const program = gen(function* () {
    const fiber = yield* fork(succeed(1));
    // 👇 result is an Exit<number, never>
    const result = yield* Fiber.await(fiber);
    console.log(result);
});

await runPromise(program);
```

---
---

# Using Fibers: joining

```ts {monaco-run} {autorun:false}
import { gen, fork, succeed, runPromise, Fiber } from "./Effect";

const program = gen(function* () {
    const fiber = yield* fork(succeed(1));
    // 👇 result is a number
    const result = yield* Fiber.join(fiber);
    console.log(result);
});

await runPromise(program);
```

---
---

# Looking At The Original Example

````md magic-move

```ts
const program = gen(function* () {
    let i = 0;
    yield* pipe(
        // 👇 suspends the effect to be executed later
        suspend(() => Console.log("i", i)),
        repeat(Schedule.spaced(250)),
        fork
    )

    while (true) {
        yield* sync(() => i++);
    }
});
```

```ts
const program = gen(function* () {
    let i = 0;
    yield* pipe(
        suspend(() => Console.log("i", i)),
        // 👇 executes the effect every 250ms
        repeat(Schedule.spaced(250)),
        fork
    )

    while (true) {
        yield* sync(() => i++);
    }
});
```

```ts
const program = gen(function* () {
    let i = 0;
    yield* pipe(
        suspend(() => Console.log("i", i)),
        repeat(Schedule.spaced(250)),
        // 👇 Creates a new fiber to run the schedule
        fork
    )

    while (true) {
        yield* sync(() => i++);
    }
});
```

```ts
const program = gen(function* () {
    let i = 0;
    yield* pipe(
        suspend(() => Console.log("i", i)),
        repeat(Schedule.spaced(250)),
        fork
    )

    // 👇 This will keep running in the main fiber
    while (true) {
        yield* sync(() => i++);
    }
});
```

````

---
---

# Trying It Out

```ts {monaco-run} {autorun:false}
import { gen, fork, runPromise, Console, suspend, repeat, Schedule, sync, pipe } from "./Effect";
const program = gen(function* () {
    let i = 0;
    yield* pipe(
        suspend(() => Console.log("i", i)),
        repeat(Schedule.spaced(250)),
        // 👇 What happens if we remove fork?
        fork
    )

    // What happens if we remove this?
    while (true) {
        yield* sync(() => i++);
    }
});

runPromise(program);
```

<!--
If we remove the fork it will run in the main fiber, so the while loop won't.
Also, if we remove the while loop, the program will terminate immediately
terminating the forked fiber too.
-->

---
---

# Fiber To Fiber Communication

<ul>
  <li v-click>Deferred -> one-shot channel that can error</li>
  <li v-click>Queue -> standard channel with backpressure (can only poll once)</li>
  <li v-click>PubSub -> publishes to possibly multiple subscribers (every subscriber gets its own instance)</li>
</ul>

---
---

# YAGNI

```ts {monaco-run} {autorun:false}
import { gen, runPromise, fail, all, sleep } from "./Effect";

const fiddleAround = (ms: number) => gen(function* () {
    yield* sleep(ms);
    return ms;
});

const program = all([fiddleAround(500), fiddleAround(1000), fiddleAround(1500)], {
    // or "inherit", or number
    concurrency: "unbounded",
    // or "either" or "validate"
    mode: "default",
});

console.log(await runPromise(program));
```

<!--
Mention that most of these are not needed for most applications because the relevant effect operations have built-in concurrency settings (like Effect.all).
We mentioned this a while ago.
-->


---
---

# Best Practices












---
---

# Other Topics

> Other features of Effect

**TODO**

<ul>
  <li v-click>Traits: Equal & Hash</li>
  <li v-click>Data</li>
  <li v-click>Branded Types</li>
  <li v-click>Config Management</li>
  <li v-click>Useful Functions (zip, zipLeft, zipRight, andThen)</li>
  <li v-click>Creating a Context manually</li>
  <li v-click>Using Deferred</li>
  <li v-click>Schema</li>
  
</ul>