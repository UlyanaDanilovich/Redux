import { z } from 'zod';

export const validateEmail = (email) => {
  const emailSchema = z.string().email('Пожалуйста, введите корректный email');
  return emailSchema.safeParse(email);
};

export const validatePassword = (password) => {
  const passwordSchema = z.string()
    .min(8, 'Пароль должен содержать не менее 8 символов')
    .regex(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
    .regex(/[a-z]/, 'Пароль должен содержать хотя бы одну строчную букву')
    .regex(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру');

  return passwordSchema.safeParse(password);
};