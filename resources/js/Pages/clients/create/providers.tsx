import { DashboardLayout } from "@/components";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Providers({ children }: { children: React.ReactNode }) {
  const formData = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      address: "",
      cadastralNomenclature: "",
      phone: "",
      cuit: "",
      contactName: "",
      responsibleEmail: "",
      environmentalAuditResponsible: "",
      safetyAuditResponsible: "",
      category: 0,
    },
  });

  const breadcrumbs = [
    {
      label: "Inicio",
      href: "/",
    },
    {
      label: "Clientes",
      href: "/clients",
    },
    {
      label: "Nuevo cliente",
    },
  ];

  return (
    <FormProvider {...formData}>
      <DashboardLayout breadcrumbs={breadcrumbs}>{children}</DashboardLayout>
    </FormProvider>
  );
}

// Schema de validación con Zod
const clientSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  address: z.string().min(1, "El domicilio es requerido"),
  cadastralNomenclature: z.string().optional(),
  phone: z
    .string()
    .min(1, "El teléfono es requerido")
    .regex(/^[0-9+\-\s()]+$/, "Ingrese un teléfono válido"),
  cuit: z
    .string()
    .min(1, "El CUIT es requerido")
    .regex(
      /^[0-9]{2}-[0-9]{8}-[0-9]$/,
      "Formato de CUIT inválido (XX-XXXXXXXX-X)"
    ),
  contactName: z.string().min(1, "El nombre de contacto es requerido"),
  responsibleEmail: z
    .string()
    .min(1, "El email es requerido")
    .regex(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      "Ingrese un email válido"
    ),
  environmentalAuditResponsible: z
    .string()
    .regex(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      "Ingrese un email válido"
    )
    .optional()
    .or(z.literal("")),
  safetyAuditResponsible: z
    .string()
    .regex(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      "Ingrese un email válido"
    )
    .optional()
    .or(z.literal("")),
  category: z.number().min(1, "El rubro general es requerido"),
});

type ClientFormData = z.infer<typeof clientSchema>;
