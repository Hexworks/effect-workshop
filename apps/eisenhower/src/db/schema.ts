import { relations } from "drizzle-orm";
import {
    boolean,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    varchar,
} from "drizzle-orm/pg-core";
import { Importance, Urgency } from "../domain";

export const urgency = pgEnum("urgency", [Urgency.URGENT, Urgency.NOT_URGENT]);
export const importance = pgEnum("importance", [
    Importance.IMPORTANT,
    Importance.NOT_IMPORTANT,
]);

export const matrices = pgTable(
    "matrices",
    {
        id: varchar("id", { length: 128 }).notNull().primaryKey(),
        name: text("name").notNull(),
    },
    (matrices) => ({
        nameIdx: uniqueIndex("nameIdx").on(matrices.name),
    })
);

export const matrixRelations = relations(matrices, ({ many }) => ({
    tasks: many(tasks),
}));

export const tasks = pgTable("tasks", {
    id: varchar("id", { length: 128 }).notNull().primaryKey(),
    name: text("name").notNull(),
    completed: boolean("completed").notNull(),
    dueDate: timestamp("due_date", {
        precision: 6,
        withTimezone: true,
    }).notNull(),
    urgency: urgency("urgency").notNull(),
    importance: importance("importance").notNull(),
    matrixId: varchar("matrix_id", { length: 128 }).notNull(),
});

export const taskRelations = relations(tasks, ({ one }) => ({
    author: one(matrices, {
        fields: [tasks.matrixId],
        references: [matrices.id],
    }),
}));
