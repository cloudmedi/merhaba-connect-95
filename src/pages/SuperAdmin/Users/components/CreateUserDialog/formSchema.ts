import { z } from "zod";

export const formSchema = z.object({
  firstName: z.string().min(2, "Ad en az 2 karakter olmalıdır"),
  lastName: z.string().min(2, "Soyad en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir email adresi giriniz"),
  companyName: z.string().min(2, "Şirket adı en az 2 karakter olmalıdır"),
  role: z.enum(["admin", "manager"]),
  license: z.object({
    type: z.enum(["trial", "premium"]),
    startDate: z.string().min(1, "Başlangıç tarihi gereklidir"),
    endDate: z.string().min(1, "Bitiş tarihi gereklidir"),
    quantity: z.number().min(1, "En az 1 lisans gereklidir")
  })
});

export type FormValues = z.infer<typeof formSchema>;

export const defaultValues: FormValues = {
  firstName: "",
  lastName: "",
  email: "",
  companyName: "",
  role: "manager",
  license: {
    type: "trial",
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    quantity: 1
  }
};