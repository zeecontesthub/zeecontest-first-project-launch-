import express from "express";
import {
  createContest,
  editContest,
  addVoter,
  deleteContest,
  getOrganizerContests,
  getContestById,
  updateContestStatus,
  updateContestant,
  deleteContestant,
} from "../controllers/contestController.js";

const router = express.Router();

router.post("/create-contest", createContest);
router.put("/edit/:contestId", editContest);
router.post("/:contestId/add-voter", addVoter);
router.delete("/:contestId", deleteContest);
router.get("/organizer/:organizerId", getOrganizerContests);
router.get("/:contestId", getContestById);
router.put("/:contestId/status", updateContestStatus);
router.put("/:contestId/contestant/:contestantId", updateContestant);
router.delete("/:contestId/contestant/:contestantId", deleteContestant);

export default router;
