const express = require("express");
const User = require("../models/User");

const router = express.Router();

// GET ALL AVAILABLE DOCTORS
router.get("/", async (req, res) => {
  try {
    const { specialization } = req.query;

    const filter = {
      role: "doctor",
      available: true,
    };

    if (specialization) {
      filter.specialization = {
        $regex: specialization,
        $options: "i",
      };
    }

    const doctors = await User.find(filter)
      .select("-password")
      .sort({ experience: -1 });

    res.json({
      doctors,
    });
  } catch (error) {
    console.error("Doctor fetch error:", error);

    res.status(500).json({
      message: "Failed to fetch doctors",
    });
  }
});

module.exports = router;