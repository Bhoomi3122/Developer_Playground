const CodeSnippet = require('../Models/Code');

exports.saveCode = async (req, res) => {
  const { name, tags, html, css, js } = req.body;

  try {
    // Check if a code snippet with the same name already exists for this user
    const existingCode = await CodeSnippet.findOne({ user: req.user.id, name });

    if (existingCode) {
      // Code snippet with this name already exists
      return res.status(400).json({ message: 'Code snippet with this name is already saved.' });
    }

    const newCode = new CodeSnippet({
      user: req.user.id,
      name,
      tags,
      html,
      css,
      js,
    });

    const savedCode = await newCode.save();
    res.status(201).json(savedCode);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};


exports.getUserCodes = async (req, res) => {
  try {
    const codes = await CodeSnippet.find({ user: req.user.id }).sort({ createdAt: -1 });

    const formattedCodes = codes.map((code) => ({
      id: code._id.toString(),   // <-- send MongoDB ObjectId here as string
      name: code.name,
      html: code.html,
      css: code.css,
      js: code.js,
    }));

    res.json(formattedCodes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};



exports.deleteCodeSnippet = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSnippet = await CodeSnippet.findByIdAndDelete(id);

    if (!deletedSnippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }

    res.status(200).json({ message: 'Snippet deleted successfully' });
  } catch (error) {
    console.error('Error deleting snippet:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

