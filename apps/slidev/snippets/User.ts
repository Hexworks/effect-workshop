import { Result } from "./Result";

export type User = { name: string };
export type UserNotFound = "User Not Found";

export type UserRepository = {
    findById: (id: string) => Result<User, UserNotFound>;
    save: (user: any) => Result<User>;
};

export type Deps = { userRepository: UserRepository };

export const CreateUser =
    ({ userRepository }: Deps) =>
    (name: string) =>
        userRepository.save({ name });

