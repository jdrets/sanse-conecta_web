import { Box } from '@mui/material';
import { ReactNode } from 'react';

export const BoxRow = ({
  gap = 0,
  sx = {},
  textAlign = 'left',
  alignItems = 'center',
  children,
  justifyContent = 'flex-start',
  'data-cy': dataCy,
  height = 'auto',
  component,
}: {
  gap?: number;
  textAlign?: 'left' | 'center' | 'right';
  alignItems?: 'center' | 'flex-start' | 'flex-end';
  justifyContent?:
    | 'space-between'
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-around';
  sx?: any;
  children: ReactNode[] | ReactNode;
  'data-cy'?: string;
  height?: string | number;
  component?: React.ElementType;
}) => (
  <Box
    display="flex"
    gap={gap}
    textAlign={textAlign}
    sx={sx}
    data-cy={dataCy}
    alignItems={alignItems}
    justifyContent={justifyContent}
    height={height}
    component={component}
  >
    {children}
  </Box>
);
