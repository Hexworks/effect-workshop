import { defineWorkspace } from "vitest/config";

const usePackage = ({
    namespace,
    id,
    type,
}:
    | {
          namespace?: undefined;
          id: string;
          type: "apps";
      }
    | {
          namespace: string;
          id: string;
          type: "packages";
      }) => {
    const dir =
        type === "packages" ? `${type}/${namespace}/${id}` : `${type}/${id}`;
    const name = type === "packages" ? `${namespace}/${id}` : id;

    return {
        test: {
            include: [`${dir}/test/**/*.spec.ts`],
            exclude: [],
            name,
            environment: "node",
            alias: {
                [`@${name}`]: new URL(`${dir}/src`, import.meta.url).pathname,
            },
        },
    };
};

export default defineWorkspace([
    usePackage({ namespace: "shared", id: "utils", type: "packages" }),
    usePackage({ namespace: "test", id: "utils", type: "packages" }),
    usePackage({ id: "eisenhower", type: "apps" }),
]);
