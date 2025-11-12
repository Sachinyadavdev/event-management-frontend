import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '../../hooks/useToast.jsx';
import { usersAPI } from '../../services/apiEndpoints';
import UserTable from '../../components/admin/UserManagement/UserTable';
import UserModal from '../../components/admin/UserManagement/UserModal';
import UserFilters from '../../components/admin/UserManagement/UserFilters';
import UserStats from '../../components/admin/UserManagement/UserStats';
import UserBulkActions from '../../components/admin/UserManagement/UserBulkActions';
import ExportUsersModal from '../../components/admin/UserManagement/ExportUsersModal';
import UserProfileModal from '../../components/admin/UserManagement/UserProfileModal';

const UserManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    membershipType: searchParams.get('membershipType') || '',
    professionalStatus: searchParams.get('professionalStatus') || '',
    industry: searchParams.get('industry') || '',
    status: searchParams.get('status') || 'all',
    dateRange: {
      start: searchParams.get('dateStart') || '',
      end: searchParams.get('dateEnd') || ''
    }
  });

  // Modal states
  const [modals, setModals] = useState({
    userForm: { open: false, mode: 'create', data: null },
    userProfile: { open: false, data: null },
    exportUsers: { open: false },
    bulkUpdate: { open: false }
  });

  // Pagination
  const [pagination, setPagination] = useState({
    page: parseInt(searchParams.get('page')) || 1,
    limit: parseInt(searchParams.get('limit')) || 25,
    total: 0,
    totalPages: 0
  });

  // Sorting
  const [sort, setSort] = useState({
    field: searchParams.get('sortBy') || 'createdAt',
    order: searchParams.get('sortOrder') || 'desc'
  });

  // Fetch users data
  useEffect(() => {
    fetchUsers();
  }, [filters, pagination.page, pagination.limit, sort]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.search) params.set('search', filters.search);
    if (filters.membershipType) params.set('membershipType', filters.membershipType);
    if (filters.professionalStatus) params.set('professionalStatus', filters.professionalStatus);
    if (filters.industry) params.set('industry', filters.industry);
    if (filters.status !== 'all') params.set('status', filters.status);
    if (filters.dateRange.start) params.set('dateStart', filters.dateRange.start);
    if (filters.dateRange.end) params.set('dateEnd', filters.dateRange.end);
    if (pagination.page > 1) params.set('page', pagination.page);
    if (pagination.limit !== 25) params.set('limit', pagination.limit);
    if (sort.field !== 'createdAt') params.set('sortBy', sort.field);
    if (sort.order !== 'desc') params.set('sortOrder', sort.order);

    setSearchParams(params);
  }, [filters, pagination.page, pagination.limit, sort, setSearchParams]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Prepare query parameters for backend API
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: sort.field,
        sortOrder: sort.order,
        search: filters.search || undefined,
        status: filters.status !== 'all' ? filters.status : undefined,
        role: filters.membershipType || undefined
      };

      // Call backend API
      const response = await usersAPI.getAll(params);
      
      // Backend returns: { users: [...], pagination: { total, page, limit, totalPages } }
      const transformedUsers = response.users.map(user => ({
        id: user.user_id,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone,
        professionalStatus: user.professional_status || 'working-professional',
        yearsExperience: user.years_experience || 'Not specified',
        industrySector: user.industry || 'Technology',
        membershipType: user.role_name?.toLowerCase() || 'non-member',
        status: user.status,
        profileImage: user.profile_image,
        createdAt: user.created_at,
        lastLogin: user.last_login,
        eventsAttended: user.events_attended || 0,
        membershipExpiry: user.membership_expiry,
        certificates: user.certifications || [],
        cpeScore: user.cpe_credits || 0,
        lastCpeUpdate: user.last_cpe_update,
        department: user.department,
        position: user.job_title,
        company: user.company,
        location: `${user.city || ''}${user.city && user.state ? ', ' : ''}${user.state || ''}`
      }));

      setUsers(transformedUsers);
      setPagination(prev => ({ 
        ...prev, 
        total: response.pagination.total,
        totalPages: response.pagination.totalPages
      }));
    } catch (error) {
      addToast(error.message || 'Failed to fetch users', 'error');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type, mode = null, data = null) => {
    setModals(prev => ({
      ...prev,
      [type]: { open: true, mode, data }
    }));
  };

  const closeModal = (type) => {
    setModals(prev => ({
      ...prev,
      [type]: { open: false, mode: null, data: null }
    }));
    // Clear selection when closing bulk actions
    if (type === 'bulkUpdate') {
      setSelectedUsers([]);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handleSortChange = (field) => {
    setSort(prev => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleUserAction = async (action, userId, data = null) => {
    try {
      // Get user info for personalized messages
      const user = users.find(u => u.id === userId);
      const userName = user?.fullName || 'User';
      
      switch (action) {
        case 'delete':
          if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
            await usersAPI.delete(userId);
            addToast(`${userName} has been deleted successfully`, 'success');
            fetchUsers(); // Refresh the list
          }
          break;
        
        case 'activate':
        case 'deactivate':
          const newStatus = action === 'activate' ? 'active' : 'inactive';
          await usersAPI.updateStatus(userId, newStatus);
          
          addToast(`${userName} has been ${action === 'activate' ? 'activated' : 'deactivated'} successfully`, 'success');
          fetchUsers(); // Refresh the list
          break;
        
        case 'update':
          await usersAPI.update(userId, data);
          addToast(`${data?.fullName || userName} has been updated successfully`, 'success');
          closeModal('userForm');
          fetchUsers();
          break;
        
        case 'create':
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          addToast(`${data?.fullName || 'New user'} has been created successfully`, 'success');
          closeModal('userForm');
          fetchUsers();
          break;
        
        default:
          break;
      }
    } catch (error) {
      // Get user info for personalized error messages
      const user = users.find(u => u.id === userId);
      const userName = user?.fullName || 'User';
      
      addToast(error.message || `Failed to ${action} ${userName}. Please try again.`, 'error');
      console.error(`Error ${action}ing user:`, error);
    }
  };

  const handleBulkAction = async (action, userIds, data = null) => {
    try {
      switch (action) {
        case 'delete':
          // Call backend API for bulk delete
          await Promise.all(userIds.map(userId => usersAPI.delete(userId)));
          addToast(`Successfully deleted ${userIds.length} user${userIds.length === 1 ? '' : 's'}`, 'success');
          break;
          
        case 'activate':
          // Call backend API for bulk activate
          await Promise.all(userIds.map(userId => usersAPI.updateStatus(userId, 'active')));
          addToast(`Successfully activated ${userIds.length} user${userIds.length === 1 ? '' : 's'}`, 'success');
          break;
          
        case 'deactivate':
          // Call backend API for bulk deactivate
          await Promise.all(userIds.map(userId => usersAPI.updateStatus(userId, 'inactive')));
          addToast(`Successfully deactivated ${userIds.length} user${userIds.length === 1 ? '' : 's'}`, 'success');
          break;
          
        case 'update':
          addToast(`Successfully updated ${userIds.length} user${userIds.length === 1 ? '' : 's'}`, 'success');
          break;
          
        default:
          break;
      }
      
      // Refresh the list after bulk action
      fetchUsers();
      setSelectedUsers([]);
    } catch (error) {
      addToast(error.message || `Failed to ${action} ${userIds.length} user${userIds.length === 1 ? '' : 's'}. Please try again.`, 'error');
      console.error(`Error ${action}ing users:`, error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                User Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage member accounts, memberships, and user data
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {selectedUsers.length > 0 && (
                <UserBulkActions
                  selectedCount={selectedUsers.length}
                  onBulkAction={handleBulkAction}
                  onClearSelection={() => setSelectedUsers([])}
                />
              )}
              
              <button
                onClick={() => openModal('exportUsers')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Users
              </button>
              
              <button
                onClick={() => openModal('userForm', 'create')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add User
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <UserStats users={users} />

        {/* Filters */}
        <UserFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={() => setFilters({
            search: '',
            membershipType: '',
            professionalStatus: '',
            industry: '',
            status: 'all',
            dateRange: { start: '', end: '' }
          })}
        />

        {/* User Table */}
        <UserTable
          users={users}
          loading={loading}
          selectedUsers={selectedUsers}
          onSelectionChange={setSelectedUsers}
          onSort={handleSortChange}
          sort={sort}
          pagination={pagination}
          onPaginationChange={setPagination}
          onUserAction={handleUserAction}
          onEditUser={(user) => openModal('userForm', 'edit', user)}
          onViewUser={(user) => openModal('userProfile', null, user)}
        />

        {/* Modals */}
        {modals.userForm.open && (
          <UserModal
            isOpen={modals.userForm.open}
            onClose={() => closeModal('userForm')}
            mode={modals.userForm.mode}
            user={modals.userForm.data}
            onSave={(data) => handleUserAction(
              modals.userForm.mode === 'create' ? 'create' : 'update',
              modals.userForm.data?.id,
              data
            )}
          />
        )}

        {modals.exportUsers.open && (
          <ExportUsersModal
            isOpen={modals.exportUsers.open}
            onClose={() => closeModal('exportUsers')}
            users={users}
            filters={filters}
          />
        )}

        {modals.userProfile.open && (
          <UserProfileModal
            isOpen={modals.userProfile.open}
            onClose={() => closeModal('userProfile')}
            user={modals.userProfile.data}
            onEditUser={(user) => openModal('userForm', 'edit', user)}
          />
        )}
      </div>
    </div>
  );
};

export default UserManagement;