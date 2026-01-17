import { useEffect, useState, useMemo } from 'react';
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
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { TablePagination } from '../../components';
import { userService } from '../../services';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { toast } from 'react-toastify';
import type { UserResponse } from '../../models/response/UserResponse';

export default function AppUsers() {

  const navigate = useNavigate();
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const currentUser = useCurrentUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [emailVerifiedFilter, setEmailVerifiedFilter] = useState<string>('all');


  useEffect(() => {
    getUserList();
  }, []);

  async function getUserList() {
    try {
      setLoading(true);
      const users = await userService.list(currentUser.accountId);
      setUsers(users);
      setLoading(false);
    } catch (e: unknown) {
      setLoading(false);
      console.log(e);
      toast.error("Unable to get the user list");
    }
  }

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter users method - only recalculates when filters change
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    
    return users.filter(user => {
      const matchesSearch =
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      const matchesEmailVerified = emailVerifiedFilter === 'all' ||
        (emailVerifiedFilter === 'verified' && user.status == 'ACTIVE') ||
        (emailVerifiedFilter === 'unverified' && user.status != "ACTIVE");

      return matchesSearch && matchesStatus && matchesEmailVerified;
    });
  }, [users, searchTerm, statusFilter, emailVerifiedFilter]);

  // Paginate filtered users
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers?.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: UserResponse['status']) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'INACTIVE': return 'error';
      case 'CREATED': return 'warning';
      default: return 'default';
    }
  };


  const handleViewUser = (user: UserResponse) => {
    navigate(`/app/users/${user.id}`);
  };

  const renderUsersList = () => (
    <Box>
      {/* Search and Filters */}
      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <FilterListIcon color="action" />
          <TextField
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            size="small"
            sx={{ minWidth: '300px' }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="INACTIVE">Inactive</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Email Status</InputLabel>
            <Select
              value={emailVerifiedFilter}
              label="Email Status"
              onChange={(e) => {
                setEmailVerifiedFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="verified">Verified</MenuItem>
              <MenuItem value="unverified">Unverified</MenuItem>
            </Select>
          </FormControl>
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
          ) : filteredUsers?.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Alert severity="info" sx={{ maxWidth: 400, mx: 'auto' }}>
                {searchTerm || statusFilter !== 'all' || emailVerifiedFilter !== 'all'
                  ? 'No users match your search criteria.'
                  : 'No users found. Create your first user to get started.'}
              </Alert>
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell> <strong>Name</strong></TableCell>
                  <TableCell> <strong>Email</strong></TableCell>
                  <TableCell> <strong>Status</strong></TableCell>
                  <TableCell> <strong>Email Verified</strong></TableCell>
                  <TableCell> <strong>Last Login</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers?.map((user) => (
                  <TableRow
                    key={user.id}
                    hover
                    sx={{
                      cursor: 'pointer',
                      '& td': {
                        borderBottom: (theme) => `1px solid ${theme.palette.divider}`
                      }
                    }}
                  >
                    <TableCell onClick={() => handleViewUser(user)}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon fontSize="small" color="action" />
                        <Typography fontWeight="medium">
                          {user.firstName} {user.lastName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell onClick={() => handleViewUser(user)}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon fontSize="small" color="action" />
                        {user.email}
                      </Box>
                    </TableCell>
                    <TableCell onClick={() => handleViewUser(user)}>
                      <Chip
                        label={user.status}
                        color={getStatusColor(user.status)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell onClick={() => handleViewUser(user)}>
                      <Tooltip title={user.status == "ACTIVE" ? "Email verified" : "Email not verified"}>
                        {user.status == "ACTIVE" ? (
                          <CheckCircleIcon color="success" fontSize="small" />
                        ) : (
                          <CancelIcon color="error" fontSize="small" />
                        )}
                      </Tooltip>
                    </TableCell>
                    <TableCell onClick={() => handleViewUser(user)}>
                      <Typography variant="body2" color="text.secondary">
                        {formatDateTime(user.lastLogin)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>

        {/* Pagination */}
        {!loading && (filteredUsers?.length ?? 0) > 0 && (
          <TablePagination
            totalItems={filteredUsers?.length ?? 0}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            label="users"
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
            Users Management
          </Typography>

          <Button onClick={() => navigate('/app/users/create')} startIcon={<AddIcon />}>
            Create User
          </Button>
        </Toolbar>
      </Paper>
      <div className='page-content'>
        {renderUsersList()}
      </div>
    </>
  );
}
