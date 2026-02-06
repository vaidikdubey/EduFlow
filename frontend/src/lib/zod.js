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
        role: z.enum(["INSTRUCTOR", "STUDENT"], {
            required_error: "Please select a role",
            invalid_type_error: "Please select a valid role",
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        error: "Passwords don't match",
        path: ["confirmPassword"],
    });

export const createCourseSchema = z
    .object({
        title: z
            .string("Title is required")
            .min(3, "Title must be atleast 3 characters"),
        description: z.string().optional(),
        type: z.enum(["PAID", "FREE"], {
            required_error: "Please select course type",
            invalid_type_error: "Please select valid course type",
        }),
        price: z.number().optional(),
        instructors: z.array(),
    })
    .refine(
        (data) => {
            if (data.type === "PAID") return !!data.price && data.price > 0;
            return true;
        },
        {
            error: "Price is required and must be greater than 0 for PAID courses",
            path: ["price"],
        },
    );
