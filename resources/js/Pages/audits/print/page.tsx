import { Container, Box } from "@mui/material";
import Fields from "./components/Fields";
import { IAudit } from "@/types/audit.interface";
import { DashboardLayout, BoxRow, BoxColumn } from "@/components";
import { Button } from "@mui/material";
import { PrintOutlined } from "@mui/icons-material";

export default function PageContent({ audit }: { audit: IAudit }) {
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
      label: "Imprimir auditoria",
    },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <DashboardLayout breadcrumbs={breadcrumbs}>
      <Container maxWidth="xl">
        <BoxColumn gap={3}>
          <Box className="no-print">
            <BoxRow justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                startIcon={<PrintOutlined />}
                onClick={handlePrint}
              >
                Imprimir
              </Button>
            </BoxRow>
          </Box>
          <Box className="print-only-content">
            <Fields audit={audit} />
          </Box>
        </BoxColumn>
      </Container>

      <style>{`
        @media print {
          /* Ocultar el layout del dashboard y solo mostrar el contenido */
          body * {
            visibility: hidden;
          }
          
          .print-only-content,
          .print-only-content * {
            visibility: visible;
          }
          
          .print-only-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          
          .no-print {
            display: none !important;
          }
          
          /* Eliminar márgenes y padding innecesarios */
          @page {
            margin: 1cm;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}
