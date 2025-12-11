import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/user.model';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_dev_key';

export const login = async (req: Request, res: Response) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res
      .status(400)
      .json({ message: 'Login et mot de passe sont requis.' });
  }

  try {
    const user = await User.findOne({ where: { login } });

    if (!user) {
      return res.status(401).json({ message: 'identifiants invalides.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Identifiants invalides.' });
    }

    const payload = {
      id: user.id,
      login: user.login,
      nomComplet: user.nomComplet,
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: '1d',
    });

    return res.json({
      message: 'Authentification réussie',
      token,
      user: {
        id: user.id,
        login: user.login,
        nomComplet: user.nomComplet,
      },
    });
  } catch (error) {
    console.error('Erreur lors de la tentative de connexion:', error);
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  const { login, password, nomComplet } = req.body;

  if (!login || !password || !nomComplet) {
    return res
      .status(400)
      .json({
        message: 'Tous les champs (login, password, nomComplet) sont requis.',
      });
  }

  try {
    const existingUser = await User.findOne({ where: { login } });
    if (existingUser) {
      return res.status(409).json({ message: 'Ce login est déjà utilisé.' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      login,
      password: hashedPassword,
      nomComplet,
    });

    const payload = {
      id: newUser.id,
      login: newUser.login,
      nomComplet: newUser.nomComplet,
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: '1d',
    });

    return res.status(201).json({
      message: 'Inscription réussie',
      token,
      user: {
        id: newUser.id,
        login: newUser.login,
        nomComplet: newUser.nomComplet,
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'utilisateur:", error);
    return res
      .status(500)
      .json({ message: "Erreur interne du serveur lors de l'inscription." });
  }
};
