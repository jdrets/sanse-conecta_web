import { Box } from '@mui/material';
import { ReactNode } from 'react';

export const BoxColumn = ({
  gap = 0,
  sx = {},
  textAlign = 'left',
  children,
  'data-cy': dataCy,
  onClick,
}: {
  gap?: number;
  textAlign?: 'left' | 'center' | 'right';
  sx?: any;
  children: ReactNode[] | ReactNode;
  'data-cy'?: string;
  onClick?: () => void;
}) => (
  <Box
    display="flex"
    flexDirection="column"
    gap={gap}
    textAlign={textAlign}
    sx={sx}
    data-cy={dataCy}
    {...(onClick && { onClick })}
  >
    {children}
  </Box>
);
