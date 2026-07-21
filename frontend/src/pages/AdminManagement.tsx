import { useEffect, useMemo, useState } from 'react';
import { adminAPI } from '../api/client';
import type { AdminCredentials } from '../api/client';

type AdminMember = {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
  referralCode?: string;
  referredBy?: number | null;
  role: string;
  createdAt?: string;
  referredByName?: string | null;
};

type AdminManagementProps = {
  credentials: AdminCredentials;
};

const roles = ['member', 'moderator', 'superadmin'];

function formatDate(value?: string) {
  if (!value) {
    return '-';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function AdminManagement({ credentials }: AdminManagementProps) {
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [search, setSearch] = useState('');

  const filteredMembers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return members;
    }

    return members.filter((member) =>
      [member.name, member.email, member.role, member.referralCode, member.referredByName]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [members, search]);

  const stats = useMemo(
    () => ({
      total: members.length,
      moderators: members.filter((member) => member.role === 'moderator').length,
      admins: members.filter((member) => member.role === 'superadmin').length,
    }),
    [members]
  );

  useEffect(() => {
    let isActive = true;

    adminAPI
      .getUsers(credentials)
      .then((registeredUsers: AdminMember[]) => {
        if (!isActive) {
          return;
        }

        setMembers(registeredUsers);
        setError('');
      })
      .catch((err) => {
        if (!isActive) {
          return;
        }

        setError(err instanceof Error ? err.message : 'Failed to load community members');
      })
      .finally(() => {
        if (isActive) {
          setLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [credentials]);

  const showActionMessage = (message: string) => {
    setActionMessage(message);
    window.setTimeout(() => setActionMessage(''), 2500);
  };

  const updateRole = async (userId: number, role: string) => {
    try {
      await adminAPI.updateUserRole(credentials, userId, role);
      setMembers((currentMembers) =>
        currentMembers.map((member) => (member.id === userId ? { ...member, role } : member))
      );
      showActionMessage('Role updated');
    } catch (err) {
      showActionMessage(err instanceof Error ? err.message : 'Failed to update role');
    }
  };

  const removeUser = async (userId: number) => {
    if (!window.confirm('Delete this member? This action is irreversible.')) {
      return;
    }

    try {
      await adminAPI.deleteUser(credentials, userId);
      setMembers((currentMembers) => currentMembers.filter((member) => member.id !== userId));
      showActionMessage('Member deleted');
    } catch (err) {
      showActionMessage(err instanceof Error ? err.message : 'Failed to delete member');
    }
  };

  const exportCSV = () => {
    if (members.length === 0) {
      return;
    }

    const headers = ['id', 'name', 'email', 'role', 'referred_by', 'referral_code', 'joined'];
    const rows = members.map((member) => [
      member.id,
      member.name,
      member.email,
      member.role,
      member.referredByName ?? '',
      member.referralCode ?? '',
      member.createdAt ?? '',
    ]);
    const csv = [headers.join(','), ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'community_members.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="page-section admin-management-page">
      <div className="page-header admin-page-header">
        <div>
          <p className="section-kicker">Admin management</p>
          <h2>Community Members</h2>
          <p>Review registered travelers, update access roles, export records, and remove inactive accounts.</p>
        </div>
        <button type="button" className="primary-btn" onClick={exportCSV} disabled={members.length === 0}>
          Export CSV
        </button>
      </div>

      <div className="admin-stats-grid">
        <div className="stat-panel">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Total members</span>
        </div>
        <div className="stat-panel">
          <span className="stat-number">{stats.moderators}</span>
          <span className="stat-label">Moderators</span>
        </div>
        <div className="stat-panel">
          <span className="stat-number">{stats.admins}</span>
          <span className="stat-label">Super admins</span>
        </div>
      </div>

      <div className="card community-members-card admin-members-card">
        <div className="admin-toolbar">
          <div>
            <h3>Member Directory</h3>
            <p>{filteredMembers.length} shown</p>
          </div>
          <input
            className="admin-search-input"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search members"
            aria-label="Search members"
          />
        </div>

        {actionMessage && <div className="success-message">{actionMessage}</div>}
        {loading && <p>Loading community members...</p>}
        {error && <div className="error-message">{error}</div>}

        {!loading && !error && (
          <div className="community-members-table-wrap">
            {filteredMembers.length > 0 ? (
              <table className="community-members-table admin-members-table">
                <thead>
                  <tr>
                    <th scope="col">No.</th>
                    <th scope="col">Member</th>
                    <th scope="col">Email</th>
                    <th scope="col">Role</th>
                    <th scope="col">Referred By</th>
                    <th scope="col">Invite Code</th>
                    <th scope="col">Joined</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member, index) => (
                    <tr key={member.id}>
                      <td>{index + 1}</td>
                      <td>
                        <strong>{member.name}</strong>
                      </td>
                      <td>{member.email}</td>
                      <td>
                        <select
                          className="admin-role-select"
                          value={member.role}
                          onChange={(event) => updateRole(member.id, event.target.value)}
                        >
                          {roles.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>{member.referredByName ?? '-'}</td>
                      <td>{member.referralCode ?? '-'}</td>
                      <td>{formatDate(member.createdAt)}</td>
                      <td>
                        <button type="button" className="secondary-btn danger-btn" onClick={() => removeUser(member.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No community members found.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
