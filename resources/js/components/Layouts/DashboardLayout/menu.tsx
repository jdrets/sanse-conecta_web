import { PeopleOutline, Security } from "@mui/icons-material";
import { UserRole } from "@/types/user.interface";

export const menu = [
  // {
  //   label: "Inicio",
  //   icon: <HomeOutlined />,
  //   path: "/dashboard",
  //   allowedRoles: [UserRole.ADMIN, UserRole.OPERATOR],
  // },
  {
    label: "Clientes",
    icon: <PeopleOutline />,
    path: "/clients",
    allowedRoles: [UserRole.ADMIN, UserRole.OPERATOR],
  },
  {
    label: "Auditorias",
    icon: <Security />,
    path: "/audits",
    allowedRoles: [UserRole.ADMIN, UserRole.OPERATOR, UserRole.CLIENT_OPERATOR],
    children: [
      {
        label: "Auditorias",
        path: "/audits",
        allowedRoles: [
          UserRole.ADMIN,
          UserRole.CLIENT_OPERATOR,
          UserRole.OPERATOR,
        ],
      },
      {
        label: "Tipos de auditorias",
        path: "/audits/types",
        allowedRoles: [UserRole.ADMIN, UserRole.OPERATOR],
      },
    ],
  },
];
