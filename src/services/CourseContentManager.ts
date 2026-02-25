import { Course, Module, Lesson } from '@/types/course';
import { supabase } from '@/integrations/supabase/client';
import { unifiedEnrollmentManager } from './UnifiedEnrollmentManager';
import { logger } from '@/utils/logger';
import { saveCourseProgress, loadCourseProgress, syncAllCourseProgress } from '@/utils/courseProgressSync';

export interface CourseContentState {
  course: Course | null;
  modules: Module[];
  currentModule: Module | null;
  currentLesson: Lesson | null;
  loading: boolean;
  error: string | null;
  progress: number;
  enrollmentStatus: 'not_enrolled' | 'pending' | 'approved' | 'rejected';
  offlineContent: Map<string, any>;
  lastSyncTime: number;
  syncStatus: 'idle' | 'syncing' | 'failed' | 'offline';
  retryCount: number;
  lastError: Error | null;
  networkStatus: 'online' | 'offline';
}

export interface ContentLoadingOptions {
  enableOfflineCache: boolean;
  preloadNextModule: boolean;
  retryAttempts: number;
  syncInterval: number;
  enableRealTimeSync: boolean;
  maxOfflineStorage: number;
  enableProgressBackup: boolean;
}

export interface ProgressTrackingData {
  courseId: string;
  moduleId: string;
  lessonId: string;
  progress: number;
  timeSpent: number;
  completed: boolean;
  quizScores?: Record<string, number>;
  lastAccessed: string;
}

class CourseContentManager {
  private contentState: Map<string, CourseContentState> = new Map();
  private syncQueue: Set<string> = new Set();
  private retryQueue: Map<string, number> = new Map();
  private offlineStorage: Map<string, any> = new Map();
  private progressCache: Map<string, ProgressTrackingData> = new Map();
  private eventListeners: Map<string, Set<Function>> = new Map();
  private networkStatus: 'online' | 'offline' = 'online';
  private enrollmentStatusCache: Map<string, { status: string; timestamp: number }> = new Map();
  private realTimeSubscriptions: Map<string, any> = new Map();
  private offlineChanges: Map<string, any[]> = new Map();
  
  private defaultOptions: ContentLoadingOptions = {
    enableOfflineCache: true,
    preloadNextModule: true,
    retryAttempts: 3,
    syncInterval: 30000, // 30 seconds
    enableRealTimeSync: true,
    maxOfflineStorage: 50 * 1024 * 1024, // 50MB
    enableProgressBackup: true,
  };

  constructor() {
    try {
      this.initializeOfflineStorage();
      this.loadOfflineChanges();
      this.setupEnrollmentListeners();
      this.startSyncProcess();
      this.setupNetworkMonitoring();
      this.setupRealTimeSubscriptions();
      logger.info('✅ CourseContentManager initialized successfully');
    } catch (error) {
      logger.error('❌ Failed to initialize CourseContentManager:', error);
      // Don't throw to prevent breaking the entire application
      // The service will work in a degraded mode
    }
  }

