const Message = require("../models/Message");

/* CREATE MESSAGE */
exports.createMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // 1. Manual check: If name is missing, stop here and tell the user
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // 2. Try to save the message
    const msg = await Message.create({ name, email, message });

    res.status(201).json({
      message: "Message sent successfully",
      msg,
    });
  } catch (error) {
    // 3. The Safety Net: If the database complains, the server won't crash!
    console.error("Error saving message:", error.message);
    res.status(500).json({ error: "Could not save message" });
  }
};

/* GET MESSAGES (ADMIN) */
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

/* DELETE MESSAGE */
exports.deleteMessage = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete message" });
  }
};