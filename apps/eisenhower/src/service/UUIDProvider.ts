import { Tag, type Effect } from "effect/Effect";

export class UUIDProvider extends Tag("Service/UUIDProvider")<
    UUIDProvider,
    {
        generate: () => Effect<string>;
    }
>() {}
