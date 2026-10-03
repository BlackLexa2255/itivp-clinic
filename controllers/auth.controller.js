const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { logSecurityEvent } = require('../utils/securityLogger');

const MAX_ATTEMPTS = Number(process.env.MAX_FAILED_ATTEMPTS || 5);
const LOCK_MINUTES = Number(process.env.LOCK_TIME_MINUTES || 15);

async function register(req, res, next) {
  try {
    const { email, password, role } = req.body;
    if (await User.findOne({ where: { email } })) {
      return res.status(409).json({ error: 'Пользователь с таким email уже существует' });
    }
    // Пароль хранится только в виде хеша bcrypt
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash, role: role || 'user' });
    res.status(201).json(user.toSafeJSON());
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    // Единое сообщение для несуществующего пользователя и неверного пароля,
    // чтобы нельзя было определить, какие адреса зарегистрированы
    if (!user) {
      logSecurityEvent('LOGIN_FAILED', req, { email, reason: 'пользователь не найден' });
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    if (user.lockUntil && user.lockUntil > new Date()) {
      logSecurityEvent('LOGIN_BLOCKED', req, { email, lockUntil: user.lockUntil });
      return res.status(423).json({ error: 'Учётная запись временно заблокирована, попробуйте позже' });
    }

    // bcrypt.compare сравнивает хеши за постоянное время
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      user.failedAttempts += 1;
      if (user.failedAttempts >= MAX_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_MINUTES * 60 * 1000);
        user.failedAttempts = 0;
        logSecurityEvent('ACCOUNT_LOCKED', req, { email, minutes: LOCK_MINUTES });
      } else {
        logSecurityEvent('LOGIN_FAILED', req, { email, attempt: user.failedAttempts });
      }
      await user.save();
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    user.failedAttempts = 0;
    user.lockUntil = null;
    await user.save();

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    });
    res.json({ token, user: user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
}

async function me(req, res) {
  res.json(req.user.toSafeJSON());
}

module.exports = { register, login, me };
