import { Express, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import yaml from "js-yaml";
import fs from "fs";
import path from "path";

function swaggerDocs(app: Express, port: number) {
    try {
        const possiblePaths = [
            path.join(process.cwd(), "src/docs/openapi.yaml"),
            path.join(process.cwd(), "apps/server/src/docs/openapi.yaml"),
            path.join(__dirname, "../docs/openapi.yaml"),
            path.join(__dirname, "../../src/docs/openapi.yaml"),
        ];

        let yamlPath = "";
        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                yamlPath = p;
                break;
            }
        }

        if (!yamlPath) {
            console.error("Could not find openapi.yaml in any of the expected locations.");
            return;
        }

        const fileContents = fs.readFileSync(yamlPath, "utf8");
        const swaggerSpec = yaml.load(fileContents);

        app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec as any));

        app.get("/docs.json", (req: Request, res: Response) => {
            res.setHeader("Content-Type", "application/json");
            res.status(200).json(swaggerSpec);
        });

        console.log(`✅ API Documentation loaded from: ${yamlPath}`);
        console.log(`🚀 Docs available at http://localhost:${port}/docs`);
    } catch (error) {
        console.error("💥 Error loading swagger documentation:", error);
    }
}

export default swaggerDocs;
