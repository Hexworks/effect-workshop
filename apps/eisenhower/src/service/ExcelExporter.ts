import { Tag, type Effect } from "effect/Effect";

export class ExcelExporter extends Tag("Service/ExcelExporter")<
    ExcelExporter,
    {
        export: (matrixId: string, path: string) => Effect<void>;
    }
>() {}
