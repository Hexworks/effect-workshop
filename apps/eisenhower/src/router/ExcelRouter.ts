import { Router } from "express";

type ExportParams = {
    path: string;
};

export const make = () => {
    const router = Router();

    router.post(`/`, async (req, res) => {
        // TODO:
        console.log("Generating excel export");
        const { path }: ExportParams = req.body;
        res.status(501);
        res.json({
            path,
        });
    });

    return router;
};
