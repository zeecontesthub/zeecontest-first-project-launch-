import express from "express";
import {
  createContest,
  editContest,
  addVoter,
  deleteContest,
  getOrganizerContests,
} from "../controllers/contestController.js";

const router = express.Router();

router.post("/create-contest", createContest);
router.put("/edit/:contestId", editContest);
router.post("/:contestId/add-voter", addVoter);
router.delete("/:contestId", deleteContest);
router.get("/organizer/:organizerId", getOrganizerContests);

export default router;
