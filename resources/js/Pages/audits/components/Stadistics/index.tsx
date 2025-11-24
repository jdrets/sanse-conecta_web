import { Typography, Box, Grid } from "@mui/material";
import {
  HelpOutline,
  CheckCircleOutline,
  CancelOutlined,
  ThumbUpOutlined,
  ThumbDownOutlined,
  TrendingUp,
  TrendingDown,
} from "@mui/icons-material";
import { useMemo } from "react";
import { IAuditItem } from "@/types/audit.interface";

export default function Stadistics({ items }: { items: IAuditItem[] }) {
  const data = useMemo(() => {
    // Filtrar solo los items que aplican
    const applicableItems = Object.values(items).filter(
      (item: any) => item.apply
    );
    const applicableCount = applicableItems.length;

    // Contar los que cumplen y no cumplen (solo entre los que aplican)
    const compliesCount = applicableItems.filter(
      (item: any) => item.complies
    ).length;
    const notCompliesCount = applicableItems.filter(
      (item: any) => !item.complies
    ).length;

    // Calcular porcentajes sobre los items que aplican
    const compliancePercentage =
      applicableCount > 0
        ? ((compliesCount / applicableCount) * 100).toFixed(2)
        : "0.00";
    const nonCompliancePercentage =
      applicableCount > 0
        ? ((notCompliesCount / applicableCount) * 100).toFixed(2)
        : "0.00";

    return [
      {
        label: "Total de preguntas",
        value: Object.keys(items).length,
        icon: HelpOutline,
        color: "#1976d2",
        key: "total_questions",
      },
      {
        label: "Aplican",
        value: applicableCount,
        icon: CheckCircleOutline,
        color: "#2e7d32",
        key: "applies",
      },
      {
        label: "No Aplican",
        value: Object.values(items).filter((item: any) => !item.apply).length,
        icon: CancelOutlined,
        color: "#ed6c02",
        key: "not_applies",
      },
      {
        label: "Cumplen",
        value: compliesCount,
        icon: ThumbUpOutlined,
        color: "#2e7d32",
        key: "complies",
      },
      {
        label: "No Cumplen",
        value: notCompliesCount,
        icon: ThumbDownOutlined,
        color: "#d32f2f",
        key: "not_complies",
      },
      {
        label: "% Cumplimiento",
        value: `${compliancePercentage}%`,
        icon: TrendingUp,
        color: "#2e7d32",
        key: "compliance_percentage",
      },
      {
        label: "% No Cumplimiento",
        value: `${nonCompliancePercentage}%`,
        icon: TrendingDown,
        color: "#d32f2f",
        key: "non_compliance_percentage",
      },
    ];
  }, [items]);

  return (
    <>
      <Grid container spacing={2} className="stadistics-grid">
        {data.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "background.paper",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 2,
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    backgroundColor: `${stat.color}15`,
                    flexShrink: 0,
                  }}
                >
                  <IconComponent
                    sx={{ color: stat.color, fontSize: 28 }}
                    className="stat-icon"
                  />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className="stat-label"
                    sx={{ mb: 0.5 }}
                  >
                    {stat.label}
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    className="stat-value"
                  >
                    {stat.value}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>
      <style>{`
        @media print {
          .stadistics-grid .MuiGrid-root {
            flex-basis: 30% !important;
            max-width: 30% !important;
            height: 40px !important;
          }
          
          .stat-icon {
            height: 24px !important;
            width: 24px !important;
            font-size: 24px !important;
          }
          .stat-label {
            font-size: 10px !important;
          }
          .stat-value {
            font-size: 16px !important;
          }
          
          .MuiBox-root:hover {
            transform: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </>
  );
}
