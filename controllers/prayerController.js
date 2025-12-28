const Prayer = require("../models/Prayer");

/* CREATE PRAYER */
exports.createPrayer = async (req, res) => {
  const prayer = await Prayer.create(req.body);
  res.status(201).json({
    message: "Prayer request submitted",
    prayer,
  });
};

/* GET PRAYERS (ADMIN) */
exports.getPrayers = async (req, res) => {
  const prayers = await Prayer.find().sort({ createdAt: -1 });
  res.json(prayers);
};

/* UPDATE STATUS */
exports.updatePrayerStatus = async (req, res) => {
  await Prayer.findByIdAndUpdate(req.params.id, {
    status: req.body.status,
  });
  res.json({ message: "Prayer status updated" });
};
