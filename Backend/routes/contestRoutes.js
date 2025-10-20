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
  addVote,
  getAllContests,
  addVoters,
  deleteVoter,
  addVerifyVote,
  verifyPayment,
  getUserWallet,
  withdrawal,
} from "../controllers/contestController.js";
import { getComments, addComment, getAllCommentsForContest } from "../controllers/commentController.js";

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
router.post("/:contestId/add-vote", addVote);
router.get("/get-contests/contests", getAllContests);

//open-contest
router.post("/contests/:contestId/add-vote", addVote);

// closed contest
router.post("/contests/:contestId/voters", addVoters);
router.post("/contests/:contestId/addVerifyVote", addVerifyVote);
router.delete("/contests/:contestId/voters/:voterId", deleteVoter);

/**
 * POST /api/paystack/verify
 * Body: { reference: string }
 */
router.post("/verify-payment", verifyPayment);

router.get("/get-user-wallet/user-wallet", getUserWallet);

router.post("/withdraw/:uid", withdrawal);

// Comment routes
router.get("/:contestId/contestants/:contestantId/comments", getComments);
router.post("/:contestId/contestants/:contestantId/comments", addComment);
router.get("/:contestId/comments", getAllCommentsForContest);

export default router;
