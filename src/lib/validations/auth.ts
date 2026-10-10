import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
    email: z.string().email('يرجى إدخال بريد إلكتروني صحيح'),
    password: z
      .string()
      .min(6, 'كلمة المرور يجب ألا تقل عن 6 أحرف')
      .regex(/^[A-Z][a-z0-9]{5,}$/, 'كلمة المرور يجب أن تبدأ بحرف كبير (Uppercase) وتتبعها أحرف أو أرقام'),
    rePassword: z.string(),
    phone: z.string().regex(/^01[0125][0-9]{8}$/, 'يرجى إدخال رقم هاتف مصري صحيح (مثال: 01012345678)'),
  })
  .refine((data) => data.password === data.rePassword, {
    message: 'كلمتا المرور غير متطابقتين',
    path: ['rePassword'],
  });

export const loginSchema = z.object({
  email: z.string().email('يرجى إدخال بريد إلكتروني صحيح'),
  password: z.string().min(1, 'يرجى إدخال كلمة المرور'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;