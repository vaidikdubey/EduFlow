import { z } from "zod";

export const passwordRule = z
    .string()
    .min(8, "Password must be atleast 8 characters long")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one digit")
    .regex(/[@$!%*?&]/, "Password must contain at least one special character");

export const LoginSchema = z.object({
    email: z.email("Enter a valid email"),
    password: z.string().min(1, "Password is required"),
});

export const SignupSchema = z
    .object({
        name: z.string("Name is required"),
        email: z.email("Enter a valid email").toLowerCase(),
        password: passwordRule,
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        error: "Passwords don't match",
        path: ["confirmPassword"],
    });

export const createFormSchema = z.object({
    title: z.string("Title is required"),
    description: z.string().optional(),
});
