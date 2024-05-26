import { Context } from "effect";
import { Tag, type TagClassShape } from "effect/Context";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ServiceOf<T extends Tag<any, any> | TagClassShape<any, any>> =
    Context.Tag.Service<T>;