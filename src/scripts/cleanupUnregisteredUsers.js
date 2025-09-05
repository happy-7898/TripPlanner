const db = require("../models/sequelize/index");
const { Op } = db.Sequelize;
const { User } = db;

async function deleteUnregisteredUsers() {
  try {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const deletedCount = await User.destroy({
      where: {
        isRegistered: false,
        createdAt: { [Op.lt]: cutoff },
      },
    });

    console.log(`Deleted ${deletedCount} unregistered users`);
    process.exit(0);
  } catch (error) {
    console.error("Error deleting unregistered users:", error);
    process.exit(1);
  }
}

deleteUnregisteredUsers();
