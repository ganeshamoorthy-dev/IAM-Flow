import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import AddIcon from '@mui/icons-material/Add';
import SecurityIcon from '@mui/icons-material/Security';
import SearchIcon from '@mui/icons-material/Search';
import { TablePagination } from '../../components';
import { roleService } from '../../services';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { toast } from 'react-toastify';
import type { RoleResponse } from '../../models/response/RoleResponse';

export default function AppRoles() {
  const navigate = useNavigate();
  const currentUser = useCurrentUser();
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Load roles from API
  useEffect(() => {
    const loadRoles = async () => {
      if (!currentUser?.accountId) return;
      
      try {
        setLoading(true);
        const rolesData = await roleService.list(currentUser.accountId);
        setRoles(rolesData);
      } catch (error) {
        console.error('Error loading roles:', error);
        toast.error('Failed to load roles');
      } finally {
        setLoading(false);
      }
    };

    loadRoles();
  }, [currentUser?.accountId]);

  // Filter roles based on search
  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate filtered roles
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRoles = filteredRoles.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleViewRole = (role: RoleResponse) => {
    navigate(`/app/roles/${role.id}`);
  };

  const handleCreateRole = () => {
    navigate('/app/roles/create');
  };

  const renderRolesList = () => (
    <Box>
      {/* Search Bar */}
      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            size="small"
            sx={{ minWidth: '300px' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </Paper>

      <Paper elevation={2}>
        <TableContainer>
          {loading ? (
            <Box sx={{ p: 3 }}>
              {[...Array(5)].map((_, index) => (
                <Skeleton key={index} variant="rectangular" height={53} sx={{ mb: 1 }} />
              ))}
            </Box>
          ) : filteredRoles.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Alert severity="info" sx={{ maxWidth: 400, mx: 'auto' }}>
                {searchTerm
                  ? 'No roles match your search criteria.'
                  : 'No roles found. Create your first role to get started.'}
              </Alert>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Role Name</strong></TableCell>
                  <TableCell><strong>Description</strong></TableCell>
                  <TableCell><strong>Permissions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRoles.map((role) => (
                  <TableRow 
                    key={role.id} 
                    hover 
                    sx={{ 
                      cursor: 'pointer',
                      '& td': {
                        borderBottom: (theme) => `1px solid ${theme.palette.divider}`
                      }
                    }} 
                    onClick={() => handleViewRole(role)}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SecurityIcon fontSize="small" color="action" />
                        <Typography fontWeight="medium">{role.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" sx={{
                        maxWidth: '300px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {role.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${role.permissions.length} permissions`}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>

        {/* Pagination */}
        {!loading && filteredRoles.length > 0 && (
          <TablePagination
            totalItems={filteredRoles.length}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            label="roles"
          />
        )}
      </Paper>
    </Box>
  );

  return (
    <>
      <Paper>
        <Toolbar className='toolbar'>
          <Typography variant="h6" gutterBottom>
            Roles Management
          </Typography>
          <Button startIcon={<AddIcon />} onClick={handleCreateRole}>
            Create Role
          </Button>
        </Toolbar>
      </Paper>
      <div className='page-content'>
        {renderRolesList()}
      </div>
    </>
  );
}
