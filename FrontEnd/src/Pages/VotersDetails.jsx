/* eslint-disable no-unused-vars */
import React, { useState, useMemo, useEffect } from 'react';
import TopNav from '../Components/TopNav';
import BannerImage from '../assets/Rectangle _5189.png';
import LogoImage from '../assets/Ellipse 20.png';
import {
  Share2,
  ChevronLeft,
  Search,
  Users,
  Download,
  ChevronUp,
  ChevronDown,
  DeleteIcon,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import VotersRegistrationLink from '../Components/votersregistrationlink';
import { toast } from 'react-toastify';
import FullPageLoader from '../Components/FullPageLoader';

// A new component for the mobile-friendly card view
const VoterCard = ({ voter, isClosedContest, columns = [] }) => (
  <div className='bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-4 last:mb-0'>
    <div className='flex justify-between items-start mb-3'>
      <div className='flex items-center gap-3'>
        <div className='w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center'>
          <Users className='w-5 h-5 text-gray-500' />
        </div>
        <div>
          <h4 className='font-bold text-gray-900'>{voter.name}</h4>
          <p className='text-xs text-gray-500'>{voter.email}</p>
        </div>
      </div>
    </div>
    <div className='grid grid-cols-2 gap-3 text-sm'>
      {columns.filter(c => c.key !== 'name' && c.key !== 'email').map(col => (
        <div key={col.key}>
          <p className='text-gray-500 text-xs mb-1'>{col.label}</p>
          <p className='text-gray-900 font-medium'>
            {col.isCustom
              ? voter.customData?.[col.originalKey] || '--'
              : col.key === 'votingDate'
                ? voter.votingDate
                  ? new Date(voter.votingDate).toLocaleDateString()
                  : '--'
                : voter[col.key] || '--'}
          </p>
        </div>
      ))}
    </div>
  </div>
);

const VotersDetails = () => {
  const { contestId } = useParams();
  const [contest, setContest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();
  const [isVotersRegLinkOpen, setIsVotersRegLinkOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [voterToDelete, setVoterToDelete] = useState(null); // { id, name }

  const votersRegLink =
    contest?.isClosedContest && contest?.closedContestType === 'pre-registration'
      ? `${window.location.origin}/voterregistration/${contestId}`
      : `${window.location.origin}/vote/${contestId}`;

  useEffect(() => {
    const fetchContest = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`/api/contest/${contestId}`);
        setContest(res.data.contest);
      } catch (err) {
        console.error('Failed to fetch contest:', err);
      } finally {
        setIsLoading(false);
      }
    };
    if (contestId) fetchContest();
  }, [contestId]);

  const allVoters = useMemo(() => {
    if (!contest) return [];

    if (contest?.isClosedContest) {
      return contest?.closedContestVoters || [];
    }

    const seen = new Map();
    (contest?.positions || []).forEach((pos) => {
      (pos.voters || []).forEach((v) => {
        if (!seen.has(v.email)) seen.set(v.email, v);
      });
    });
    return Array.from(seen.values());
  }, [contest]);

  const voterDetails = useMemo(
    () =>
      allVoters.map((v) => ({
        id: v._id || v.id,
        name: v.name,
        email: v.email,
        votingDate: v.addedDate || v.votingDate || null,
        customData: v.customData || {},
      })),
    [allVoters]
  );

  const columns = useMemo(() => {
    if (!contest) return [];

    const baseCols = [
      { key: 'name', label: 'Full Name' },
      { key: 'email', label: 'Email Address' },
    ];

    if (contest.isClosedContest && contest.closedContestType === 'bulk-upload') {
      const customKeys = new Set();
      // Reserved keys already shown in baseCols — skip them
      const RESERVED = new Set(['name', 'email']);
      allVoters.forEach((v) => {
        if (v.customData) {
          Object.keys(v.customData).forEach((k) => {
            if (!RESERVED.has(k.toLowerCase())) customKeys.add(k);
          });
        }
      });

      const customCols = Array.from(customKeys).map((key) => ({
        key: `customData.${key}`,
        label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
        isCustom: true,
        originalKey: key,
      }));

      return [
        ...baseCols,
        ...customCols,
        { key: 'votingDate', label: 'Registration Date' },
      ];
    }

    const dateLabel =
      contest.isClosedContest &&
        contest.closedContestType === 'pre-registration'
        ? 'Registration Date'
        : 'Voting Date';

    return [...baseCols, { key: 'votingDate', label: dateLabel }];
  }, [contest, allVoters]);

  const filteredData = useMemo(() => {
    let filtered = voterDetails.filter(
      (v) =>
        (v.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (v.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    filtered.sort((a, b) => {
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
      return sortDirection === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });
    return filtered;
  }, [voterDetails, searchTerm, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }) =>
    sortField === field ? (
      sortDirection === 'asc' ? (
        <ChevronUp className='w-4 h-4 text-blue-600' />
      ) : (
        <ChevronDown className='w-4 h-4 text-blue-600' />
      )
    ) : (
      <ChevronUp className='w-4 h-4 opacity-30' />
    );

  const totalContestants =
    contest?.positions?.reduce(
      (sum, pos) => sum + (pos.contestants?.length || 0),
      0
    ) || 0;

  const normalizeMultiplier = (m) => {
    const n = Number(m);
    return Number.isFinite(n) && n > 0 ? n : 1;
  };

  const calculateTotalVotes = (contest) => {
    if (!contest) return 0;
    if (contest.isClosedContest) {
      return (contest.closedContestVoters || []).reduce((sum, voter) => {
        const multiplier = normalizeMultiplier(voter.multiplier);
        const votesCast = voter.votedFor?.length || 0;
        return sum + votesCast * multiplier;
      }, 0);
    }
    return (contest.positions || []).reduce((total, pos) => {
      const posSum = (pos.voters || []).reduce((s, v) => {
        return s + normalizeMultiplier(v.multiplier);
      }, 0);
      return total + posSum;
    }, 0);
  };

  const totalVotes = useMemo(() => calculateTotalVotes(contest), [contest]);
  const [loading, setLoading] = useState(false);

  const confirmDeleteVoter = async () => {
    if (!voterToDelete || loading) return;
    const { id } = voterToDelete;
    setLoading(true);
    try {
      toast.promise(
        axios.delete(`/api/contest/contests/${contestId}/voters/${id}`),
        {
          pending: 'Deleting voter...',
          success: 'Voter deleted successfully',
          error: 'Error deleting voter',
        }
      );
      setContest((prev) => ({
        ...prev,
        closedContestVoters: prev.closedContestVoters.filter(
          (v) => v._id !== id
        ),
      }));
    } catch (err) {
      console.error('Delete voter failed:', err);
      toast.error(err.response?.data?.message || 'Error deleting voter');
    } finally {
      setLoading(false);
      setVoterToDelete(null);
    }
  };

  if (isLoading) return <FullPageLoader />;

  return (
    <div className='min-h-screen bg-[#f8f8f8]'>
      {/* Delete Confirmation Modal */}
      {voterToDelete && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>
          <div className='bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4'>
            <div className='text-center'>
              <div className='mx-auto w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-4'>
                <DeleteIcon className='w-7 h-7 text-red-600' />
              </div>
              <h3 className='text-xl font-bold text-gray-900 mb-2'>Delete Voter?</h3>
              <p className='text-gray-600 text-sm mb-6'>
                Are you sure you want to delete{' '}
                <span className='font-semibold text-gray-900'>{voterToDelete.name}</span>?
                This action cannot be undone.
              </p>
              <div className='flex gap-3'>
                <button
                  onClick={() => setVoterToDelete(null)}
                  className='flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors'
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteVoter}
                  disabled={loading}
                  className='flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-60 transition-colors'
                >
                  {loading ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <TopNav />
      <div className='px-4 sm:px-8 py-6 max-w-6xl mx-auto'>
        <div className='flex items-center gap-2 md:gap-4 mb-6 md:mb-8'>
          <button
            onClick={() => navigate(-1)}
            className='p-2 rounded-full hover:bg-gray-200 transition-colors'
            aria-label='Back to Contest Details'
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className='text-xl md:text-2xl lg:text-3xl text-left font-bold text-gray-900 mb-0'>
            Voters Details
          </h2>
        </div>

        <div className='relative mb-4 md:mb-6 h-32 md:h-48 lg:h-64'>
          <img
            src={contest?.coverImageUrl || BannerImage}
            alt='Contest Banner'
            className='w-full object-cover rounded-lg h-full absolute inset-0'
          />
        </div>

        <div className='relative z-10 bg-white shadow-lg rounded-3xl p-4 md:p-6 lg:p-8 -mt-20 md:-mt-24 lg:-mt-32 mx-2 md:mx-4'>
          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6'>
            <div className='flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6'>
              <div className='h-16 w-16 md:h-20 md:w-20 rounded-full flex-shrink-0 flex items-center justify-center border-4 border-black overflow-hidden'>
                <img
                  src={contest?.contestLogoImageUrl || LogoImage}
                  alt='Logo'
                  className='w-full h-full object-cover'
                />
              </div>

              <div className='text-center md:text-left'>
                <h2 className='text-xl md:text-2xl lg:text-[32px] font-bold text-gray-900 mb-2'>
                  {contest?.title || 'Contest Name'}
                </h2>
                <p className='text-gray-600 max-w-lg text-sm lg:text-base'>
                  {contest?.description || ''}
                </p>

                <div className='flex items-center justify-center md:justify-start gap-6 md:gap-8 mt-4'>
                  <div>
                    <span className='text-xl md:text-3xl lg:text-4xl font-bold text-gray-900'>
                      {totalVotes}
                    </span>
                    <span className='text-gray-600 ml-2 text-sm'>
                      Total Votes
                    </span>
                  </div>
                  <div>
                    <span className='text-xl md:text-3xl lg:text-4xl font-bold text-gray-900'>
                      {totalContestants || 0}
                    </span>
                    <span className='text-gray-600 ml-2 text-sm'>
                      Contestants
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className='flex flex-col gap-3 w-full lg:w-auto mt-4 lg:mt-0'>
              <button
                className='flex items-center justify-center gap-2 px-4 py-2 border border-[#000000] rounded-lg hover:bg-teal-900 hover:text-white transition-colors text-sm font-medium'
                onClick={() => {
                  setIsVotersRegLinkOpen(true);
                }}
              >
                <Share2 size={16} />
                {contest?.isClosedContest && contest?.closedContestType === 'pre-registration'
                  ? 'Share Voters Registration Link'
                  : 'Share Voting Link'}
              </button>
              <VotersRegistrationLink
                open={isVotersRegLinkOpen}
                onClose={() => setIsVotersRegLinkOpen(false)}
                link={votersRegLink}
              />
            </div>
          </div>
        </div>

        <div className='p-4 md:p-6 lg:p-8 mt-6 md:mt-8'>
          <div className='max-w-7xl mx-auto'>
            <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6 mb-4 md:mb-6'>
              <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                <div className='flex items-center gap-3'>
                  <div className='p-2 bg-blue-100 rounded-xl'>
                    <Users className='w-6 h-6 text-blue-600' />
                  </div>
                  <div className='text-left'>
                    <h2 className='text-md font-bold text-gray-900'>
                      Voters Details
                    </h2>
                    <p className='text-gray-600 text-sm'>
                      {filteredData.length} of {voterDetails.length} voters
                    </p>
                  </div>
                </div>
                <div className='flex gap-3'>
                  <button className='flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm'>
                    <Download className='w-4 h-4' />
                    Export
                  </button>
                </div>
              </div>
            </div>

            <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6 mb-4 md:mb-6'>
              <div className='flex flex-col md:flex-row gap-4'>
                <div className='flex-1 relative'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
                  <input
                    type='text'
                    placeholder='Search by name or email...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                  />
                </div>
              </div>
            </div>

            {contest?.isClosedContest ? (
              <>


                {/* Mobile view for closed contest table */}
                <div className='block lg:hidden'>
                  <div className='py-4 px-2'>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((reg, idx) => (
                        <VoterCard
                          key={reg.id}
                          voter={reg}
                          isClosedContest={true}
                          columns={columns}
                        />
                      ))
                    ) : (
                      <div className='py-12 text-center text-gray-500'>
                        <div className='flex flex-col items-center gap-3'>
                          <div className='p-3 bg-gray-100 rounded-full'>
                            <Users className='w-8 h-8 text-gray-400' />
                          </div>
                          <div>
                            <h3 className='text-lg font-medium text-gray-900'>
                              No registrations found
                            </h3>
                            <p className='text-gray-500'>
                              Registered voters will appear here.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Desktop table view for closed contest */}
                <div className='hidden lg:block bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8'>
                  <div className='p-4 md:p-6 border-b border-gray-200'>
                    <h3 className='text-lg font-bold text-gray-900 mb-2'>
                      Voter Registrations
                    </h3>
                    <p className='text-gray-600 text-sm mb-2'>
                      Preview of all pre-registered voters
                    </p>
                  </div>
                  <div className='overflow-x-auto'>
                    <table className='min-w-full text-left table-auto'>
                      <thead className='bg-gray-50 border-b border-gray-200'>
                        <tr>
                          <th className='py-4 px-6 font-semibold text-gray-900 whitespace-nowrap'>
                            S/N
                          </th>
                          {columns.map((col) => (
                            <th
                              key={col.key}
                              className='py-4 px-6 font-semibold text-gray-900 whitespace-nowrap'
                            >
                              {col.label}
                            </th>
                          ))}
                          <th className='py-4 px-6 font-semibold text-gray-900 text-right'>
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-gray-100'>
                        {paginatedData.length > 0 ? (
                          paginatedData.map((reg, idx) => (
                            <tr
                              key={reg.id}
                              className='hover:bg-gray-50 transition-colors'
                            >
                              <td className='py-4 px-6 text-gray-900 font-medium whitespace-nowrap'>
                                {startIndex + idx + 1}
                              </td>
                              {columns.map((col) => (
                                <td
                                  key={col.key}
                                  className='py-4 px-6 text-gray-600 whitespace-nowrap'
                                >
                                  {col.isCustom
                                    ? reg.customData?.[col.originalKey] || '--'
                                    : col.key === 'votingDate'
                                      ? reg.votingDate
                                        ? new Date(reg.votingDate).toLocaleDateString()
                                        : '--'
                                      : reg[col.key] || '--'}
                                </td>
                              ))}
                              <td className='py-4 px-6 text-right'>
                                <button
                                  onClick={() => setVoterToDelete({ id: reg.id, name: reg.name })}
                                  className='text-red-600 hover:text-red-800 transition-colors p-1 rounded-full hover:bg-red-100'
                                >
                                  <DeleteIcon className='w-5 h-5' />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan='5'
                              className='py-12 text-center text-gray-500'
                            >
                              <div className='flex flex-col items-center gap-3'>
                                <div className='p-3 bg-gray-100 rounded-full'>
                                  <Users className='w-8 h-8 text-gray-400' />
                                </div>
                                <div>
                                  <h3 className='text-lg font-medium text-gray-900'>
                                    No registrations found
                                  </h3>
                                  <p className='text-gray-500'>
                                    Registered voters will appear here.
                                  </p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                </div>

                {totalPages > 1 && (
                  <div className='flex flex-col md:flex-row items-center justify-between px-4 md:px-6 py-4 bg-gray-50 border-t border-gray-200 gap-2 mt-0'>
                    <div className='text-sm text-gray-700'>
                      Showing {startIndex + 1} to{' '}
                      {Math.min(startIndex + itemsPerPage, filteredData.length)}{' '}
                      of {filteredData.length} voters
                    </div>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className='px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 text-sm border rounded-md transition-colors ${currentPage === page
                            ? 'bg-orange-600 text-white border-orange-600'
                            : 'border-gray-300 hover:bg-gray-100'
                            }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className='px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              // Open contest section
              <>
                {/* Mobile View */}
                <div className='block lg:hidden'>
                  <div className='py-4 px-2'>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((voter, idx) => (
                        <VoterCard
                          key={voter?.id}
                          voter={voter}
                          isClosedContest={false}
                          columns={columns}
                        />
                      ))
                    ) : (
                      <div className='py-12 text-center'>
                        <div className='flex flex-col items-center gap-3'>
                          <div className='p-3 bg-gray-100 rounded-full'>
                            <Users className='w-8 h-8 text-gray-400' />
                          </div>
                          <div>
                            <h3 className='text-lg font-medium text-gray-900'>
                              No voters found
                            </h3>
                            <p className='text-gray-500'>
                              Try adjusting your search or filter criteria.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Desktop View */}
                <div className='hidden lg:block bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8'>
                  <div className='p-4 md:p-6 border-b border-gray-200'>
                    <h3 className='text-lg font-bold text-gray-900 mb-2'>
                      Voters Details
                    </h3>
                    <p className='text-gray-600 text-sm mb-2'>
                      List of all voters who have cast their votes
                    </p>
                  </div>
                  <div className='overflow-x-auto'>
                    <table className='min-w-full text-left table-auto'>
                      <thead className='bg-gray-50 border-b border-gray-200'>
                        <tr>
                          <th className='py-4 px-6 font-semibold text-gray-900 whitespace-nowrap'>
                            S/N
                          </th>
                          {columns.map((col) => (
                            <th
                              key={col.key}
                              className='py-4 px-6 font-semibold text-gray-900 whitespace-nowrap'
                            >
                              {col.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-gray-100'>
                        {paginatedData.length > 0 ? (
                          paginatedData.map((voter, idx) => (
                            <tr
                              key={voter?.id}
                              className='hover:bg-gray-50 transition-colors'
                            >
                              <td className='py-4 px-6 text-gray-900 font-medium whitespace-nowrap'>
                                {startIndex + idx + 1}
                              </td>
                              {columns.map((col) => (
                                <td
                                  key={col.key}
                                  className='py-4 px-6 whitespace-nowrap'
                                >
                                  <div className='text-gray-600'>
                                    {col.isCustom
                                      ? voter.customData?.[col.originalKey] || '--'
                                      : col.key === 'votingDate'
                                        ? voter.votingDate
                                          ? new Date(voter.votingDate).toLocaleDateString()
                                          : '--'
                                        : voter[col.key] || '--'}
                                  </div>
                                </td>
                              ))}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan='4' className='py-12 text-center'>
                              <div className='flex flex-col items-center gap-3'>
                                <div className='p-3 bg-gray-100 rounded-full'>
                                  <Users className='w-8 h-8 text-gray-400' />
                                </div>
                                <div>
                                  <h3 className='text-lg font-medium text-gray-900'>
                                    No voters found
                                  </h3>
                                  <p className='text-gray-500'>
                                    Try adjusting your search or filter
                                    criteria.
                                  </p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                {totalPages > 1 && (
                  <div className='flex flex-col md:flex-row items-center justify-between px-4 md:px-6 py-4 bg-gray-50 border-t border-gray-200 gap-2'>
                    <div className='text-sm text-gray-700'>
                      Showing {startIndex + 1} to{' '}
                      {Math.min(startIndex + itemsPerPage, filteredData.length)}{' '}
                      of {filteredData.length} voters
                    </div>
                    <div className='flex gap-2'>
                      <button
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className='px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 text-sm border rounded-md transition-colors ${currentPage === page
                              ? 'bg-orange-600 text-white border-orange-600'
                              : 'border-gray-300 hover:bg-gray-100'
                              }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                      <button
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        className='px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotersDetails;
