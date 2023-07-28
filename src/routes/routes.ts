// routes.ts
import { Router } from "express";
import { identifyContact } from "../controllers/contact.controller";

const router = Router();

// Endpoint to handle /identify POST requests
router.post("/identify", identifyContact);

export default router;
