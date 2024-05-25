# Effect Workshop

## Best Practices

-   Don't run effects in effects
-   Function composition enables tree shaking
-   Use `Effect` everywhere where it makes sense (don't use `Either`, `Option` if it is not necessary)
-   `Either`/`Option` makes sense when interoping with non-effect code
-   `Effect` is lazy, `Option` and `Either` are eager
-   `Effect.*` functions accept `Option`/`Either` as parameters (overload)
-   Don't block the executor (no `while(true)`)
-   Whenever something is not clear check the type signatures

## Extras

## Traits

Like an `Iterator`

-   Equal
    -   Can be used to implement deep equality
-   Hash
-   Data
    -   `Data.case` -> Implements `Equal` and `Hash` for you
    -   `Data.class` -> Same but with classes
    -   `Data.TaggedClass` -> Same but adds a tag
    -   `Data.TaggedEnum` -> Unions of case classes
    -   `Data.TaggedError` -> can `yield*` errors (no wrap)
-   Branded types
    -   Creates distinct types that are specializations of primitive types
    -   Created with a constructor function that validates the input (eg `NonNegativeNumber`)
    -   Use `Brand.Brand<"<name>">
    -   Brand.nominal -> empty constructor function
    -   Brand.refined -> constructor with validation
        -> use `Brand.error` to signal an error

## Testing ???

## Config Management ???

## How to handle nesting

-   Use `gen`
-   Use `Do`

## Useful functions

-   `zip`: 2 effects -> 2 results in tuple
-   `zipLeft`: 2 effects -> result of left
-   `zipRight`: 2 effects -> result of right
-   `flatMap` vs `zipRight` (depend or don't depend on result of previous result)
-   `tap` vs `zipLeft`
-   `andThen` -> combination of above
-   Effect.all (with `mode`)

### Creating a `Context` manually

-   `Context.empty`
-   `pipe` + `Context.add`

### Using Deferred To Create a CountDownLatch

### Schema

-   Explain `<A, I, R>`
-   Simple types like `S.number`
-   transform / S.transformOrFail
-   Input: S.To
-   Output: `S.From`
-   is -> synchronous
-   asserts -> throws
-   validate -> Effectful validation
-   encode / encodeSync / encodeEither / encodePromise / encodeOption
-   decode ... -> does only transformation
-   encodeUnknown ... -> does validation too
-   decodeUnknown ... -> does validation too
-   struct, union, array
