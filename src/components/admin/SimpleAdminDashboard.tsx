import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BookOpen, CalendarIcon, RefreshCw, Search, Users, X } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { ProgressDisplay } from '@/components/admin/ProgressDisplay';

const SimpleAdminDashboard: React.FC = () => {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'enrollments' | 'users'>('enrollments');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const fetchedRef = useRef(false);
  const lastProgressHydrateAtRef = useRef<number>(0);
  const { toast } = useToast();
  const [updatingEnrollmentId, setUpdatingEnrollmentId] = useState<string | null>(null);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<any | null>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [enrollmentSearchQuery, setEnrollmentSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

  const getSupabaseConfig = () => {
    const supabaseUrl =
      (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
      (supabase as any)?.supabaseUrl ||
      'https://jpafcmixtchvtrkhltst.supabase.co';
    const supabaseAnonKey =
      (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
      (supabase as any)?.supabaseKey ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwYWZjbWl4dGNodnRya2hsdHN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1MzIzODYsImV4cCI6MjA2OTEwODM4Nn0.dR0-DW8_ekftD9DZjGutGuyh4kiPG338NQ367tC8Pcw';
    return { supabaseUrl, supabaseAnonKey };
  };

  const mergeProgressIntoEnrollments = (base: any[], fromFn: any[]) => {
    const byId = new Map<string, any>();
    const byUserCourse = new Map<string, any>();

    for (const e of (fromFn || [])) {
      if (e?.id) byId.set(String(e.id), e);
      const uid = String(e?.user_id || '');
      const cid = String(e?.course_id || '');
      if (uid && cid) byUserCourse.set(`${uid}::${cid}`, e);
    }

    return (base || []).map((e) => {
      const match = (e?.id && byId.get(String(e.id))) || byUserCourse.get(`${String(e?.user_id || '')}::${String(e?.course_id || '')}`);
      if (!match) return e;

      const p = match?.progress ?? match?.progress_percentage;
      if (p === undefined || p === null) return e;
      return {
        ...e,
        progress: p,
        progress_percentage: p,
      };
    });
  };

  const maybeHydrateProgressFromEdgeFn = async (currentEnrollments: any[]) => {
    const now = Date.now();
    if (now - (lastProgressHydrateAtRef.current || 0) < 10000) return;

    const approved = (currentEnrollments || []).filter((e) => {
      const s = String(e?.status || '').toLowerCase();
      return s === 'approved' || s.includes('approved');
    });
    if (approved.length === 0) return;

    lastProgressHydrateAtRef.current = now;
    try {
      const fnResp = await fetchAdminDashboardData();
      const fnErr = (fnResp as any)?.error;
      const fnData = (fnResp as any)?.data;
      if (fnErr) throw new Error(fnErr?.message || String(fnErr));
      const fnEnrollments = Array.isArray(fnData?.enrollments)
        ? fnData.enrollments
        : Array.isArray(fnData?.pendingEnrollments)
          ? fnData.pendingEnrollments
          : [];

      setEnrollments((prev) => mergeProgressIntoEnrollments(prev, fnEnrollments));
    } catch {
      // Non-fatal: keep existing data if edge function not available
    }
  };

  const withTimeout = async <T,>(promise: Promise<T>, ms: number, message: string): Promise<T> => {
    let timeoutId: number | undefined;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = window.setTimeout(() => reject(new Error(message)), ms);
    });
    try {
      return await Promise.race([promise, timeoutPromise]);
    } finally {
      if (timeoutId) window.clearTimeout(timeoutId);
    }
  };

  const getAuthHeaders = async () => {
    const { supabaseAnonKey } = getSupabaseConfig();
    let bearer = supabaseAnonKey;
    try {
      const sessionResp = await withTimeout(
        supabase.auth.getSession(),
        3000,
        'Auth timed out'
      );
      const session = (sessionResp as any)?.data?.session;
      bearer = session?.access_token || supabaseAnonKey;
    } catch {
      bearer = supabaseAnonKey;
    }
    return {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${bearer}`,
      Accept: 'application/json',
    };
  };

  const fetchPostgrest = async (pathWithQuery: string, ms: number, label: string) => {
    const { supabaseUrl } = getSupabaseConfig();
    const headers = await getAuthHeaders();
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), ms);
    try {
      const resp = await fetch(`${supabaseUrl}/rest/v1/${pathWithQuery}`, {
        method: 'GET',
        headers,
        signal: controller.signal,
      });
      if (!resp.ok) {
        let detail = '';
        try {
          const json = await resp.json();
          detail = json?.message || json?.hint || json?.details || JSON.stringify(json);
        } catch {
          try {
            detail = await resp.text();
          } catch {
            detail = '';
          }
        }
        throw new Error(`${label} request failed (${resp.status}).${detail ? ` ${detail}` : ''}`);
      }
      return await resp.json();
    } catch (e: any) {
      const msg = String(e?.message || e || '');
      if (/aborted|abort/i.test(msg)) {
        throw new Error(`${label} query timed out. Please check your connection and try again.`);
      }
      if (/failed to fetch|networkerror|load failed/i.test(msg)) {
        throw new Error(`${label} request failed (network). A firewall/VPN or browser extension may be blocking Supabase.`);
      }
      throw e;
    } finally {
      window.clearTimeout(timeoutId);
    }
  };

  const handleUpdateEnrollment = async (enrollmentId: string, status: 'approved' | 'rejected') => {
    if (updatingEnrollmentId) return;
    setUpdatingEnrollmentId(enrollmentId);
    try {
      await adminUpdateEnrollmentStatus(enrollmentId, status);
      setEnrollments((prev) => prev.map((e) => (e.id === enrollmentId ? { ...e, status } : e)));
      toast({
        title: status === 'approved' ? 'Enrollment approved' : 'Enrollment rejected',
        description: status === 'approved' ? 'User can now access the course.' : 'User enrollment has been rejected.',
      });

      // Cross-tab refresh signal for student sessions (fallback if Realtime is blocked)
      try {
        localStorage.setItem('enrollment-status-refresh', JSON.stringify({
          enrollmentId,
          status,
          ts: Date.now(),
        }));
        window.dispatchEvent(new CustomEvent('enrollment-status-refresh', {
          detail: { enrollmentId, status }
        }));
      } catch {}

      fetchData(true);
    } catch (e: any) {
      toast({
        title: 'Update failed',
        description: String(e?.message || e || 'Unknown error'),
        variant: 'destructive',
      });
    } finally {
      setUpdatingEnrollmentId(null);
    }
  };

  const fetchAdminDashboardData = async () => {
    return await withTimeout(
      supabase.functions.invoke('get-admin-dashboard-data'),
      12000,
      'Admin dashboard request timed out. Please check your connection and try again.'
    );
  };

  const adminUpdateEnrollmentStatus = async (enrollmentId: string, status: 'approved' | 'rejected') => {
    const { supabaseUrl } = getSupabaseConfig();
    const headers = await getAuthHeaders();
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 12000);

    try {
      const resp = await fetch(`${supabaseUrl}/functions/v1/get-admin-dashboard-data`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enrollmentId, status }),
        signal: controller.signal,
      });

      const json = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        const msg = (json as any)?.error || (json as any)?.message || `Update failed (${resp.status})`;
        throw new Error(String(msg));
      }

      if ((json as any)?.error) {
        throw new Error(String((json as any).error));
      }

      return json;
    } catch (e: any) {
      const msg = String(e?.message || e || '');
      if (/aborted|abort/i.test(msg)) {
        throw new Error('Update request timed out. Please try again.');
      }
      throw e;
    } finally {
      window.clearTimeout(timeoutId);
    }
  };

  const fetchData = async (force = false) => {
    // Prevent duplicate fetches
    if (!force && fetchedRef.current && dataLoaded) return;
    
    setLoading(true);
    setError(null);

    console.log('🔄 Admin Dashboard: Fetching data...');

    try {
      const [enrollmentsResult, profilesResult] = await Promise.allSettled([
        fetchPostgrest('enrollments?select=*&order=enrolled_at.desc&limit=100', 12000, 'Enrollments'),
        fetchPostgrest('profiles?select=*&order=created_at.desc&limit=100', 12000, 'Profiles'),
      ]);

      if (enrollmentsResult.status === 'fulfilled') {
        const enrollData = Array.isArray(enrollmentsResult.value) ? enrollmentsResult.value : [];
        console.log('✅ Enrollments loaded:', enrollData?.length);
        setEnrollments(enrollData || []);
        void maybeHydrateProgressFromEdgeFn(enrollData || []);
      } else {
        console.error('❌ Enrollment error:', enrollmentsResult.reason);
        setError((prev) => prev || `Failed to load enrollments: ${String(enrollmentsResult.reason?.message || enrollmentsResult.reason || '')}`);
      }

      if (profilesResult.status === 'fulfilled') {
        const profileData = Array.isArray(profilesResult.value) ? profilesResult.value : [];
        console.log('✅ Profiles loaded:', profileData?.length);
        const userData = profileData || [];
        setUsers(userData);
        setFilteredUsers(userData);
      } else {
        console.error('❌ Profile error:', profilesResult.reason);
        setError((prev) => prev || `Failed to load profiles: ${String(profilesResult.reason?.message || profilesResult.reason || '')}`);
      }

      const combinedMsg = String(
        [
          enrollmentsResult.status === 'rejected' ? String(enrollmentsResult.reason?.message || enrollmentsResult.reason || '') : '',
          profilesResult.status === 'rejected' ? String(profilesResult.reason?.message || profilesResult.reason || '') : '',
        ]
          .filter(Boolean)
          .join(' | ')
      );

      if (/\((401|403)\)/.test(combinedMsg) || /permission denied|not authorized|row level security|\brls\b/i.test(combinedMsg)) {
        console.warn('⚠️ Falling back to get-admin-dashboard-data due to permissions/RLS:', combinedMsg);
        try {
          const fnResp = await fetchAdminDashboardData();
          const fnErr = (fnResp as any)?.error;
          const fnData = (fnResp as any)?.data;
          if (fnErr) {
            throw new Error(fnErr?.message || String(fnErr));
          }
          const fnUsers = Array.isArray(fnData?.users) ? fnData.users : [];
          const fnEnrollments = Array.isArray(fnData?.enrollments)
            ? fnData.enrollments
            : Array.isArray(fnData?.pendingEnrollments)
              ? fnData.pendingEnrollments
              : [];
          setUsers(fnUsers);
          setFilteredUsers(fnUsers);
          setEnrollments(fnEnrollments);
          setError(null);
        } catch (e: any) {
          setError(
            `Admin access is blocked by database permissions (401/403). Please update Supabase RLS/policies for admin, or ensure the get-admin-dashboard-data Edge Function is deployed and allowed. ${String(
              e?.message || e || ''
            )}`
          );
        }
      }

      setDataLoaded(true);
      fetchedRef.current = true;
    } catch (err: any) {
      console.error('❌ Fetch error:', err);
      setError(err.message || 'Failed to load data');
      setDataLoaded(true);
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search query and date range
  useEffect(() => {
    let filtered = [...users];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user => {
        const email = (user.email || '').toLowerCase();
        const firstName = (user.first_name || '').toLowerCase();
        const lastName = (user.last_name || '').toLowerCase();
        const fullName = `${firstName} ${lastName}`.trim();
        
        return email.includes(query) || fullName.includes(query);
      });
    }

    // Apply date range filter
    if (dateFrom) {
      filtered = filtered.filter(user => {
        if (!user.created_at) return false;
        const userDate = new Date(user.created_at);
        return userDate >= dateFrom;
      });
    }

    if (dateTo) {
      filtered = filtered.filter(user => {
        if (!user.created_at) return false;
        const userDate = new Date(user.created_at);
        // Set time to end of day for dateTo
        const endOfDay = new Date(dateTo);
        endOfDay.setHours(23, 59, 59, 999);
        return userDate <= endOfDay;
      });
    }

    setFilteredUsers(filtered);
  }, [users, searchQuery, dateFrom, dateTo]);

  const clearFilters = () => {
    setSearchQuery('');
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  useEffect(() => {
    console.log('🚀 SimpleAdminDashboard mounted');
    
    // Small delay to ensure auth is ready
    const timer = setTimeout(() => {
      console.log('⏰ Timer fired, calling fetchData');
      fetchData();
    }, 500);

    const safeRefresh = () => {
      fetchData(true);
    };

    const onRefreshEvent = () => {
      safeRefresh();
    };

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'admin-dashboard-refresh') {
        safeRefresh();
      }
    };

    let bc: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        bc = new BroadcastChannel('admin-dashboard');
        bc.addEventListener('message', (ev: MessageEvent) => {
          const data = (ev as any)?.data;
          if (data?.type === 'refresh-enrollments' || data?.type === 'refresh-admin') {
            safeRefresh();
          }
        });
      }
    } catch {
      bc = null;
    }

    const pollId = window.setInterval(() => {
      if (document.visibilityState === 'visible' && navigator.onLine) {
        safeRefresh();
      }
    }, 10000);

    window.addEventListener('refresh-admin-dashboard', onRefreshEvent as any);
    window.addEventListener('storage', onStorage);

    const channel = supabase
      .channel('simple-admin-enrollments-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'enrollments' },
        () => {
          safeRefresh();
        }
      )
      .subscribe();
    
    return () => {
      console.log('🔚 SimpleAdminDashboard unmounting');
      clearTimeout(timer);
      window.clearInterval(pollId);
      window.removeEventListener('refresh-admin-dashboard', onRefreshEvent as any);
      window.removeEventListener('storage', onStorage);
      supabase.removeChannel(channel);
      try {
        bc?.close();
      } catch {}
    };
  }, []);

  const openEnrollmentDetails = (enrollment: any) => {
    setSelectedEnrollment(enrollment);

    const userMatch = users.find((u) => {
      if (!u) return false;
      if (enrollment?.user_id && u.id && String(u.id) === String(enrollment.user_id)) return true;
      const uEmail = String(u.email || '').toLowerCase();
      const eEmail = String(enrollment?.user_email || '').toLowerCase();
      return Boolean(uEmail && eEmail && uEmail === eEmail);
    }) || null;

    setSelectedUser(userMatch);
    setDetailsOpen(true);
  };

  const getProofUrl = (enrollment: any): string | null => {
    const raw = enrollment?.proof_of_payment || enrollment?.payment_proof || null;
    if (!raw) return null;
    return String(raw);
  };

  const isImageProof = (url: string) => {
    const u = url.toLowerCase();
    if (u.startsWith('data:image/')) return true;
    return /\.(png|jpe?g|gif|webp)(\?|#|$)/i.test(u);
  };

  const getProofLabel = (url: string) => {
    const u = url.toLowerCase();
    if (u.startsWith('data:')) {
      if (u.startsWith('data:image/')) return 'Embedded image proof';
      if (u.startsWith('data:application/pdf')) return 'Embedded PDF proof';
      return 'Embedded proof';
    }
    try {
      const parsed = new URL(url);
      const parts = parsed.pathname.split('/').filter(Boolean);
      const last = parts[parts.length - 1] || '';
      return last || parsed.hostname;
    } catch {
      const parts = String(url).split('/').filter(Boolean);
      return parts[parts.length - 1] || 'Proof of payment';
    }
  };

  const getUserContactNumber = (user: any | null, enrollment: any | null): string | null => {
    const candidates = [
      user?.contact_number,
      user?.phone,
      user?.phone_number,
      user?.mobile,
      user?.mobile_number,
      user?.contact,
      enrollment?.contact_number,
      enrollment?.phone,
      enrollment?.phone_number,
    ];

    for (const c of candidates) {
      const v = String(c || '').trim();
      if (v) return v;
    }
    return null;
  };

  const getEnrollmentProgress = (enrollment: any): number => {
    const raw = enrollment?.progress ?? enrollment?.progress_percentage ?? enrollment?.course_progress ?? 0;
    const n = Number(raw);
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.min(100, Math.round(n)));
  };

  const normalizeEnrollmentStatus = (raw: any): 'pending' | 'approved' | 'rejected' | 'other' => {
    const s = String(raw || '')
      .trim()
      .toLowerCase()
      .replace(/[_-]+/g, ' ');
    if (!s) return 'pending';
    if (s === 'approved' || /\bapproved\b/.test(s) || /\bactive\b/.test(s)) return 'approved';
    if (s === 'rejected' || /\brejected\b/.test(s) || /\bdeclined\b/.test(s)) return 'rejected';
    if (s === 'pending' || /\bpending\b/.test(s) || /\breview\b/.test(s) || /\bawaiting\b/.test(s)) return 'pending';
    return 'other';
  };

  const pendingCount = enrollments.filter((e) => normalizeEnrollmentStatus(e?.status) === 'pending').length;
  const approvedCount = enrollments.filter((e) => normalizeEnrollmentStatus(e?.status) === 'approved').length;
  const rejectedCount = enrollments.filter((e) => normalizeEnrollmentStatus(e?.status) === 'rejected').length;

  const filteredEnrollments = React.useMemo(() => {
    const q = enrollmentSearchQuery.trim().toLowerCase();
    if (!q) return enrollments;
    return (enrollments || []).filter((e) => {
      const email = String(e?.user_email || '').toLowerCase();
      const course = String(e?.course_title || e?.course_id || '').toLowerCase();
      const status = String(e?.status || '').toLowerCase();
      return email.includes(q) || course.includes(q) || status.includes(q);
    });
  }, [enrollmentSearchQuery, enrollments]);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden lg:flex w-72 flex-col bg-slate-900 text-white">
          <div className="px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <div className="text-base font-semibold">Beta Skills</div>
                <div className="text-xs text-white/60">Admin</div>
              </div>
            </div>
          </div>

          <div className="px-4">
            <button
              type="button"
              onClick={() => setActiveTab('enrollments')}
              className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
                activeTab === 'enrollments' ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              <BookOpen className="h-5 w-5" />
              Enrollments
              <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-xs font-bold">{enrollments.length}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('users')}
              className={`mt-2 w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
                activeTab === 'users' ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              <Users className="h-5 w-5" />
              Users
              <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-xs font-bold">{users.length}</span>
            </button>
          </div>

          <div className="mt-auto px-6 py-6 text-xs text-white/50">
            Version 1.0
          </div>
        </aside>

        <main className="flex-1">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Admin Dashboard</h1>
                <p className="text-slate-600">Manage enrollments and users</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative w-full md:w-[320px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    className="h-10 w-full rounded-2xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-slate-900/20"
                    placeholder={activeTab === 'enrollments' ? 'Search enrollments...' : 'Search users...'}
                    value={activeTab === 'enrollments' ? enrollmentSearchQuery : searchQuery}
                    onChange={(e) => {
                      if (activeTab === 'enrollments') setEnrollmentSearchQuery(e.target.value);
                      else setSearchQuery(e.target.value);
                    }}
                  />
                </div>
                <Button onClick={fetchData} disabled={loading} className="rounded-2xl bg-slate-900 hover:bg-slate-800">
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Loading...' : 'Refresh'}
                </Button>
              </div>
            </div>

            {error && enrollments.length === 0 && users.length === 0 && (
              <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-2xl">
                {error}
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="rounded-3xl bg-gradient-to-r from-sky-500 to-blue-700 text-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-white/80">Total Enrollments</div>
                    <div className="mt-1 text-2xl font-bold">{enrollments.length}</div>
                  </div>
                  <div className="h-10 w-10 rounded-2xl bg-white/15 flex items-center justify-center">
                    <BookOpen className="h-5 w-5" />
                  </div>
                </div>
              </div>
              <div className="rounded-3xl bg-gradient-to-r from-fuchsia-500 to-rose-600 text-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-white/80">Pending</div>
                    <div className="mt-1 text-2xl font-bold">{pendingCount}</div>
                  </div>
                  <div className="h-10 w-10 rounded-2xl bg-white/15 flex items-center justify-center">
                    <RefreshCw className="h-5 w-5" />
                  </div>
                </div>
              </div>
              <div className="rounded-3xl bg-gradient-to-r from-violet-500 to-indigo-700 text-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-white/80">Approved</div>
                    <div className="mt-1 text-2xl font-bold">{approvedCount}</div>
                  </div>
                  <div className="h-10 w-10 rounded-2xl bg-white/15 flex items-center justify-center">
                    <BookOpen className="h-5 w-5" />
                  </div>
                </div>
              </div>
              <div className="rounded-3xl bg-gradient-to-r from-slate-700 to-slate-900 text-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-white/80">Rejected</div>
                    <div className="mt-1 text-2xl font-bold">{rejectedCount}</div>
                  </div>
                  <div className="h-10 w-10 rounded-2xl bg-white/15 flex items-center justify-center">
                    <X className="h-5 w-5" />
                  </div>
                </div>
              </div>
              <div className="rounded-3xl bg-gradient-to-r from-emerald-500 to-green-700 text-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-white/80">Total Users</div>
                    <div className="mt-1 text-2xl font-bold">{users.length}</div>
                  </div>
                  <div className="h-10 w-10 rounded-2xl bg-white/15 flex items-center justify-center">
                    <Users className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 rounded-3xl bg-white p-2 ring-1 ring-slate-200 w-full max-w-md">
              <button
                type="button"
                onClick={() => setActiveTab('enrollments')}
                className={`flex-1 rounded-2xl px-4 py-2 text-sm font-semibold transition-colors ${
                  activeTab === 'enrollments' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Enrollments
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('users')}
                className={`flex-1 rounded-2xl px-4 py-2 text-sm font-semibold transition-colors ${
                  activeTab === 'users' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Users
              </button>
            </div>

            {activeTab === 'enrollments' && (
              <div className="mt-6 rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
                <div className="px-6 py-5 flex items-center justify-between">
                  <div>
                    <div className="text-base font-semibold text-slate-900">Enrollments</div>
                    <div className="text-sm text-slate-500">Approve or reject pending enrollments</div>
                  </div>
                  <div className="text-sm text-slate-500">Showing {filteredEnrollments.length}</div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Course</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Action</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Progress</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                      {filteredEnrollments.length === 0 ? (
                        <tr>
                          <td className="px-4 py-10 text-center text-sm text-slate-500" colSpan={6}>
                            {dataLoaded ? 'No enrollments found' : 'Loading...'}
                          </td>
                        </tr>
                      ) : (
                        filteredEnrollments.map((e) => (
                          (() => {
                            const rawStatus = String(e.status || '').toLowerCase();
                            const isPending = rawStatus === 'pending' || rawStatus.includes('pending');
                            return (
                          <tr
                            key={e.id}
                            className="cursor-pointer hover:bg-slate-50"
                            onClick={() => openEnrollmentDetails(e)}
                          >
                            <td className="px-4 py-3 text-sm text-slate-800">{e.user_email || 'N/A'}</td>
                            <td className="px-4 py-3 text-sm text-slate-800">{e.course_title || e.course_id}</td>
                            <td className="px-4 py-3">
                              <Badge>{e.status || 'active'}</Badge>
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-500">
                              {e.enrolled_at ? new Date(e.enrolled_at).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {isPending ? (
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700"
                                    disabled={!!updatingEnrollmentId}
                                    onClick={(ev) => {
                                      ev.stopPropagation();
                                      handleUpdateEnrollment(e.id, 'approved');
                                    }}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="rounded-xl"
                                    disabled={!!updatingEnrollmentId}
                                    onClick={(ev) => {
                                      ev.stopPropagation();
                                      handleUpdateEnrollment(e.id, 'rejected');
                                    }}
                                  >
                                    Reject
                                  </Button>
                                </div>
                              ) : (
                                <span className="text-slate-400">-</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {rawStatus === 'approved' || rawStatus.includes('approved') ? (
                                <div
                                  className="w-[170px]"
                                  onClick={(ev) => {
                                    ev.stopPropagation();
                                  }}
                                >
                                  <ProgressDisplay progressPercentage={getEnrollmentProgress(e)} compact />
                                </div>
                              ) : (
                                <span className="text-slate-400">-</span>
                              )}
                            </td>
                          </tr>
                            );
                          })()
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

        <Dialog modal={false} open={detailsOpen} onOpenChange={(open) => {
          setDetailsOpen(open);
          if (!open) {
            setSelectedEnrollment(null);
            setSelectedUser(null);
          }
        }}>
          <DialogContent className="max-w-3xl w-[calc(100vw-2rem)] max-h-[90vh] overflow-y-auto overflow-x-hidden top-[4vh] translate-y-0">
            <DialogHeader>
              <DialogTitle>Enrollment Details</DialogTitle>
              <DialogDescription>
                Review the user information and proof of payment.
              </DialogDescription>
            </DialogHeader>

            {selectedEnrollment && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">User</div>
                    <div className="text-sm font-medium text-gray-900">
                      {selectedUser?.first_name || selectedUser?.last_name
                        ? `${selectedUser?.first_name || ''} ${selectedUser?.last_name || ''}`.trim()
                        : (selectedEnrollment.user_email || 'N/A')}
                    </div>
                    <div className="text-sm text-gray-600 break-words">{selectedEnrollment.user_email || selectedUser?.email || 'N/A'}</div>
                    {(() => {
                      const contact = getUserContactNumber(selectedUser, selectedEnrollment);
                      if (!contact) return null;
                      return (
                        <div className="text-sm text-gray-600 break-words">{contact}</div>
                      );
                    })()}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">Course</div>
                      <div className="text-sm text-gray-900">{selectedEnrollment.course_title || selectedEnrollment.course_id || 'N/A'}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">Status</div>
                      <div>
                        <Badge>{selectedEnrollment.status || 'active'}</Badge>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">Submitted</div>
                      <div className="text-sm text-gray-900">
                        {selectedEnrollment.enrolled_at ? new Date(selectedEnrollment.enrolled_at).toLocaleString() : 'N/A'}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">Approved At</div>
                      <div className="text-sm text-gray-900">
                        {selectedEnrollment.approved_at ? new Date(selectedEnrollment.approved_at).toLocaleString() : '—'}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">Payment Reference</div>
                      <div className="text-sm text-gray-900">{selectedEnrollment.payment_ref || selectedEnrollment.payment_reference || 'N/A'}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">Payment Date</div>
                      <div className="text-sm text-gray-900">{selectedEnrollment.payment_date || 'N/A'}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs text-gray-500">Proof of Payment</div>
                  {(() => {
                    const proofUrl = getProofUrl(selectedEnrollment);
                    if (!proofUrl) {
                      return <div className="text-sm text-gray-500">No proof uploaded.</div>;
                    }

                    return (
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-start gap-3">
                          <Button
                            variant="outline"
                            onClick={() => window.open(proofUrl, '_blank', 'noopener,noreferrer')}
                          >
                            View Proof
                          </Button>
                          <div className="text-xs text-gray-500 min-w-0 flex-1">
                            <div className="font-medium text-gray-700">{getProofLabel(proofUrl)}</div>
                            {!proofUrl.toLowerCase().startsWith('data:') && (
                              <div className="truncate">{proofUrl}</div>
                            )}
                          </div>
                        </div>

                        {isImageProof(proofUrl) ? (
                          <div className="border rounded-md overflow-hidden bg-white">
                            <img
                              src={proofUrl}
                              alt="Proof of payment"
                              className="w-full max-h-[360px] object-contain"
                            />
                          </div>
                        ) : (
                          <div className="text-sm text-gray-600">
                            Preview not available. Use “View Proof” to open.
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailsOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

            {activeTab === 'users' && (
              <div className="mt-6 rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
                <div className="px-6 py-5">
                  <div className="text-base font-semibold text-slate-900">Users</div>
                  <div className="text-sm text-slate-500">Filter and review registered users</div>
                </div>
                <div className="px-6 pb-6">
              {/* Filter Section */}
              <div className="mb-6 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Search Input */}
                  <div className="flex-1">
                    <Input
                      placeholder="Search by email or name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  {/* Date From */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full md:w-[200px] justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateFrom ? format(dateFrom, 'PPP') : 'From date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateFrom}
                        onSelect={setDateFrom}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  {/* Date To */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full md:w-[200px] justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateTo ? format(dateTo, 'PPP') : 'To date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateTo}
                        onSelect={setDateTo}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>

                  {/* Clear Filters Button */}
                  {(searchQuery || dateFrom || dateTo) && (
                    <Button
                      variant="ghost"
                      onClick={clearFilters}
                      className="w-full md:w-auto"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Clear
                    </Button>
                  )}
                </div>

                {/* Filter Summary */}
                {(searchQuery || dateFrom || dateTo) && (
                  <div className="text-sm text-gray-600">
                    Showing {filteredUsers.length} of {users.length} users
                  </div>
                )}
              </div>

              {/* Users Table */}
              {users.length === 0 ? (
                <p className="text-slate-500 text-center py-8">
                  {dataLoaded ? 'No users found' : 'Loading...'}
                </p>
              ) : filteredUsers.length === 0 ? (
                <p className="text-slate-500 text-center py-8">
                  No users match the current filters
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Phone</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Role</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Registered</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                      {filteredUsers.map((u) => (
                        <tr key={u.id}>
                          <td className="px-4 py-3 text-sm text-slate-800">{u.email || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm text-slate-800">
                            {u.first_name || u.last_name 
                              ? `${u.first_name || ''} ${u.last_name || ''}`.trim()
                              : 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">
                            {u.contact_number || 'Not provided'}
                          </td>
                          <td className="px-4 py-3">
                            <Badge>{u.role || 'student'}</Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-500">
                            {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SimpleAdminDashboard;
