import Joi from 'joi';

export const songSchema = Joi.object({
  title: Joi.string().required(),
  artist: Joi.string().allow(''),
  album: Joi.string().allow(''),
  genre: Joi.array().items(Joi.string()),
  duration: Joi.number(),
  fileUrl: Joi.string().required(),
  artworkUrl: Joi.string().allow('')
});

export const playlistSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(''),
  isPublic: Joi.boolean(),
  isHero: Joi.boolean(),
  songs: Joi.array().items(Joi.string()),
  categories: Joi.array().items(Joi.string()),
  genre: Joi.string(),
  mood: Joi.string(),
  artworkUrl: Joi.string().allow('')
});

export const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  role: Joi.string().valid('admin', 'manager', 'user')
});