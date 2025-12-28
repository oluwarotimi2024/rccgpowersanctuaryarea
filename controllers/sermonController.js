const Sermon = require("../models/Sermon");

/* CREATE SERMON */
exports.createSermon = async (req, res) => {
  try {
    const sermon = await Sermon.create({
      title: req.body.title,
      preacher: req.body.preacher,
      category: req.body.category,
      description: req.body.description,
      mediaType: req.body.mediaType,
      file: req.file.path,
    });

    res.status(201).json(sermon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* GET ALL SERMONS */
exports.getSermons = async (req, res) => {
  const sermons = await Sermon.find().sort({ createdAt: -1 });
  res.json(sermons);
};

/* DELETE SERMON */
exports.deleteSermon = async (req, res) => {
  await Sermon.findByIdAndDelete(req.params.id);
  res.json({ message: "Sermon deleted" });
};
