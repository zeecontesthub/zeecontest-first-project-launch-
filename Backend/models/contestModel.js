import mongoose from "mongoose";

const participantSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    bio: { type: String },
    image: { type: String },
    position: { type: String }, // Position title
    // Add more fields for position as needed (e.g., description, requirements)
  },
  { _id: true }
); // <-- ensures _id is included

const voterSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    votingDate: { type: Date, default: Date.now },
    votedFor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Participant",
    }, // references participant _id
  },
  { _id: true }
);

const positionSchema = new mongoose.Schema({
  name: { type: String },
  voters: [
    {
      name: { type: String },
      email: { type: String },
      votingDate: { type: Date, default: Date.now },
      votedFor: {
        type: mongoose.Schema.Types.ObjectId,
      }, // references participant _id
    },
    { _id: true },
  ],
  contestants: [
    {
      name: { type: String },
      email: { type: String },
      bio: { type: String },
      image: { type: String },
      position: { type: String }, // Position title
    },
    { _id: true },
  ], // Array of contestants for this position
  description: { type: String },
});

const contestSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Contest Name
  type: { type: String },
  description: { type: String }, // Contest Description
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  firebaseUid: { type: String, required: true }, // From userModel
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  startTime: {
    startTimeHour: { type: String },
    startTimeMinute: { type: String },
    startTimeAmPm: { type: String, default: "AM" },
  }, // e.g., "08:00 AM"
  endTime: {
    endTimeHour: { type: String },
    endTimeMinute: { type: String, default: "00" },
    endTimeAmPm: { type: String, default: "AM" },
  }, // e.g., "05:00 PM"
  coverImageUrl: { type: String },
  contestLogoImageUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  participants: [participantSchema], // Array of participants
  positions: [positionSchema], // Array of positions
  voters: [voterSchema], // <-- Add this line
  payment: {
    isPaid: { type: Boolean, default: false },
    amount: { type: Number, default: 0 }, // Amount in cents
  },
  allowMultipleVotes: {
    type: Boolean,
    default: false, // Allow multiple votes per voter
  },
  status: {
    type: String,
    default: "draft",
  },
  contestPaid: {
    type: Boolean,
    default: false, // Allow multiple votes per voter
  },
});

const Contest = mongoose.model("Contest", contestSchema);

export default Contest;
