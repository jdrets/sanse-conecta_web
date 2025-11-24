import { DashboardLayout } from "@/components";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";

export default function Providers({ children }: { children: React.ReactNode }) {
  const formData = useForm<AuditFormData>({
    resolver: zodResolver(auditSchema),
    mode: "onChange",
    defaultValues: {
      clientId: undefined,
      auditTypeId: undefined,
      items: [],
      creationDate: format(new Date(), "yyyy-MM-dd"),
    },
  });

  const breadcrumbs = [
    {
      label: "Inicio",
      href: "/",
    },
    {
      label: "Auditorias",
      href: "/audits",
    },
    {
      label: "Nueva auditoria",
    },
  ];

  return (
    <FormProvider {...formData}>
      <DashboardLayout breadcrumbs={breadcrumbs}>{children}</DashboardLayout>
    </FormProvider>
  );
}

// Schema de validación con Zod
const auditSchema = z.object({
  clientId: z.number().min(1, "El cliente es requerido"),
  auditTypeId: z.number().min(1, "El tipo de auditoria es requerido"),
  items: z.array(
    z.object({
      id: z.number().min(1, "El item es requerido"),
      name: z.string().min(1, "El nombre es requerido"),
      term: z.string().min(1, "El término es requerido"),
      laws: z.string().min(1, "El marco legal es requerido"),
      date: z.string(),
      expiry_date: z.string().optional(),
      documents: z.string().optional(),
      comments: z.string().optional(),
      apply: z.boolean().optional(),
      complies: z.boolean().optional(),
      status: z.string().optional(),
    })
  ),
  creationDate: z.string(),
});

type AuditFormData = z.infer<typeof auditSchema>;
