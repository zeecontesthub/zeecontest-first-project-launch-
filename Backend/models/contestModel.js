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
    addedDate: { type: Date, default: Date.now },
    votedFor: [
      {
        positionTitle: { type: String },
        votedFor: { type: mongoose.Schema.Types.ObjectId }, // references participant _id
        name: { type: String },
        image: { type: String },
      },
    ], // references participant _id
    multiplier: { type: Number, default: 0 },
    code: { type: Number },
  },
  { _id: true }
);

const positionSchema = new mongoose.Schema({
  name: { type: String },
  voters: [
    {
      name: { type: String },
      email: { type: String },
      addedDate: { type: Date, default: Date.now },
      votedFor: {
        type: mongoose.Schema.Types.ObjectId,
      }, // references participant _id
      multiplier: { type: Number, default: 0 },
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
  startDate: { type: Date },
  endDate: { type: Date },
  startTime: {
    startTimeHour: { type: String, default: "00" }, // e.g., "08"
    startTimeMinute: { type: String, default: "00" },
    startTimeAmPm: { type: String, default: "AM" },
  }, // e.g., "08:00 AM"
  endTime: {
    endTimeHour: { type: String, default: "12" }, // e.g., "05"
    endTimeMinute: { type: String, default: "00" },
    endTimeAmPm: { type: String, default: "AM" },
  }, // e.g., "05:00 PM"
  coverImageUrl: { type: String },
  contestLogoImageUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  participants: [participantSchema], // Array of participants
  positions: [positionSchema], // Array of positions
  closedContestVoters: [voterSchema], // <-- Add this line
  payment: {
    isPaid: { type: Boolean, default: false },
    amount: { type: Number, default: 0 }, // Amount in cents
    isWithdrawn: { type: Boolean, default: false },
    paymentDate: { type: Date, default: null },
  },
  allowMultipleVotes: {
    type: Boolean,
    default: false, // Allow multiple votes per voter
  },
  status: {
    type: String,
    default: "draft",
  },
  isClosedContest: { type: Boolean, default: false },
  socialLinks: {
    instagram: { type: String, default: '' },
    x: { type: String, default: '' },
    website: { type: String, default: '' },
  },
  // Add more fields as needed
});

const Contest = mongoose.model("Contest", contestSchema);

export default Contest;
