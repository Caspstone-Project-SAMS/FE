import * as React from 'react';
import { createTheme, PaletteOptions, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { unstable_capitalize as capitalize } from '@mui/utils';
import Typography from '@mui/material/Typography';

interface CustomPaletteOptions extends PaletteOptions { // Extend PaletteOptions
  custom?: {
    main: string;
    light: string;
  };
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#4EFD4E', 
      light: '#9A9999', 
      dark: '#E83B3B', 
      contrastText: '#FFFFFF', 
    },
    secondary: {
      main: '#E0C2FF',
      light: '#F5EBFF',
      dark: '#8E24AA',
      contrastText: '#47008F',
    },
    custom: { 
      main: 'green', 
      light: 'red',
    },
  } as CustomPaletteOptions,
});

const colorExplain = {
  lecturerAttendance: [
    { id: 1, label: 'Attended' },
    { id: 2, label: 'Not yet' },
    { id: 3, label: 'Absent' },
  ],
  test: [
    { id: 1, label: 'a' },
    { id: 2, label: 'b' },
    { id: 3, label: 'c' },
  ],
  status: [
    { id: 1, label: 'success' },
    { id: 2, label: 'fail' },
  ],
};

const colorText = {
  id: [1, 2, 3],
  color: ['main', 'light', 'dark'],
};

export default function ColorShowcase({
  color,
  explain,
}: {
  color: 'primary' | 'secondary' | 'custom';
  explain: 'lecturerAttendance' | 'test' | 'status';
}) {
  return (
    <ThemeProvider theme={theme}>
      <Stack direction="row" sx={{ gap: 8 }}>
        <Stack sx={{ gap: 2, alignItems: 'center' }}>
          {/* <Button variant="contained" color={color}>
            {capitalize(color)}
          </Button> */}
          <Stack direction="row" sx={{ gap: 1 }}>
            {/* {colorText.id.map((id) => (
              <Stack sx={{ alignItems: 'center' }}>
                <Typography variant="body2">
                {colorExplain[explain][id - 1].label}
                </Typography>
                <Box
                  sx={{
                    bgcolor: `${color}.${colorText.color[id - 1]}`,
                    width: 20,
                    height: 20,
                  }}
                />
              </Stack>
            ))} */}

            {colorText.id.map((id) => {
              const label = colorExplain[explain][id - 1]?.label;
              return (
                <Stack sx={{ alignItems: 'center' }} key={id}>
                  <Typography variant="body2">
                    {label}
                  </Typography>
                  <Box
                    sx={{
                      bgcolor: `${color}.${colorText.color[id - 1]}`,
                      width: 20,
                      height: 20,
                    }}
                  />
                </Stack>
              );
            })}

            {/* <Stack sx={{ alignItems: 'center' }}>
              <Typography variant="body2">main</Typography>
              <Box sx={{ bgcolor: `${color}.main`, width: 40, height: 20 }} />
            </Stack>
            <Stack sx={{ alignItems: 'center' }}>
              <Typography variant="body2">dark</Typography>
              <Box sx={{ bgcolor: `${color}.dark`, width: 40, height: 20 }} />
            </Stack> */}
          </Stack>
        </Stack>
      </Stack>
    </ThemeProvider>
  );
}

// export default function ManuallyProvidePaletteColor() {
//   return (
//     <ThemeProvider theme={theme}>
//       <Stack direction="row" sx={{ gap: 8 }}>
//         <ColorShowcase color="primary" />
//         <ColorShowcase color="secondary" />
//       </Stack>
//     </ThemeProvider>
//   );
// }
