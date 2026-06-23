const User = require("../../models/User.js");

exports.getMe = async (req, res) => {
  const userId = req.user?._id || req.session?.passport?.user;
  try {
    const user = await User.findById(userId).select("-password -resetPasswordToken -resetPasswordExpires");

    if (!user) {
      res.status(404).json({ message: "Utente non trovato" });
    }

    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Errore nel recupero dell'utente", error: error });
  }
};

exports.getMyBadges = async (req,res) => {
  const userId = req.user?._id || req.session?.passport?.user;
  try {
    const user = await User.findById(userId).select('badges');
    if (!user) {
      return res.status(404).json({ message: "Utente non trovato" });
    }
    res.status(200).json(user.badges);
  } catch (error) {
    res.status(500).json({ message: "Errore nel recupero badge", error: error });
  }
};
