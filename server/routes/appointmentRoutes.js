const express = require("express");
const Appointment = require("../models/Appointment");
const User = require("../models/User");

const router = express.Router();

// BOOK APPOINTMENT
router.post("/", async (req, res) => {
  try {
    const {
      patientId,
      doctorId,
      date,
      time,
      reason,
    } = req.body;

    if (!patientId || !doctorId || !date || !time) {
      return res.status(400).json({
        message:
          "Patient, doctor, date and time are required",
      });
    }

    const doctor = await User.findOne({
      _id: doctorId,
      role: "doctor",
      available: true,
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found or unavailable",
      });
    }

    const existingAppointment =
      await Appointment.findOne({
        doctor: doctorId,
        date,
        time,
        status: {
          $in: ["pending", "confirmed"],
        },
      });

    if (existingAppointment) {
      return res.status(400).json({
        message:
          "This time slot is already booked",
      });
    }

    const appointment = await Appointment.create({
      patient: patientId,
      doctor: doctorId,
      date,
      time,
      reason,
    });

    const populatedAppointment =
      await Appointment.findById(
        appointment._id
      )
        .populate(
          "doctor",
          "name specialization experience"
        )
        .populate(
          "patient",
          "name email phone"
        );

    res.status(201).json({
      message:
        "Appointment booked successfully ✅",
      appointment: populatedAppointment,
    });
  } catch (error) {
    console.error(
      "Appointment booking error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to book appointment",
    });
  }
});

// GET PATIENT APPOINTMENTS
router.get(
  "/patient/:patientId",
  async (req, res) => {
    try {
      const appointments =
        await Appointment.find({
          patient: req.params.patientId,
        })
          .populate(
            "doctor",
            "name specialization experience"
          )
          .sort({ date: 1, time: 1 });

      res.json({
        appointments,
      });
    } catch (error) {
      console.error(
        "Patient appointments error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch appointments",
      });
    }
  }
);

// GET DOCTOR APPOINTMENTS
router.get(
  "/doctor/:doctorId",
  async (req, res) => {
    try {
      const appointments =
        await Appointment.find({
          doctor: req.params.doctorId,
        })
          .populate(
            "patient",
            "name email phone"
          )
          .sort({ date: 1, time: 1 });

      res.json({
        appointments,
      });
    } catch (error) {
      console.error(
        "Doctor appointments error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch appointments",
      });
    }
  }
);

// CANCEL APPOINTMENT
router.patch(
  "/:id/cancel",
  async (req, res) => {
    try {
      const appointment =
        await Appointment.findByIdAndUpdate(
          req.params.id,
          {
            status: "cancelled",
          },
          {
            new: true,
          }
        )
          .populate(
            "doctor",
            "name specialization"
          )
          .populate(
            "patient",
            "name email phone"
          );

      if (!appointment) {
        return res.status(404).json({
          message:
            "Appointment not found",
        });
      }

      res.json({
        message:
          "Appointment cancelled successfully",
        appointment,
      });
    } catch (error) {
      console.error(
        "Cancel appointment error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to cancel appointment",
      });
    }
  }
);

// UPDATE APPOINTMENT STATUS
router.patch(
  "/:id/status",
  async (req, res) => {
    try {
      const { status } = req.body;

      const allowedStatuses = [
        "pending",
        "confirmed",
        "completed",
        "cancelled",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message:
            "Invalid appointment status",
        });
      }

      const appointment =
        await Appointment.findByIdAndUpdate(
          req.params.id,
          { status },
          { new: true }
        )
          .populate(
            "doctor",
            "name specialization"
          )
          .populate(
            "patient",
            "name email phone"
          );

      if (!appointment) {
        return res.status(404).json({
          message:
            "Appointment not found",
        });
      }

      res.json({
        message:
          "Appointment status updated successfully",
        appointment,
      });
    } catch (error) {
      console.error(
        "Status update error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to update appointment",
      });
    }
  }
);
// ARCHIVE COMPLETED APPOINTMENT FOR DOCTOR VIEW
router.patch(
  "/:id/archive",
  async (req, res) => {
    try {
      const appointment =
        await Appointment.findOneAndUpdate(
          {
            _id: req.params.id,
            status: "completed",
          },
          {
            archivedByDoctor: true,
          },
          {
            new: true,
          }
        )
          .populate(
            "doctor",
            "name specialization"
          )
          .populate(
            "patient",
            "name email phone"
          );

      if (!appointment) {
        return res.status(404).json({
          message:
            "Completed appointment not found",
        });
      }

      res.json({
        message:
          "Appointment removed from doctor view",
        appointment,
      });
    } catch (error) {
      console.error(
        "Archive appointment error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to archive appointment",
      });
    }
  }
);
// GET ARCHIVED COMPLETED APPOINTMENTS FOR DOCTOR
router.get(
  "/doctor/:doctorId/archived",
  async (req, res) => {
    try {
      const appointments =
        await Appointment.find({
          doctor: req.params.doctorId,
          status: "completed",
          archivedByDoctor: true,
        })
          .populate(
            "patient",
            "name email phone"
          )
          .sort({ date: -1, time: -1 });

      res.json({
        appointments,
      });
    } catch (error) {
      console.error(
        "Archived appointments error:",
        error
      );

      res.status(500).json({
        message:
          "Failed to fetch archived appointments",
      });
    }
  }
);

module.exports = router;