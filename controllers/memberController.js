const Member = require("../models/Member");

/* REGISTER MEMBER */
exports.registerMember = async (req, res) => {
  const member = await Member.create(req.body);
  res.status(201).json({
    message: "Membership registration successful",
    member,
  });
};

/* GET MEMBERS (ADMIN) */
exports.getMembers = async (req, res) => {
  const members = await Member.find().sort({ createdAt: -1 });
  res.json(members);
};

/* DELETE MEMBER */
exports.deleteMember = async (req, res) => {
  await Member.findByIdAndDelete(req.params.id);
  res.json({ message: "Member deleted" });
};
