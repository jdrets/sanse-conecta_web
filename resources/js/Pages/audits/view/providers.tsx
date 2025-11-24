import { DashboardLayout } from "@/components";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { IAudit } from "@/types/audit.interface";
import { format } from "date-fns";

export default function Providers({
  children,
  audit,
}: {
  children: React.ReactNode;
  audit: IAudit;
}) {
  const formData = useForm<AuditFormData>({
    resolver: zodResolver(auditSchema),
    mode: "onChange",
    defaultValues: {
      clientId: audit.client_id,
      auditTypeId: audit.audit_type_id,
      items: audit.items.map(item => ({
        id: item.audit_type_item.id,
        name: item.audit_type_item.name,
        term: item.audit_type_item.term,
        laws: item.audit_type_item.laws,
        date: format(item.date, "yyyy-MM-dd"),
        expiry_date: item.expiry_date
          ? format(item.expiry_date, "yyyy-MM-dd")
          : undefined,
        documents: item.documents,
        comments: item.comments,
        apply: item.apply,
        complies: item.complies,
        status: item.status,
      })),
      creationDate: format(audit.creation_date, "yyyy-MM-dd"),
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
      expiry_date: z.string().nullish(),
      documents: z.string().nullish(),
      comments: z.string().nullish(),
      apply: z.boolean().optional(),
      complies: z.boolean().optional(),
      status: z.string().optional(),
    })
  ),
  creationDate: z.string(),
});

type AuditFormData = z.infer<typeof auditSchema>;
