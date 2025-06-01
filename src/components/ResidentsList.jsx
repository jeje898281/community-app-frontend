//src/components/ResidentsList.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { listResidents } from '../services/api';
import CreateResidentModal from './CreateResidentModal';
import BulkImportModal from './BulkImportModal';
import Toast from './Toast';
import '../styles/ResidentsList.css';

function ResidentsList() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isBulkImportModalOpen, setIsBulkImportModalOpen] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'success' });

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        setLoading(true);
        const response = await listResidents();
        setResidents(response.data.data || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch residents:', err);
        setError('無法載入住戶資料');
      } finally {
        setLoading(false);
      }
    };

    fetchResidents();
  }, []);

  const handleSort = (field) => {
    const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return '⇅';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const filteredAndSortedResidents = residents
    .filter(resident =>
      resident.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (resident.email && resident.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (resident.community?.name && resident.community.name.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (!sortField) return 0;

      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'community') {
        aValue = a.community?.name || '';
        bValue = b.community?.name || '';
      }

      if (typeof aValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === 'asc'
        ? aValue - bValue
        : bValue - aValue;
    });

  const totalPages = Math.ceil(filteredAndSortedResidents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentResidents = filteredAndSortedResidents.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const refreshResidents = async () => {
    try {
      setLoading(true);
      const response = await listResidents();
      setResidents(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch residents:', err);
      setError('無法載入住戶資料');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ isVisible: true, message, type });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const handleCreateSuccess = () => {
    refreshResidents();
    showToast('住戶創建成功！', 'success');
  };

  const handleBulkImportSuccess = () => {
    refreshResidents();
    showToast('批量匯入完成！', 'success');
  };

  if (loading) {
    return (
      <div className="residents-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>載入住戶資料中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="residents-page">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>載入失敗</h3>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            重新載入
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="residents-page">
      {/* 頁面標題 */}
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">
            <span className="title-icon">🏠</span>
            住戶清單
          </h1>
          <p className="page-subtitle">管理社區住戶資訊</p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            ➕ 新增住戶
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setIsBulkImportModalOpen(true)}
          >
            📄 批量匯入
          </button>
        </div>
      </div>

      {/* 搜尋和篩選 */}
      <div className="controls-section">
        <div className="search-container">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="搜索住戶編號、電子信箱或社區名稱..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="search-input"
            />
            {searchTerm && (
              <button className="clear-btn" onClick={() => setSearchTerm('')}>
                ✖️
              </button>
            )}
          </div>
        </div>
        <div className="filter-container">
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="items-select"
          >
            <option value={5}>5 筆/頁</option>
            <option value={10}>10 筆/頁</option>
            <option value={20}>20 筆/頁</option>
            <option value={50}>50 筆/頁</option>
          </select>
        </div>
      </div>

      {/* 住戶表格 */}
      <div className="table-wrapper">
        <table className="residents-table">
          <thead>
            <tr>
              <th
                className="col-code sortable"
                onClick={() => handleSort('code')}
              >
                住戶編號 <span className="sort-icon">{getSortIcon('code')}</span>
              </th>
              <th
                className="col-sqm sortable"
                onClick={() => handleSort('residentSqm')}
              >
                坪數 <span className="sort-icon">{getSortIcon('residentSqm')}</span>
              </th>
              <th className="col-email">
                電子信箱
              </th>
              <th
                className="col-community sortable"
                onClick={() => handleSort('community')}
              >
                社區 <span className="sort-icon">{getSortIcon('community')}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentResidents.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-data-row">
                  <div className="no-data">
                    <span className="no-data-icon">📭</span>
                    <span>找不到符合條件的住戶</span>
                  </div>
                </td>
              </tr>
            ) : (
              currentResidents.map((resident, index) => (
                <tr key={resident.id} className={`data-row ${index % 2 === 0 ? 'even' : 'odd'}`}>
                  <td className="col-code">
                    <span className="code-badge">{resident.code}</span>
                  </td>
                  <td className="col-sqm">
                    <span className="sqm-value">{resident.residentSqm}</span>
                    <span className="sqm-unit">坪</span>
                  </td>
                  <td className="col-email">
                    {resident.email ? (
                      <a href={`mailto:${resident.email}`} className="email-link">
                        {resident.email}
                      </a>
                    ) : (
                      <span className="no-email">未提供</span>
                    )}
                  </td>
                  <td className="col-community">
                    <span className="community-badge">
                      {resident.community?.name || '-'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 分頁 */}
      {totalPages > 1 && (
        <div className="pagination-section">
          <div className="pagination-info">
            顯示第 {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredAndSortedResidents.length)} 筆，
            共 {filteredAndSortedResidents.length} 筆
          </div>
          <div className="pagination-controls">
            <button
              className="btn btn-sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              上一頁
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page =>
                page === 1 ||
                page === totalPages ||
                Math.abs(page - currentPage) <= 2
              )
              .map((page, index, arr) => (
                <React.Fragment key={page}>
                  {index > 0 && arr[index - 1] < page - 1 && (
                    <span className="pagination-ellipsis">...</span>
                  )}
                  <button
                    className={`btn btn-sm ${currentPage === page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                </React.Fragment>
              ))}
            <button
              className="btn btn-sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              下一頁
            </button>
          </div>
        </div>
      )}

      {/* 新增住戶彈窗 */}
      <CreateResidentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* 批量匯入Modal */}
      <BulkImportModal
        isOpen={isBulkImportModalOpen}
        onClose={() => setIsBulkImportModalOpen(false)}
        onSuccess={handleBulkImportSuccess}
      />

      {/* Toast 提示 */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={3000}
      />
    </div>
  );
}

export default ResidentsList;
