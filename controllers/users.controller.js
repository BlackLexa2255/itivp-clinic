const { User } = require('../models');

async function getAll(req, res, next) {
  try {
    const users = await User.findAll({ order: [['id', 'ASC']] });
    res.json(users.map(user => user.toSafeJSON()));
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    await user.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, remove };
