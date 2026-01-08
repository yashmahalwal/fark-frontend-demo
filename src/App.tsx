import { ApolloProvider } from '@apollo/client';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { graphqlClient } from '@/api/graphql';
import { RestUserComponent } from '@/components/RestUserComponent';
import { GraphQLUserComponent } from '@/components/GraphQLUserComponent';
import { GrpcUserComponent } from '@/components/GrpcUserComponent';
import { RestProductsComponent } from '@/components/RestProductsComponent';
import { GraphQLProductsComponent } from '@/components/GraphQLProductsComponent';
import { RestOrdersComponent } from '@/components/RestOrdersComponent';
import { GraphQLOrdersComponent } from '@/components/GraphQLOrdersComponent';
import { RefreshProvider } from '@/contexts/RefreshContext';
import { AppBar, Toolbar, Typography, Tabs, Tab, Box } from '@mui/material';
import { useState } from 'react';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  shape: {
    borderRadius: 8,
  },
});

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ApolloProvider client={graphqlClient}>
        <RefreshProvider>
          <Box sx={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'grey.50' }}>
          <AppBar position="static" elevation={2}>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
                Fark Frontend Demo
              </Typography>
            </Toolbar>
          </AppBar>
          
          <Box sx={{ width: '100%', flex: 1, px: 4, py: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs 
                value={tabValue} 
                onChange={(_, newValue) => setTabValue(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 500,
                    minHeight: 64,
                  },
                }}
              >
                <Tab label="Users REST" />
                <Tab label="Users GraphQL" />
                <Tab label="Users gRPC" />
                <Tab label="Orders REST" />
                <Tab label="Orders GraphQL" />
                <Tab label="Products REST" />
                <Tab label="Products GraphQL" />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <RestUserComponent />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <GraphQLUserComponent />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <GrpcUserComponent />
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
              <RestOrdersComponent />
            </TabPanel>
            <TabPanel value={tabValue} index={4}>
              <GraphQLOrdersComponent />
            </TabPanel>
            <TabPanel value={tabValue} index={5}>
              <RestProductsComponent />
            </TabPanel>
            <TabPanel value={tabValue} index={6}>
              <GraphQLProductsComponent />
            </TabPanel>
          </Box>
        </Box>
        </RefreshProvider>
      </ApolloProvider>
    </ThemeProvider>
  );
}

export default App;
