import { Box, Typography } from '@mui/material';

export default function TestLandingPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Test Section 1 */}
      <Box sx={{ minHeight: '100vh', bgcolor: 'red', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h2" color="white">Hero Section</Typography>
      </Box>
      
      {/* Test Section 2 */}
      <Box sx={{ minHeight: '50vh', bgcolor: 'green', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h2" color="white">Features Section</Typography>
      </Box>
      
      {/* Test Section 3 */}
      <Box sx={{ minHeight: '50vh', bgcolor: 'blue', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h2" color="white">Benefits Section</Typography>
      </Box>
      
      {/* Test Section 4 - Ready to Get Started */}
      <Box sx={{ minHeight: '50vh', bgcolor: 'purple', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h2" color="white">Ready to Get Started Section</Typography>
      </Box>
    </Box>
  );
}
