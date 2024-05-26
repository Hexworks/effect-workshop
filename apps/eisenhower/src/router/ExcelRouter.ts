import { Router } from "express";

type ExportParams = {
    matrixId: string;
    path: string;
};

export const make = () => {
    const router = Router();

    router.post(`/`, async (req, res) => {
        // TODO:
        const { matrixId, path }: ExportParams = req.body;
        console.log("Generating excel export");
        res.status(501);
        res.json({
            path,
        });
    });

    return router;
};
