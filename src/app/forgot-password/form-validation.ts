import z from 'zod';
import { REQUIRED_MESSAGE } from '@/constants/errors';

export const sendMailForgotPassword = z
  .object({
    email: z.string().email('Email inválido').nonempty(REQUIRED_MESSAGE),
  })
