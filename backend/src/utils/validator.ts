import zod from "zod";
export const signUpSchema = zod.object({
  name: zod.string().min(2, "minimum of length 2"),
  email: zod.string().email("Invalid email"),
  password: zod.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = zod.object({
  email: zod.string().email("Invalid email"),
  password: zod.string().min(8, "Password must be at least 8 characters"),
});
