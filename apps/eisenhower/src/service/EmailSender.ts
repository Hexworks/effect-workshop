import { Tag, type Effect } from "effect/Effect";

type Email = {
    address: string;
    content: string;
};

export class EmailSender extends Tag("Service/EmailSender")<
    EmailSender,
    {
        sendEmail: (email: Email) => Effect<Buffer>;
    }
>() {}