  /**
   * Initialize offline storage and load cached content
   */
  private initializeOfflineStorage(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        const cachedContent = localStorage.getItem('course-content-cache');
        if (cachedContent) {
          const parsed = JSON.parse(cachedContent);
          this.offlineStorage = new Map(parsed);
          logger.info('📦 Loaded offline content cache:', this.offlineStorage.size, 'items');
        }
      } else {
        logger.info('📱 localStorage not available, skipping cache initialization');
      }
    } catch (error) {
      logger.error('❌ Failed to load offline content cache:', error);
      // Initialize empty map on error
      this.offlineStorage = new Map();
    }
  }

  /**
   * Setup enrollment status listeners for real-time updates
   */
  private setupEnrollmentListeners(): void {
    try {
      // Listen to enrollment status changes
      unifiedEnrollmentManager.addEventListener('enrollment-status-changed', (event: CustomEvent) => {
        try {
          const { enrollment } = event.detail;
          this.handleEnrollmentStatusChange(enrollment.course_id, enrollment.status);
        } catch (error) {
          logger.error('❌ Error handling enrollment status change event:', error);
        }
      });

      // Listen to enrollment updates
      unifiedEnrollmentManager.addEventListener('enrollment-updated', (event: CustomEvent) => {
        try {
          const { enrollment } = event.detail;
          this.syncEnrollmentStatus(enrollment.course_id, enrollment.user_email);
        } catch (error) {
          logger.error('❌ Error handling enrollment update event:', error);
        }
      });
      
      logger.info('✅ Enrollment listeners setup complete');
    } catch (error) {
      logger.error('❌ Failed to setup enrollment listeners:', error);
    }
  }

  /**
   * Start the background sync process
   */
  private startSyncProcess(): void {
    try {
      setInterval(() => {
        try {
          this.processSyncQueue();
          this.syncOfflineChanges();
        } catch (error) {
          logger.error('❌ Error in sync process:', error);
        }
      }, this.defaultOptions.syncInterval);
      
      logger.info('✅ Background sync process started');
    } catch (error) {
      logger.error('❌ Failed to start sync process:', error);
    }
  }

  /**
   * Setup network monitoring for offline/online detection
   */
  private setupNetworkMonitoring(): void {
    try {
      if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
        this.networkStatus = navigator.onLine ? 'online' : 'offline';

        window.addEventListener('online', () => {
          logger.info('🌐 Network status: online');
          this.networkStatus = 'online';
          this.updateAllNetworkStatus('online');
          this.syncOfflineChanges();
          this.emitEvent('network-status-changed', { status: 'online' });
        });

        window.addEventListener('offline', () => {
          logger.info('📱 Network status: offline');
          this.networkStatus = 'offline';
          this.updateAllNetworkStatus('offline');
          this.emitEvent('network-status-changed', { status: 'offline' });
        });
        
        logger.info('✅ Network monitoring setup complete');
      } else {
        // Server-side or environment without window/navigator
        this.networkStatus = 'online';
        logger.info('📱 Running in server environment, assuming online status');
      }
    } catch (error) {
      logger.error('❌ Failed to setup network monitoring:', error);
      this.networkStatus = 'online'; // Default to online
    }
  }

  /**
   * Setup real-time subscriptions for enrollment status changes
   */
  private setupRealTimeSubscriptions(): void {
    try {
      if (this.defaultOptions.enableRealTimeSync && supabase && typeof supabase.channel === 'function') {
        // Subscribe to enrollment changes
        const enrollmentSubscription = supabase
          .channel('enrollment-changes')
          .on('postgres_changes', 
            { 
              event: '*', 
              schema: 'public', 
              table: 'Enrollment' 
            }, 
            (payload) => {
              try {
                this.handleRealTimeEnrollmentChange(payload);
              } catch (error) {
                logger.error('❌ Error handling real-time enrollment change:', error);
              }
            }
          )
          .subscribe();

        this.realTimeSubscriptions.set('enrollment', enrollmentSubscription);

        // Subscribe to progress changes
        const progressSubscription = supabase
          .channel('progress-changes')
          .on('postgres_changes', 
            { 
              event: '*', 
              schema: 'public', 
              table: 'user_progress' 
            }, 
            (payload) => {
              try {
                this.handleRealTimeProgressChange(payload);
              } catch (error) {
                logger.error('❌ Error handling real-time progress change:', error);
              }
            }
          )
          .subscribe();

        this.realTimeSubscriptions.set('progress', progressSubscription);
        
        logger.info('✅ Real-time subscriptions setup complete');
      } else {
        logger.info('📱 Real-time subscriptions disabled or Supabase not available');
      }
    } catch (error) {
      logger.error('❌ Failed to setup real-time subscriptions:', error);
      // Don't throw error to prevent breaking the entire service
    }
  }

  /**
   * Handle real-time enrollment status changes
   */
  private handleRealTimeEnrollmentChange(payload: any): void {
    try {
      const { new: newRecord, old: oldRecord, eventType } = payload;
      const courseId = newRecord?.course_id || oldRecord?.course_id;
      const userEmail = newRecord?.user_email || oldRecord?.user_email;

      if (!courseId || !userEmail) return;

      logger.info('🔄 Real-time enrollment change:', { courseId, userEmail, eventType });

      // Update enrollment status cache
      if (newRecord) {
        this.enrollmentStatusCache.set(`${courseId}-${userEmail}`, {
          status: newRecord.status,
          timestamp: Date.now(),
        });
      }

      // Update course state if loaded
      const state = this.contentState.get(courseId);
      if (state && newRecord) {
        state.enrollmentStatus = newRecord.status;
        this.emitEvent('enrollment-status-changed', { 
          courseId, 
          userEmail, 
          status: newRecord.status,
          realTime: true 
        });
      }

      // If enrollment was approved, trigger content reload
      if (newRecord?.status === 'approved') {
        this.emitEvent('enrollment-approved', { courseId, userEmail, realTime: true });
      }
    } catch (error) {
      logger.error('❌ Error handling real-time enrollment change:', error);
    }
  }

  /**
   * Handle real-time progress changes
   */
  private handleRealTimeProgressChange(payload: any): void {
    try {
      const { new: newRecord, eventType } = payload;
      if (!newRecord) return;

      const { course_id: courseId, user_id: userId, progress } = newRecord;
      logger.info('🔄 Real-time progress change:', { courseId, userId, progress });

      // Update course state if loaded
      const state = this.contentState.get(courseId);
      if (state) {
        state.progress = progress;
        this.emitEvent('progress-updated', { 
          courseId, 
          progress,
          realTime: true 
        });
      }
    } catch (error) {
      logger.error('❌ Error handling real-time progress change:', error);
    }
  }

  /**
   * Update network status for all course states
   */
  private updateAllNetworkStatus(status: 'online' | 'offline'): void {
    for (const [courseId, state] of this.contentState.entries()) {
      state.networkStatus = status;
      if (status === 'offline') {
        state.syncStatus = 'offline';
      } else if (state.syncStatus === 'offline') {
        state.syncStatus = 'idle';
      }
    }
  }

  /**
   * Load course content with reliable module loading
   */
  async loadCourseContent(
    courseId: string, 
    userEmail: string,
    options: Partial<ContentLoadingOptions> = {}
  ): Promise<CourseContentState> {
    const opts = { ...this.defaultOptions, ...options };
    
    logger.info('🚀 Loading course content:', courseId, 'for user:', userEmail);

    // Initialize state if not exists
    if (!this.contentState.has(courseId)) {
      this.contentState.set(courseId, {
        course: null,
        modules: [],
        currentModule: null,
        currentLesson: null,
        loading: true,
        error: null,
        progress: 0,
        enrollmentStatus: 'not_enrolled',
        offlineContent: new Map(),
        lastSyncTime: 0,
        syncStatus: 'idle',
        retryCount: 0,
        lastError: null,
        networkStatus: this.networkStatus,
      });
    }

    const state = this.contentState.get(courseId)!;
    state.loading = true;
    state.error = null;

    try {
      // Check enrollment status first
      const enrollmentStatus = await this.getEnrollmentStatus(courseId, userEmail);
      state.enrollmentStatus = enrollmentStatus;

      if (enrollmentStatus !== 'approved') {
        logger.warn('⚠️ User not enrolled or enrollment not approved:', enrollmentStatus);
        state.loading = false;
        return state;
      }

      // Try to load from cache first
      const cachedContent = this.getCachedContent(courseId);
      if (cachedContent && this.isContentFresh(cachedContent)) {
        logger.info('📦 Using cached course content:', courseId);
        this.populateStateFromCache(state, cachedContent);
      } else {
        // Load from server with retry mechanism
        await this.loadContentFromServer(courseId, state, opts);
      }

      // Load progress data
      await this.loadProgressData(courseId, userEmail, state);

      // Preload next module if enabled
      if (opts.preloadNextModule && state.currentModule) {
        this.preloadNextModule(courseId, state.currentModule.id);
      }

      state.loading = false;
      state.lastSyncTime = Date.now();

      // Cache the content for offline use
      if (opts.enableOfflineCache) {
        this.cacheContent(courseId, state);
      }

      this.emitEvent('content-loaded', { courseId, state });
      logger.info('✅ Course content loaded successfully:', courseId);

    } catch (error) {
      logger.error('❌ Failed to load course content:', error);
      state.error = error instanceof Error ? error.message : 'Failed to load content';
      state.loading = false;

      // Try to use offline content as fallback
      const offlineContent = this.getOfflineContent(courseId);
      if (offlineContent) {
        logger.info('📱 Using offline content as fallback:', courseId);
        this.populateStateFromCache(state, offlineContent);
        state.error = 'Using offline content - some features may be limited';
      }
    }

    return state;
  }

  /**
   * Get enrollment status with synchronization across application areas
   */
  private async getEnrollmentStatus(courseId: string, userEmail: string): Promise<CourseContentState['enrollmentStatus']> {
    const cacheKey = `${courseId}-${userEmail}`;
    
    try {
      // Check cache first (for real-time updates)
      const cached = this.enrollmentStatusCache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp) < 60000) { // 1 minute cache
        logger.info('📋 Using cached enrollment status:', cached.status);
        return cached.status as CourseContentState['enrollmentStatus'];
      }

      // First check with UnifiedEnrollmentManager
      const enrollments = await unifiedEnrollmentManager.getUserEnrollments(userEmail);
      const enrollment = enrollments.find(e => e.course_id === courseId);

      if (enrollment) {
        logger.info('📋 Found enrollment via UnifiedEnrollmentManager:', enrollment.status);
        
        // Update cache
        this.enrollmentStatusCache.set(cacheKey, {
          status: enrollment.status,
          timestamp: Date.now(),
        });
        
        return enrollment.status as CourseContentState['enrollmentStatus'];
      }

      // Fallback to direct Supabase query
      const { data, error } = await supabase
        .from('Enrollment')
        .select('status')
        .eq('course_id', courseId)
        .eq('user_email', userEmail)
        .single();

      if (error || !data) {
        logger.info('📋 No enrollment found for course:', courseId);
        
        // Cache the not_enrolled status
        this.enrollmentStatusCache.set(cacheKey, {
          status: 'not_enrolled',
          timestamp: Date.now(),
        });
        
        return 'not_enrolled';
      }

      // Update cache
      this.enrollmentStatusCache.set(cacheKey, {
        status: data.status,
        timestamp: Date.now(),
      });

      return data.status as CourseContentState['enrollmentStatus'];
    } catch (error) {
      logger.error('❌ Error checking enrollment status:', error);
      
      // Try to use cached value even if expired
      const cached = this.enrollmentStatusCache.get(cacheKey);
      if (cached) {
        logger.warn('⚠️ Using expired cached enrollment status due to error');
        return cached.status as CourseContentState['enrollmentStatus'];
      }
      
      return 'not_enrolled';
    }
  }

  /**
   * Load content from server with retry mechanism
   */
  private async loadContentFromServer(
    courseId: string, 
    state: CourseContentState, 
    options: ContentLoadingOptions
  ): Promise<void> {
    let attempts = 0;
    let lastError: Error | null = null;

    while (attempts < options.retryAttempts) {
      try {
        logger.info(`🔄 Loading content from server (attempt ${attempts + 1}/${options.retryAttempts}):`, courseId);

        // Load course data
        const course = await this.fetchCourseData(courseId);
        state.course = course;

        // Load modules with lessons
        const modules = await this.fetchModulesData(courseId);
        state.modules = modules;

        // Set current module and lesson
        if (modules.length > 0) {
          state.currentModule = modules[0];
          if (modules[0].lessons.length > 0) {
            state.currentLesson = modules[0].lessons[0];
          }
        }

        logger.info('✅ Content loaded from server successfully:', courseId);
        return;

      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        attempts++;
        
        if (attempts < options.retryAttempts) {
          const delay = Math.pow(2, attempts) * 1000; // Exponential backoff
          logger.warn(`⚠️ Attempt ${attempts} failed, retrying in ${delay}ms:`, lastError.message);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error('Failed to load content after all retry attempts');
  }

  /**
   * Fetch course data from various sources
   */
  private async fetchCourseData(courseId: string): Promise<Course> {
    // Try to get from dynamic imports first (for static courses)
    try {
      const courseModule = await this.loadCourseModule(courseId);
      if (courseModule) {
        return courseModule;
      }
    } catch (error) {
      logger.warn('⚠️ Failed to load static course module:', error);
    }

    // Fallback to Supabase
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();

    if (error || !data) {
      logger.error('❌ Failed to load course module:', courseId, error);
      throw new Error(`Course not found: ${courseId}`);
    }

    return data as Course;
  }

  /**
   * Load course module dynamically
   */
  private async loadCourseModule(courseId: string): Promise<Course | null> {
    const courseModuleMap: Record<string, () => Promise<any>> = {
      'entrepreneurship-final': () => import('@/data/entrepreneurshipFinalCourse'),
      'ai-human-relations': () => import('@/data/aiHumanRelations/index'),
      'ai-and-human-relations': () => import('@/data/aiHumanRelations/index'),
      'roofing101': () => import('@/data/roofingCourse'),
      'plumbing101': () => import('@/data/plumbing101'),
      'solar101': () => import('@/data/solar101'),
      'tiling-101': () => import('@/data/tiling101'),
      'hair-dressing': () => import('@/data/hairDressing'),
      'nail-technician': () => import('@/data/nailTechnician'),
      'podcast-management-101': () => import('@/data/podcastManagement101Course'),
      'f9e8d7c6-b5a4-9382-c1d0-e9f8a7b6c5d5': () => import('@/data/soundEngineeringCourse'),
      'motor-mechanic-diesel': () => import('@/data/dieselMechanicCourse'),
      'selling-online': () => import('@/data/sellingOnline'),
      'online-trading': () => import('@/data/onlineTrading'),
      'emotional-intelligence': () => import('@/data/emotionalIntelligence'),
      'prophet': () => import('@/data/prophet'),
      'smart-home-automation': () => import('@/data/smartHomeAutomation'),
      'carpentry101': () => import('@/data/carpentry101'),
      'ai-assisted-programming': () => import('@/data/aiAssistedProgrammingCourse'),
      'ai-assisted-web-development': () => import('@/data/aiAssistedWebDevelopmentCourse'),
    };

    const loader = courseModuleMap[courseId];
    if (!loader) {
      return null;
    }

    try {
      const module = await loader();
      return module.default || module.aiHumanRelationsCourse || module.course || null;
    } catch (error) {
      logger.error('❌ Failed to load course module:', courseId, error);
      return null;
    }
  }

  /**
   * Fetch modules data
   */
  private async fetchModulesData(courseId: string): Promise<Module[]> {
    // For now, extract from course data
    // In the future, this could be a separate API call
    const course = await this.fetchCourseData(courseId);
    return (course as any).modules || [];
  }

  /**
   * Load progress data for the course
   */
  private async loadProgressData(courseId: string, userEmail: string, state: CourseContentState): Promise<void> {
    try {
      // Get user ID from auth
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const progressData = await loadCourseProgress(user.id, courseId);
      if (progressData) {
        state.progress = progressData.progress;
        
        // Update current position based on progress
        if (progressData.moduleId && progressData.lessonId) {
          const module = state.modules.find(m => m.id.toString() === progressData.moduleId);
          if (module) {
            state.currentModule = module;
            const lesson = module.lessons.find(l => l.id.toString() === progressData.lessonId);
            if (lesson) {
              state.currentLesson = lesson;
            }
          }
        }
      }
    } catch (error) {
      logger.error('❌ Failed to load progress data:', error);
    }
  }

  /**
   * Update progress with reliability improvements
   */
  async updateProgress(
    courseId: string,
    userEmail: string,
    moduleId: string,
    lessonId: string,
    progress: number,
    additionalData: Partial<ProgressTrackingData> = {}
  ): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const progressData: ProgressTrackingData = {
        courseId,
        moduleId,
        lessonId,
        progress,
        timeSpent: additionalData.timeSpent || 0,
        completed: progress >= 100,
        lastAccessed: new Date().toISOString(),
        ...additionalData,
      };

      // Cache progress locally first
      const progressKey = `${courseId}-${moduleId}-${lessonId}`;
      this.progressCache.set(progressKey, progressData);

      // Update course state immediately for responsive UI
      const state = this.contentState.get(courseId);
      if (state) {
        state.progress = progress;
        state.syncStatus = 'syncing';
      }

      // If offline, store changes for later sync
      if (this.networkStatus === 'offline') {
        this.storeOfflineChange(courseId, 'progress', progressData);
        if (state) {
          state.syncStatus = 'offline';
        }
        logger.info('📱 Stored progress update for offline sync:', progressKey);
        this.emitEvent('progress-updated', { courseId, moduleId, lessonId, progress, offline: true });
        return true;
      }

      // Try to save progress with enhanced retry mechanism
      let success = false;
      let retryCount = 0;
      const maxRetries = 3;

      while (!success && retryCount < maxRetries) {
        try {
          success = await saveCourseProgress(user.id, userEmail, courseId, progress, {
            moduleId,
            lessonId,
            ...additionalData,
          });

          if (success) {
            if (state) {
              state.syncStatus = 'idle';
              state.lastError = null;
              state.retryCount = 0;
            }
            break;
          }
        } catch (error) {
          logger.warn(`⚠️ Progress save attempt ${retryCount + 1} failed:`, error);
          if (state) {
            state.lastError = error instanceof Error ? error : new Error('Unknown error');
          }
        }

        retryCount++;
        if (retryCount < maxRetries) {
          // Exponential backoff
          const delay = Math.pow(2, retryCount) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      if (!success) {
        // Add to sync queue for background retry
        this.syncQueue.add(progressKey);
        if (state) {
          state.syncStatus = 'failed';
          state.retryCount = retryCount;
        }
        logger.warn('⚠️ Progress save failed after retries, added to sync queue:', progressKey);
      }

      // Update enrollment progress via UnifiedEnrollmentManager
      try {
        await unifiedEnrollmentManager.updateEnrollmentProgress(courseId, userEmail, progress);
      } catch (error) {
        logger.warn('⚠️ Failed to update enrollment progress:', error);
        // Don't fail the entire operation for this
      }

      // Backup progress to localStorage if enabled
      if (this.defaultOptions.enableProgressBackup) {
        this.backupProgressToStorage(progressKey, progressData);
      }

      this.emitEvent('progress-updated', { 
        courseId, 
        moduleId, 
        lessonId, 
        progress, 
        synced: success,
        retryCount 
      });
      
      return true;

    } catch (error) {
      logger.error('❌ Failed to update progress:', error);
      
      const state = this.contentState.get(courseId);
      if (state) {
        state.syncStatus = 'failed';
        state.lastError = error instanceof Error ? error : new Error('Unknown error');
      }
      
      return false;
    }
  }

  /**
   * Synchronize enrollment status across application areas
   */
  private async syncEnrollmentStatus(courseId: string, userEmail: string): Promise<void> {
    try {
      const status = await this.getEnrollmentStatus(courseId, userEmail);
      const state = this.contentState.get(courseId);
      
      if (state && state.enrollmentStatus !== status) {
        logger.info('🔄 Enrollment status changed:', courseId, state.enrollmentStatus, '->', status);
        state.enrollmentStatus = status;
        this.emitEvent('enrollment-status-changed', { courseId, status });
      }
    } catch (error) {
      logger.error('❌ Failed to sync enrollment status:', error);
    }
  }

  /**
   * Handle enrollment status changes
   */
  private handleEnrollmentStatusChange(courseId: string, newStatus: string): void {
    const state = this.contentState.get(courseId);
    if (state) {
      state.enrollmentStatus = newStatus as CourseContentState['enrollmentStatus'];
      
      // If enrollment was approved, reload content
      if (newStatus === 'approved') {
        logger.info('🎉 Enrollment approved, reloading content:', courseId);
        // Trigger content reload
        this.emitEvent('enrollment-approved', { courseId });
      }
    }
  }

  /**
   * Cache content for offline use
   */
  private cacheContent(courseId: string, state: CourseContentState): void {
    try {
      const cacheData = {
        course: state.course,
        modules: state.modules,
        timestamp: Date.now(),
        version: '1.0',
      };

      this.offlineStorage.set(courseId, cacheData);
      
      // Save to localStorage
      const cacheArray = Array.from(this.offlineStorage.entries());
      localStorage.setItem('course-content-cache', JSON.stringify(cacheArray));
      
      logger.info('📦 Content cached for offline use:', courseId);
    } catch (error) {
      logger.error('❌ Failed to cache content:', error);
    }
  }

  /**
   * Get cached content
   */
  private getCachedContent(courseId: string): any {
    return this.offlineStorage.get(courseId);
  }

  /**
   * Check if cached content is fresh (less than 1 hour old)
   */
  private isContentFresh(cachedContent: any): boolean {
    const maxAge = 60 * 60 * 1000; // 1 hour
    return cachedContent.timestamp && (Date.now() - cachedContent.timestamp) < maxAge;
  }

  /**
   * Get offline content
   */
  private getOfflineContent(courseId: string): any {
    return this.offlineStorage.get(courseId);
  }

  /**
   * Populate state from cached content
   */
  private populateStateFromCache(state: CourseContentState, cachedContent: any): void {
    state.course = cachedContent.course;
    state.modules = cachedContent.modules || [];
    
    if (state.modules.length > 0) {
      state.currentModule = state.modules[0];
      if (state.modules[0].lessons?.length > 0) {
        state.currentLesson = state.modules[0].lessons[0];
      }
    }
  }

  /**
   * Preload next module for better performance
   */
  private async preloadNextModule(courseId: string, currentModuleId: number): Promise<void> {
    try {
      const state = this.contentState.get(courseId);
      if (!state) return;

      const currentIndex = state.modules.findIndex(m => m.id === currentModuleId);
      const nextModule = state.modules[currentIndex + 1];

      if (nextModule) {
        logger.info('🔄 Preloading next module:', nextModule.title);
        // Preload any heavy content like videos or interactive elements
        // This is a placeholder for actual preloading logic
      }
    } catch (error) {
      logger.error('❌ Failed to preload next module:', error);
    }
  }

  /**
   * Store offline changes for later synchronization
   */
  private storeOfflineChange(courseId: string, type: string, data: any): void {
    if (!this.offlineChanges.has(courseId)) {
      this.offlineChanges.set(courseId, []);
    }
    
    const changes = this.offlineChanges.get(courseId)!;
    changes.push({
      type,
      data,
      timestamp: Date.now(),
      id: `${type}-${Date.now()}-${Math.random()}`,
    });

    // Persist to localStorage
    try {
      const allOfflineChanges = Array.from(this.offlineChanges.entries());
      localStorage.setItem('course-offline-changes', JSON.stringify(allOfflineChanges));
    } catch (error) {
      logger.error('❌ Failed to persist offline changes:', error);
    }
  }

  /**
   * Sync offline changes when network is restored
   */
  private async syncOfflineChanges(): Promise<void> {
    if (this.networkStatus === 'offline' || this.offlineChanges.size === 0) {
      return;
    }

    logger.info('🔄 Syncing offline changes:', this.offlineChanges.size, 'courses');

    for (const [courseId, changes] of this.offlineChanges.entries()) {
      const state = this.contentState.get(courseId);
      if (state) {
        state.syncStatus = 'syncing';
      }

      try {
        for (const change of changes) {
          await this.syncOfflineChange(courseId, change);
        }

        // Clear synced changes
        this.offlineChanges.delete(courseId);
        if (state) {
          state.syncStatus = 'idle';
        }

        logger.info('✅ Synced offline changes for course:', courseId);
      } catch (error) {
        logger.error('❌ Failed to sync offline changes for course:', courseId, error);
        if (state) {
          state.syncStatus = 'failed';
          state.lastError = error instanceof Error ? error : new Error('Sync failed');
        }
      }
    }

    // Update localStorage
    try {
      const allOfflineChanges = Array.from(this.offlineChanges.entries());
      localStorage.setItem('course-offline-changes', JSON.stringify(allOfflineChanges));
    } catch (error) {
      logger.error('❌ Failed to update offline changes storage:', error);
    }
  }

  /**
   * Sync a single offline change
   */
  private async syncOfflineChange(courseId: string, change: any): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    switch (change.type) {
      case 'progress':
        const progressData = change.data as ProgressTrackingData;
        const success = await saveCourseProgress(
          user.id,
          user.email || '',
          progressData.courseId,
          progressData.progress,
          progressData
        );
        
        if (!success) {
          throw new Error('Failed to sync progress data');
        }
        
        // Update enrollment progress
        try {
          await unifiedEnrollmentManager.updateEnrollmentProgress(
            courseId, 
            user.email || '', 
            progressData.progress
          );
        } catch (error) {
          logger.warn('⚠️ Failed to update enrollment progress during sync:', error);
        }
        break;

      default:
        logger.warn('⚠️ Unknown offline change type:', change.type);
    }
  }

  /**
   * Load offline changes from localStorage
   */
  private loadOfflineChanges(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('course-offline-changes');
        if (stored) {
          const parsed = JSON.parse(stored);
          this.offlineChanges = new Map(parsed);
          logger.info('📦 Loaded offline changes:', this.offlineChanges.size, 'courses');
        }
      } else {
        logger.info('📱 localStorage not available, skipping offline changes load');
      }
    } catch (error) {
      logger.error('❌ Failed to load offline changes:', error);
      // Initialize empty map on error
      this.offlineChanges = new Map();
    }
  }

  /**
   * Backup progress to localStorage
   */
  private backupProgressToStorage(progressKey: string, progressData: ProgressTrackingData): void {
    try {
      const backupKey = `progress-backup-${progressKey}`;
      localStorage.setItem(backupKey, JSON.stringify({
        ...progressData,
        backupTimestamp: Date.now(),
      }));
    } catch (error) {
      logger.error('❌ Failed to backup progress:', error);
    }
  }

  /**
   * Process sync queue for failed operations
   */
  private async processSyncQueue(): Promise<void> {
    if (this.syncQueue.size === 0 || this.networkStatus === 'offline') return;

    logger.info('🔄 Processing sync queue:', this.syncQueue.size, 'items');

    for (const progressKey of this.syncQueue) {
      try {
        const progressData = this.progressCache.get(progressKey);
        if (!progressData) {
          this.syncQueue.delete(progressKey);
          continue;
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) continue;

        const success = await saveCourseProgress(
          user.id,
          user.email || '',
          progressData.courseId,
          progressData.progress,
          progressData
        );

        if (success) {
          this.syncQueue.delete(progressKey);
          this.retryQueue.delete(progressKey);
          
          // Update course state
          const state = this.contentState.get(progressData.courseId);
          if (state) {
            state.syncStatus = 'idle';
            state.lastError = null;
            state.retryCount = 0;
          }
          
          logger.info('✅ Synced queued progress:', progressKey);
          this.emitEvent('progress-synced', { 
            courseId: progressData.courseId, 
            progressKey,
            success: true 
          });
        } else {
          // Increment retry count
          const retries = this.retryQueue.get(progressKey) || 0;
          if (retries >= 3) {
            // Give up after 3 retries
            this.syncQueue.delete(progressKey);
            this.retryQueue.delete(progressKey);
            
            const state = this.contentState.get(progressData.courseId);
            if (state) {
              state.syncStatus = 'failed';
              state.retryCount = retries;
            }
            
            logger.warn('⚠️ Gave up syncing progress after 3 retries:', progressKey);
            this.emitEvent('progress-sync-failed', { 
              courseId: progressData.courseId, 
              progressKey,
              retries 
            });
          } else {
            this.retryQueue.set(progressKey, retries + 1);
            
            const state = this.contentState.get(progressData.courseId);
            if (state) {
              state.retryCount = retries + 1;
            }
          }
        }
      } catch (error) {
        logger.error('❌ Error processing sync queue item:', progressKey, error);
        
        // Update state with error
        const progressData = this.progressCache.get(progressKey);
        if (progressData) {
          const state = this.contentState.get(progressData.courseId);
          if (state) {
            state.syncStatus = 'failed';
            state.lastError = error instanceof Error ? error : new Error('Sync error');
          }
        }
      }
    }
  }

  /**
   * Sync all course progress for a user
   */
  async syncAllProgress(userEmail: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      return await syncAllCourseProgress(user.id, userEmail);
    } catch (error) {
      logger.error('❌ Failed to sync all progress:', error);
      return false;
    }
  }

  /**
   * Get course content state
   */
  getCourseState(courseId: string): CourseContentState | null {
    return this.contentState.get(courseId) || null;
  }

  /**
   * Clear course content cache
   */
  clearCache(courseId?: string): void {
    if (courseId) {
      this.offlineStorage.delete(courseId);
      this.contentState.delete(courseId);
    } else {
      this.offlineStorage.clear();
      this.contentState.clear();
    }

    // Update localStorage
    const cacheArray = Array.from(this.offlineStorage.entries());
    localStorage.setItem('course-content-cache', JSON.stringify(cacheArray));
    
    logger.info('🧹 Cache cleared:', courseId || 'all');
  }

  /**
   * Event system for real-time updates
   */
  addEventListener(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  removeEventListener(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  private emitEvent(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(new CustomEvent(event, { detail: data }));
        } catch (error) {
          logger.error('❌ Error in event listener:', error);
        }
      });
    }
  }

  /**
   * Cleanup method to properly dispose of resources
   */
  cleanup(): void {
    try {
      // Unsubscribe from real-time subscriptions
      for (const [name, subscription] of this.realTimeSubscriptions.entries()) {
        try {
          if (subscription && typeof subscription.unsubscribe === 'function') {
            subscription.unsubscribe();
          }
        } catch (error) {
          logger.error(`❌ Error unsubscribing from ${name}:`, error);
        }
      }
      this.realTimeSubscriptions.clear();

      // Clear event listeners
      this.eventListeners.clear();

      // Clear caches
      this.contentState.clear();
      this.progressCache.clear();
      this.enrollmentStatusCache.clear();
      this.offlineChanges.clear();

      logger.info('✅ CourseContentManager cleanup complete');
    } catch (error) {
      logger.error('❌ Error during cleanup:', error);
    }
  }
}

// Export singleton instance
export const courseContentManager = new CourseContentManager();
export default CourseContentManager;