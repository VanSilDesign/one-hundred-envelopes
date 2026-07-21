const User = require("../models/User.js");

/**
 * Confronta i badges che l'utente he con la lista master di badges dell'app
 */
const MASTER_BADGES = [
  {
    id: 1,
    name: "verified-account",
    active: true,
    isUnlocked: false,
    unlockedAt: null,
    path: "/public/badges/verified-account.svg",
    alt: "Badges per aver verificato l'account",
    createdAt: new Date(),
  },
  {
    id: 2,
    name: "first-number",
    active: true,
    isUnlocked: false,
    unlockedAt: null,
    path: "/public/badges/first-number.svg",
    alt: "Badge per il primo numero estratto",
    createdAt: new Date(),
  },
  {
    id: 3,
    name: "pro-saver",
    active: true,
    isUnlocked: false,
    unlockedAt: null,
    path: "/public/badges/pro-saver.svg",
    alt: "Badge per aver completato una sfida",
    createdAt: new Date(),
  },
];

exports.syncBadges = async (req, res) => {
  const userId = req.user?._id || req.session?.passport?.user;

  try {
    const user = await User.findById(userId);

    const missingBadges = MASTER_BADGES.filter(
      (masterBadge) =>
        !user.badges.some((userBadge) => userBadge.id === masterBadge.id),
    );

    if (missingBadges.length > 0) {
      const badgesToAdd = missingBadges.map((b) => ({
        ...b,
        isUnlocked: false,
        createdAt: new Date(),
      }));

      user.badges.push(...badgesToAdd);
      await user.save();
    }
    res
      .status(200)
      .json({ message: "Badges sincronizzati", badges: user.badges });
  } catch (error) {
    res.status(500).json({ message: "Errore sincronizzazione" });
  }
};

/**
 * Sblocca un badge specifico per un utente
 * @param {String} userId - ID dell'utente
 * @param {Number} badgeId - ID numerico del badge
 */

exports.unlockBadge = async (userId, badgeId) => {
  try {
    const result = await User.updateOne(
      {
        _id: userId,
        "badges.id": badgeId,
        "badges.isUnlocked": false,
      },
      {
        $set: {
          "badges.$.isUnlocked": true,
          "badges.$.unlockedAt": new Date(),
        },
      },
    );

    if (result.modifiedCount > 0) {
      console.log(
        `Badge ${badgeId} sbloccato con successo per l'utente ${userId}`,
      );
      return true;
    }
    return false;
  } catch (error) {
    console.error("Errore nello sblocco del badge:", error);
    throw error;
  }
};
