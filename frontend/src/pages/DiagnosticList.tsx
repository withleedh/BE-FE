import React, { useState, useEffect } from 'react';
import { Search, Download, Plus, Filter, Calendar, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import type { DiagnosticRecord, DiagnosticFilters } from '../types';
import { EngineType, DiagnosticStatus } from '../types';
import { diagnosticService } from '../services/diagnostic.service';
import Layout from '../components/Layout';

const DiagnosticList: React.FC = () => {
  const [records, setRecords] = useState<DiagnosticRecord[]>([]);
  const [selectedEngine, setSelectedEngine] = useState<EngineType>(EngineType.THETA);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState<DiagnosticStatus | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [stats, setStats] = useState({
    total: 0,
    normal: 0,
    warning: 0,
    critical: 0,
  });

  const engineTypes = [
    { type: EngineType.THETA, label: 'Theta Engine' },
    { type: EngineType.ATKINSON, label: 'Atkinson Engine' },
    { type: EngineType.GAMMA, label: 'Gamma Engine' },
    { type: EngineType.SMARTSTREAM, label: 'Smartstream Engine' },
  ];

  useEffect(() => {
    fetchRecords();
  }, [selectedEngine, currentPage, statusFilter]);

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const filters: DiagnosticFilters = {
        page: currentPage,
        size: 10,
        engineType: selectedEngine,
        search: searchQuery || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        status: statusFilter || undefined,
      };

      const response = await diagnosticService.getAll(filters);
      setRecords(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);

      // Calculate stats
      const normal = response.content.filter(r => r.status === DiagnosticStatus.NORMAL).length;
      const warning = response.content.filter(r => r.status === DiagnosticStatus.WARNING).length;
      const critical = response.content.filter(r => r.status === DiagnosticStatus.CRITICAL).length;

      setStats({
        total: response.totalElements,
        normal,
        warning,
        critical,
      });
    } catch (error) {
      console.error('Failed to fetch records:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(0);
    fetchRecords();
  };

  const handleDownload = async (format: 'csv' | 'pdf') => {
    try {
      const blob = await diagnosticService.download({
        engineType: selectedEngine,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        format,
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `diagnostics_${selectedEngine}_${new Date().toISOString()}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const getStatusBadge = (status: DiagnosticStatus) => {
    const styles = {
      [DiagnosticStatus.NORMAL]: 'bg-green-100 text-green-800',
      [DiagnosticStatus.WARNING]: 'bg-yellow-100 text-yellow-800',
      [DiagnosticStatus.CRITICAL]: 'bg-red-100 text-red-800',
    };

    const icons = {
      [DiagnosticStatus.NORMAL]: <CheckCircle size={14} />,
      [DiagnosticStatus.WARNING]: <AlertTriangle size={14} />,
      [DiagnosticStatus.CRITICAL]: <AlertCircle size={14} />,
    };

    return (
      <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
        {icons[status]}
        <span>{status}</span>
      </span>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-hyundai-navy">Engine Diagnostics</h1>
            <p className="text-gray-500 mt-1">Vehicle diagnostic records management system</p>
          </div>
          <button className="btn-primary flex items-center space-x-2">
            <Plus size={20} />
            <span>New Record</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card bg-gradient-to-br from-hyundai-navy to-hyundai-blue text-white">
            <div className="text-sm opacity-90">Total Records</div>
            <div className="text-3xl font-bold mt-2">{stats.total}</div>
          </div>
          <div className="card border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Normal</div>
                <div className="text-2xl font-bold text-green-600 mt-1">{stats.normal}</div>
              </div>
              <CheckCircle size={32} className="text-green-500" />
            </div>
          </div>
          <div className="card border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Warning</div>
                <div className="text-2xl font-bold text-yellow-600 mt-1">{stats.warning}</div>
              </div>
              <AlertTriangle size={32} className="text-yellow-500" />
            </div>
          </div>
          <div className="card border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Critical</div>
                <div className="text-2xl font-bold text-red-600 mt-1">{stats.critical}</div>
              </div>
              <AlertCircle size={32} className="text-red-500" />
            </div>
          </div>
        </div>

        {/* Engine Type Tabs */}
        <div className="card">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {engineTypes.map((engine) => (
              <button
                key={engine.type}
                onClick={() => {
                  setSelectedEngine(engine.type);
                  setCurrentPage(0);
                }}
                className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
                  selectedEngine === engine.type
                    ? 'bg-hyundai-navy text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {engine.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search VIN / Chassis
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search by VIN or chassis number..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hyundai-navy focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hyundai-navy focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hyundai-navy focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as DiagnosticStatus | '')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hyundai-navy focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value={DiagnosticStatus.NORMAL}>Normal</option>
                <option value={DiagnosticStatus.WARNING}>Warning</option>
                <option value={DiagnosticStatus.CRITICAL}>Critical</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-3 mt-4">
            <button
              onClick={handleSearch}
              className="btn-primary flex items-center space-x-2"
            >
              <Filter size={18} />
              <span>Apply Filters</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleDownload('csv')}
                className="btn-secondary flex items-center space-x-2"
              >
                <Download size={18} />
                <span>CSV</span>
              </button>
              <button
                onClick={() => handleDownload('pdf')}
                className="btn-secondary flex items-center space-x-2"
              >
                <Download size={18} />
                <span>PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Records Table */}
        <div className="card overflow-hidden">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-hyundai-navy mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading records...</p>
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No diagnostic records found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-hyundai-navy text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">VIN</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Chassis No.</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Model</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Year</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">RPM</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Temp (°C)</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Mileage</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Technician</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {records.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                      <td className="px-4 py-3 text-sm font-mono">{record.vin}</td>
                      <td className="px-4 py-3 text-sm">{record.chassisNumber}</td>
                      <td className="px-4 py-3 text-sm">{record.vehicleModel}</td>
                      <td className="px-4 py-3 text-sm">{record.modelYear}</td>
                      <td className="px-4 py-3 text-sm">{record.rpm.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm">{record.engineTemp}</td>
                      <td className="px-4 py-3 text-sm">{record.mileage.toLocaleString()} km</td>
                      <td className="px-4 py-3 text-sm">
                        {new Date(record.diagnosticDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">{getStatusBadge(record.status)}</td>
                      <td className="px-4 py-3 text-sm">{record.technician}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {currentPage * 10 + 1} to {Math.min((currentPage + 1) * 10, totalElements)} of {totalElements} records
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage >= totalPages - 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DiagnosticList;