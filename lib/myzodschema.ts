import {z} from 'zod';
export const CreateUserSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email(),
  password: z
    .string()
    .min(6)
    .max(128)
    .regex(/[A-Z]/, "one uppercase letter")
    .regex(/[a-z]/, "one lowercase letter")
    .regex(/[0-9]/, "one number"),
});