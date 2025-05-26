import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  CreditCard, Check, ArrowRight, Clock, PlusCircle,
  FileText, Download, Shield, Users, LayoutGrid, 
  MessageSquare, Sparkles, RefreshCw, Loader2, BadgeCheck
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { toast } from 'sonner';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Input,
} from '@/components/ui/input';
import {
  Label,
} from '@/components/ui/label';
import {
  Checkbox,
} from '@/components/ui/checkbox';
import {
  Switch,
} from '@/components/ui/switch';

// Subscription plan interface
interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billingPeriod: 'monthly' | 'annual';
  features: string[];
  limitations: {
    workspaces: number;
    posts: number;
    carousels: number;
  };
  isPopular?: boolean;
}

// Payment method interface
interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal';
  lastFour?: string;
  expiryDate?: string;
  brand?: string;
  email?: string;
  isDefault: boolean;
}

// Invoice interface
interface Invoice {
  id: string;
  amount: number;
  date: Date;
  status: 'paid' | 'pending' | 'failed';
  downloadUrl: string;
}

// Add a new interface for credit packs
interface CreditPack {
  id: string;
  credits: number;
  price: number;
  isPopular?: boolean;
}

// Add a new interface for credit pack checkout
interface CreditPackCheckoutRequest {
  planId: string;
  billingPeriod: string;
  productType: string;
  mode: string;
  credits: number;
  price?: number;
  successUrl: string;
  cancelUrl: string;
}

// Define a type for plan data
interface PlanUpdateData {
  planId: string;
  limit: number;
  expiresAt: string;
  planName: string;
}

interface Subscription {
  planId: string;
  planName: string;
  status: string;
  expiresAt: Date | null;
  usedCredits: number;
  totalCredits: number;
}

// Add an interface for plan upgrade request
interface PlanUpgradeRequest {
  planId: string;
  billingPeriod: string;
  productType: string;
  mode: string;
  recurring: string;
  remainingCredits: number;
  currentPlanId: string;
  successUrl: string;
  cancelUrl: string;
}

// Add a new interface for card information
interface CardInformation {
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  cardholderName: string;
  isDefault: boolean;
}

const BillingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();
  const [isAnnualBilling, setIsAnnualBilling] = useState(false); // Default to monthly
  const [isChangingPlan, setIsChangingPlan] = useState(false);
  const [isExpandedView, setIsExpandedView] = useState(false);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // Track if user is admin
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [autoPayEnabled, setAutoPayEnabled] = useState(false);
  
  // Current subscription info
  const [currentSubscription, setCurrentSubscription] = useState<Subscription>({
    planId: 'expired',
    planName: 'No Plan',
    status: 'expired',
    expiresAt: null,
    usedCredits: 0,
    totalCredits: 0
  });
  
  // Payment methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'pm-1',
      type: 'card',
      lastFour: '4242',
      expiryDate: '04/25',
      brand: 'Visa',
      isDefault: true
    },
    {
      id: 'pm-2',
      type: 'paypal',
      email: 'user@example.com',
      isDefault: false
    }
  ]);
  
  // Invoices
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 'inv-001',
      amount: 100,
      date: new Date('2023-10-15'),
      status: 'paid',
      downloadUrl: '/invoices/inv-001.pdf'
    },
    {
      id: 'inv-002',
      amount: 100,
      date: new Date('2023-09-15'),
      status: 'paid',
      downloadUrl: '/invoices/inv-002.pdf'
    },
    {
      id: 'inv-003',
      amount: 100,
      date: new Date('2023-08-15'),
      status: 'paid',
      downloadUrl: '/invoices/inv-003.pdf'
    }
  ]);

  // New state for card information
  const [cardInfo, setCardInfo] = useState<CardInformation>({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardholderName: '',
    isDefault: true
  });

  // Check if coming back from successful checkout
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const success = query.get('success');
    const canceled = query.get('canceled');
    const sessionId = query.get('session_id');
    
    if (success === 'true' && sessionId) {
      console.log("Returned from Stripe with session ID:", sessionId);
      // First verify the session with our server to update the user's subscription/credits
      verifySessionAndUpdatePlan(sessionId)
        .then(() => {
          console.log("Session verified successfully");
          // This displays a success toast and refreshes data inside verifySessionAndUpdatePlan
        })
        .catch(error => {
          console.error("Error verifying session:", error);
          toast.error("Error verifying your payment. Please contact support if you were charged.");
        });
      
      // Remove query params from URL
      navigate('/settings/billing', { replace: true });
    } else if (canceled === 'true') {
      toast.info('Payment was canceled. You can try again when ready.');
      navigate('/settings/billing', { replace: true });
    }
  }, [location, navigate]);
  
  // Fetch current subscription from API
  const fetchCurrentSubscription = async () => {
    try {
      setIsLoadingSubscription(true);
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/user-limits/me`, 
        {
        headers: {
          Authorization: `Bearer ${token}`
        }
        }
      );
      
      if (response.data.success) {
        const userData = response.data.data;
        console.log('User subscription data:', userData);
        
        // Direct use the data from API response
        // This ensures we display what's actually in the database
        setCurrentSubscription({
          planId: userData.planId || 'expired',
          planName: userData.planName || 'No Plan',
          status: userData.status || 'inactive',
          expiresAt: userData.expiresAt ? new Date(userData.expiresAt) : null,
          usedCredits: userData.count || 0,
          totalCredits: userData.limit || 0
        });
        
        // Set the auto-pay status
        setAutoPayEnabled(userData.autoPay || false);
      } else {
        console.error('Failed to fetch subscription:', response.data?.message);
      setCurrentSubscription({
          planId: 'expired',
          planName: 'No Plan',
          status: 'inactive',
          expiresAt: null,
          usedCredits: 0,
          totalCredits: 0
        });
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setCurrentSubscription({
        planId: 'expired',
        planName: 'No Plan',
        status: 'inactive',
        expiresAt: null,
        usedCredits: 0,
        totalCredits: 0
      });
    } finally {
      setIsLoadingSubscription(false);
    }
  };

  // Subscription plans
  const plans: SubscriptionPlan[] = [
    {
      id: 'trial',
      name: 'Trial',
      price: 20,
      billingPeriod: 'monthly',
      features: [
        '3 Monthly Credits for AI-Generated Content',
        'Valid for 7 days',
        'Content Scraper',
        'Standard Support'
      ],
      limitations: {
        workspaces: 1,
        posts: 3,
        carousels: 3
      }
    },
    {
      id: 'basic',
      name: 'Basic',
      price: 100,
      billingPeriod: 'monthly',
      features: [
        '10 Monthly Credits for AI-Generated Content',
        'Content Scraper',
        'Priority Support',
        'Full Access to Templates'
      ],
      limitations: {
        workspaces: 1,
        posts: 10,
        carousels: 10
      },
      isPopular: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 200,
      billingPeriod: 'monthly',
      features: [
        '25 Monthly Credits for AI-Generated Content',
        'Content Scraper',
        'Priority Support',
        'Full Access to Templates',
        'White Label Options'
      ],
      limitations: {
        workspaces: 1,
        posts: 25,
        carousels: 25
      }
    },
    {
      id: 'custom',
      name: 'Custom',
      price: 200,
      billingPeriod: 'monthly',
      features: [
        'Custom Number of AI Credits',
        'Content Scraper',
        'Priority Support',
        'Full Access to Templates',
        'White Label Options',
        'Dedicated Account Manager'
      ],
      limitations: {
        workspaces: 1,
        posts: Infinity,
        carousels: Infinity
      }
    }
  ];

  // Credit packs for additional purchases
  const creditPacks: CreditPack[] = [
    { id: 'pack-5', credits: 5, price: 50 },
    { id: 'pack-10', credits: 10, price: 85, isPopular: true },
    { id: 'pack-20', credits: 20, price: 160 }
  ];

  // Fetch current subscription from API
  useEffect(() => {
    fetchCurrentSubscription();
  }, []);

  // Find current plan
  const currentPlan = plans.find(plan => plan.id === currentSubscription.planId);

  // Calculate percentage of used credits
  const usagePercentage = currentSubscription.totalCredits > 0 
    ? (currentSubscription.usedCredits / currentSubscription.totalCredits * 100)
    : 0;

  // Mock data for usage chart
  const usageData = [
    { day: '1', credits: 0 },
    { day: '5', credits: 2 },
    { day: '10', credits: 3 },
    { day: '15', credits: 5 },
    { day: '20', credits: 7 },
    { day: '25', credits: 7 },
    { day: '30', credits: 7 }
  ];

  // Add updateUserPlan function with proper type
  const updateUserPlan = async (planData: PlanUpdateData) => {
    try {
      console.log('Updating user plan with:', planData);
      
      // Update backend user limit
      await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/user-limits/${user?.id}/update-plan`,
        planData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
      // Fetch updated subscription data
      fetchCurrentSubscription();
      
      toast.success('Your plan has been updated successfully');
    } catch (error) {
      console.error('Error updating user plan:', error);
      toast.error('Failed to update your plan. Please try again.');
    }
  };

  // Helper function to check if a subscription is active
  const isSubscriptionActive = (planId: string) => {
    return planId !== 'expired' && planId !== undefined && planId !== null;
  }

  // Update handleChangePlan function to correctly handle API calls
  const handleChangePlan = async (planId: string) => {
    try {
      setIsChangingPlan(true);
      
      // Define plan rankings to determine if it's an upgrade or downgrade
      const planRanking = {
        'expired': 0,
        'trial': 1,
        'basic': 2,
        'premium': 3,
        'custom': 4
      };
      
      // Check if it's a downgrade (moving to a lower-ranked plan)
      const currentPlanRank = planRanking[currentSubscription.planId] || 0;
      const newPlanRank = planRanking[planId] || 0;
      
      // If it's a downgrade and current subscription hasn't expired, show error
      const isDowngrade = newPlanRank < currentPlanRank;
      const hasActiveSubscription = currentSubscription.expiresAt && new Date(currentSubscription.expiresAt) > new Date();
      
      if (isDowngrade && hasActiveSubscription) {
        toast.error("Plan downgrade is not allowed during an active subscription period. You can downgrade once your current subscription expires.");
        setIsChangingPlan(false);
        return;
      }
      
      // For direct upgrade without payment (like trial plans)
      if (planId === 'trial') {
        // Create a start date and expiry date
        const startDate = new Date();
        let expiryDate = new Date(startDate);
        expiryDate.setDate(expiryDate.getDate() + 7); // 7 days trial
        
        const planData = {
          planId: 'trial',
          limit: 3,
          expiresAt: expiryDate.toISOString(),
          planName: 'Trial'
        };
        
        await updateUserPlan(planData);
        await fetchCurrentSubscription();
        
        toast.success(`Successfully changed to ${planData.planName} plan`);
        setIsChangingPlan(false);
        return;
      }
      
      // Fix the API URL format - ensure consistency
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const apiUrl = baseUrl.endsWith('/api') 
        ? `${baseUrl}/stripe/create-checkout-session`
        : `${baseUrl}/api/stripe/create-checkout-session`;
      
      // Get the target plan details
      const targetPlan = plans.find(p => p.id === planId);
      if (!targetPlan) {
        throw new Error('Invalid plan selected');
      }
      
      // Calculate remaining credits from current plan (if any)
      const remainingCredits = currentSubscription.totalCredits - currentSubscription.usedCredits;
      
      // Create request data for plan upgrade
      const requestData: PlanUpgradeRequest = {
        planId, 
        billingPeriod: isAnnualBilling ? 'annual' : 'monthly',
        productType: 'subscription',
        mode: 'subscription', // Add explicit mode for Stripe
        recurring: isAnnualBilling ? 'year' : 'month', // Use non-empty value for recurring
        remainingCredits: remainingCredits > 0 ? remainingCredits : 0, // Add remaining credits to transfer
        currentPlanId: currentSubscription.planId, // Add current plan ID for reference
        successUrl: window.location.origin + window.location.pathname + '?success=true&session_id={CHECKOUT_SESSION_ID}',
        cancelUrl: window.location.origin + window.location.pathname + '?canceled=true'
      };
      
      console.log("Sending plan upgrade request to:", apiUrl);
      console.log("With data:", requestData);
      
      // For paid plans, redirect to checkout
        const response = await axios.post(
        apiUrl,
        requestData,
          {
            headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
            }
          }
        );
        
      console.log("Plan upgrade response:", response.data);
      
      if (response.data && response.data.url) {
        // Redirect to checkout page
        window.location.href = response.data.url;
      } else if (response.data && response.data.sessionUrl) {
        // Alternative URL format some backends might use
        window.location.href = response.data.sessionUrl;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Error changing plan:', error);
      
      // More detailed error handling
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        toast.error(`Error: ${error.response.data?.message || 'Server error'}`);
      } else {
        toast.error("Failed to change plan. Please try again.");
      }
      
      setIsChangingPlan(false);
    }
  };

  // Set default payment method
  const handleSetDefaultPayment = (paymentId: string) => {
    setPaymentMethods(methods => 
      methods.map(method => ({
        ...method,
        isDefault: method.id === paymentId
      }))
    );
    toast.success('Default payment method updated!');
  };

  // Download invoice
  const handleDownloadInvoice = (invoice: Invoice) => {
    toast.success('Invoice download started');
  };

  // Cancel subscription
  const handleCancelSubscription = async () => {
    if (!token) return;
    
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/stripe/cancel-subscription`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
    setCurrentSubscription(prev => ({
      ...prev,
      status: 'cancelled'
    }));
      
    toast.success('Your subscription has been cancelled. You will have access until the end of your billing period.');
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('Failed to cancel subscription');
    }
  };

  // Buy credit pack
  const handleBuyCreditPack = async (packId: string) => {
    if (!user || !user.id) {
      toast.error('You must be logged in to purchase credits');
      return;
    }
    
    setIsChangingPlan(true);
    
    try {
      // Get the credit pack details for better error messages
      const creditPack = creditPacks.find(pack => pack.id === packId);
      
      // Extract the ID number from packId (e.g., 'pack-5' -> '5')
      const creditsAmount = creditPack?.credits || parseInt(packId.split('-')[1]) || 0;
      
      // Fix the API URL format
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      // Make sure we're including /api in the URL if not already included
      const apiUrl = baseUrl.endsWith('/api') 
        ? `${baseUrl}/stripe/create-checkout-session`
        : `${baseUrl}/api/stripe/create-checkout-session`;
      
      // Create a simplified request with only the necessary fields
      // Keep it minimal to avoid issues with the backend
      const requestData = {
        planId: packId,
        productType: 'credit-pack',
        mode: 'payment',
        credits: creditsAmount,
        price: creditPack?.price,
        successUrl: window.location.origin + window.location.pathname + '?success=true&session_id={CHECKOUT_SESSION_ID}',
        cancelUrl: window.location.origin + window.location.pathname + '?canceled=true'
      };
      
      console.log("Sending credit pack request to:", apiUrl);
      console.log("With data:", JSON.stringify(requestData, null, 2));
      
      const response = await axios.post(
        apiUrl,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("Response from server:", response.data);
      
      if (response.data && response.data.url) {
      // Redirect to checkout page
      window.location.href = response.data.url;
      } else if (response.data && response.data.sessionUrl) {
        // Alternative URL format some backends might use
        window.location.href = response.data.sessionUrl;
      } else {
        throw new Error('No checkout URL returned from server');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      
      // More detailed error message
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        toast.error(`Error: ${error.response.data?.message || 'Server error'}`);
      } else if (error.request) {
        toast.error('No response received from server. Please check your internet connection.');
      } else {
        toast.error('Failed to create checkout session. Please try again later.');
      }
      
      setIsChangingPlan(false);
    }
  };

  // Add function to verify session and update plan
  const verifySessionAndUpdatePlan = async (sessionId: string) => {
    try {
      // Fix the API URL format
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      // Make sure we're including /api in the URL if not already included
      const apiUrl = baseUrl.endsWith('/api') 
        ? `${baseUrl}/stripe/verify-session`
        : `${baseUrl}/api/stripe/verify-session`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ sessionId })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Refresh subscription data
        await fetchCurrentSubscription();
        
        // Different success messages based on what was purchased
        if (data.productType === 'credit-pack' || data.type === 'credit-pack') {
          toast.success(`Your payment was successful! ${data.credits || ''} credits have been added to your account.`);
        } else {
          // If it was a plan upgrade with credit transfer
          if (data.transferredCredits && data.transferredCredits > 0) {
            toast.success(
              `Your plan has been successfully upgraded! ${data.transferredCredits} credits from your previous plan have been transferred.`
            );
          } else {
            toast.success('Your plan has been successfully upgraded!');
          }
        }
      } else {
        throw new Error(data.message || 'Failed to verify session');
      }
    } catch (error) {
      console.error('Error verifying session:', error);
      toast.error('Failed to verify payment. Please contact support if your payment was successful.');
    }
  };

  // Add effect to check for session_id in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    
    if (sessionId) {
      verifySessionAndUpdatePlan(sessionId);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Check if user is admin
  useEffect(() => {
    if (user?.role === 'admin') {
      setIsAdmin(true);
    }
  }, [user]);

  // Function to handle card information changes
  const handleCardInfoChange = (field: keyof CardInformation, value: string | boolean) => {
    setCardInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Function to save card information
  const saveCardInformation = async () => {
    try {
      if (!token) {
        toast.error('Authentication required. Please log in again.');
        return;
      }

      // Validate card information
      if (!cardInfo.cardNumber || !cardInfo.expiryDate || !cardInfo.cvc || !cardInfo.cardholderName) {
        toast.error('Please fill in all card details');
        return;
      }

      // Format card number (last 4 digits only for security)
      const lastFour = cardInfo.cardNumber.slice(-4);
      
      // Make API call to save card information
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const apiUrl = baseUrl.endsWith('/api') 
        ? `${baseUrl}/payment-methods`
        : `${baseUrl}/api/payment-methods`;
      
      await axios.post(
        apiUrl,
        {
          type: 'card',
          lastFour,
          expiryDate: cardInfo.expiryDate,
          cardholderName: cardInfo.cardholderName,
          isDefault: cardInfo.isDefault
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Close modal and show success message
      setShowAddCardModal(false);
      toast.success('Payment card added successfully');
      
      // Clear form
      setCardInfo({
        cardNumber: '',
        expiryDate: '',
        cvc: '',
        cardholderName: '',
        isDefault: true
      });
      
      // Refresh payment methods
      await fetchCurrentSubscription();
    } catch (error) {
      console.error('Error saving card information:', error);
      toast.error('Failed to save card information. Please try again.');
    }
  };

  // Function to view all billing information (admin only)
  const viewAllBillingInformation = () => {
    if (isAdmin) {
      navigate('/admin/billing');
    }
  };

  // Add this function to handle toggling auto-pay
  const handleAutoPayToggle = async (enabled: boolean) => {
    try {
      setAutoPayEnabled(enabled);
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/users/subscription/auto-pay`, 
        { 
          autoPay: enabled 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        toast.success(`Auto-renewal ${enabled ? 'enabled' : 'disabled'} successfully`);
      } else {
        toast.error('Failed to update auto-renewal setting');
        setAutoPayEnabled(!enabled); // Revert state on failure
      }
    } catch (error) {
      console.error('Error toggling auto-pay:', error);
      toast.error('Failed to update auto-renewal setting');
      setAutoPayEnabled(!enabled); // Revert state on failure
    }
  };

  return (
    <div className="w-full pb-12">
      {/* Innovative Top Dashboard Bar */}
      <div className="relative w-full bg-primary/5 border-b border-primary/10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary/10">
          <div 
            className="h-full bg-primary" 
            style={{ width: `${usagePercentage}%` }}
          ></div>
      </div>
        
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              
                    <div>
                <h1 className="text-2xl font-bold text-black">Billing Dashboard</h1>
                <p className="text-black/70">Manage your subscription, credits and payments</p>
              </div>
                        </div>
            
            {/* Admin Controls */}
            {isAdmin && (
              <Button 
                variant="outline" 
                className="ml-auto"
                onClick={viewAllBillingInformation}
              >
                Admin View
              </Button>
            )}
            
            {currentPlan ? (
              <div className="w-full sm:w-auto py-2 px-4 rounded-lg bg-white border border-primary/10 shadow-sm flex flex-col sm:flex-row items-center gap-4">
                <div className="flex flex-col items-center sm:items-start">
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-black/70">Your Plan:</span>
                    <span className="font-semibold text-black">{currentPlan.name}</span>
                    </div>
                    
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline"
                      className="bg-primary/5 border-primary/10 text-black/70"
                    >
                      {currentSubscription.status === 'cancelled' ? 'Cancelled' : 'Active'}
                    </Badge>
                    
                    <span className="text-xs text-black/50">•</span>
                    
                    <span className="text-xs text-black/70">
                      Renews {format(currentSubscription.expiresAt || new Date(), 'MMM d')}
                    </span>
                  </div>
                </div>
                
                {/* Add auto-renewal toggle */}
                {currentSubscription.status !== 'cancelled' && (
                  <div className="mt-3 border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <span className="font-medium text-black">Auto-renewal</span>
                        <p className="text-xs text-black/70">
                          {autoPayEnabled 
                            ? 'Your subscription will automatically renew' 
                            : 'Your subscription will expire at the end of period'}
                        </p>
                  </div>
                      <Switch
                        checked={autoPayEnabled}
                        onCheckedChange={handleAutoPayToggle}
                        disabled={isLoadingSubscription}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full sm:w-auto py-2 px-4 rounded-lg bg-white border border-primary/10 shadow-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                    No Active Plan
                  </Badge>
                  <span className="text-sm">Choose a plan to get started</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Main Content - Unique Diamond Layout */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Usage & Credit Purchase */}
          <div className="lg:col-span-1 space-y-6">
            {/* Usage Stats Card */}
            <div className="bg-white rounded-2xl border border-primary/10 shadow-sm overflow-hidden">
              <div className="border-b border-primary/10 px-5 py-4 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-black">Credits Usage</h2>
                <Badge 
                  variant="outline" 
                  className="border-primary/10 text-primary bg-primary/5"
                >
                  This Billing Cycle
                </Badge>
              </div>
              
              <div className="p-5 space-y-4">
                {/* Visual Circle Progress */}
                <div className="flex justify-center">
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      {/* Background circle */}
                      <circle 
                        cx="50" cy="50" r="45" 
                        fill="none" 
                        stroke="#e2e8f0" 
                        strokeWidth="10"
                      />
                      
                      {/* Progress circle */}
                      <circle 
                        cx="50" cy="50" r="45" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="10"
                        strokeDasharray="282.7"
                        strokeDashoffset={282.7 * (1 - usagePercentage / 100)}
                        strokeLinecap="round"
                        className="text-primary transition-all duration-700 ease-out"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-black">{currentSubscription.usedCredits}</span>
                      <span className="text-xs text-black/70">Used Credits</span>
                    </div>
                  </div>
                </div>
                
                {/* Usage Breakdown */}
                <div className="grid grid-cols-2 gap-4 text-center pt-3">
                  <div className="bg-primary/5 rounded-lg p-3">
                    <div className="text-sm text-black/70">Total</div>
                    <div className="text-xl font-semibold text-black">{currentSubscription.totalCredits}</div>
                  </div>
                  
                  <div className="bg-primary/5 rounded-lg p-3">
                    <div className="text-sm text-black/70">Remaining</div>
                    <div className="text-xl font-semibold text-black">
                      {currentSubscription.totalCredits - currentSubscription.usedCredits}
                    </div>
                    </div>
                </div>
                
                {/* Usage Over Time Chart */}
                <div className="pt-6 pb-2">
                  <div className="text-sm font-medium text-black mb-3">Usage Over Time</div>
                  <div className="h-24 flex items-end">
                    {usageData.map((item, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-4/5 bg-primary/20 hover:bg-primary/40 rounded-t transition-all"
                          style={{ height: `${(item.credits / currentSubscription.totalCredits) * 100}%` }}
                        ></div>
                        <div className="text-[10px] text-black/60 mt-1">{item.day}</div>
                      </div>
                    ))}
                  </div>
                </div>
                      </div>
                    </div>
                    
            {/* Buy More Credits Section */}
            <div className="bg-white rounded-2xl border border-primary/10 shadow-sm overflow-hidden">
              <div className="border-b border-primary/10 px-5 py-4">
                <h2 className="text-lg font-semibold text-black">Need More Credits?</h2>
              </div>
              
              <div className="p-5 space-y-4">
                <div className="space-y-3">
                  {creditPacks.map((pack) => (
                    <div key={pack.id} className={`
                      group relative border rounded-xl p-4 transition-all
                      ${pack.isPopular ? 
                        'border-primary bg-primary/5' : 
                        'border-primary/10 hover:border-primary/30 hover:bg-primary/5'}
                    `}>
                      {pack.isPopular && (
                        <div className="absolute -top-2 -right-2 rotate-12">
                          <Badge className="bg-primary text-white shadow-sm">Best Value</Badge>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <PlusCircle className="w-5 h-5 text-primary" />
                      </div>
                          
                          <div>
                            <div className="font-medium text-black">{pack.credits} Credits</div>
                            <div className="text-black/70">${pack.price}</div>
                      </div>
                    </div>
                    
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBuyCreditPack(pack.id)}
                          disabled={isChangingPlan}
                          className="border-primary/20 text-primary hover:bg-primary/10"
                        >
                          {isChangingPlan ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <span>Buy</span>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                  </div>
                
                <div className="bg-primary/5 text-xs text-black/70 p-3 rounded-lg">
                  <p>Credits expire at the end of your billing cycle or when your plan expires. Each credit can be used for one AI post or carousel.</p>
                  <p className="mt-1"><span className="font-medium">Note:</span> Additional credits purchased on the trial plan will also expire when your trial ends.</p>
                </div>
                
                {/* Add Card Button */}
                <div className="flex justify-center mt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddCardModal(true)}
                    className="w-full"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Add Payment Method
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Plans & Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Plan & Upgrade Card */}
            <div className="bg-white rounded-2xl border border-primary/10 shadow-sm overflow-hidden">
              <div className="border-b border-primary/10 px-5 py-4 flex justify-between items-center flex-wrap gap-2">
                <h2 className="text-lg font-semibold text-black">Your Subscription</h2>
              
                {/* Subscription Plan Selector */}
                <div className="flex items-center justify-center space-x-4 mb-8">
                  <span className={!isAnnualBilling ? "font-semibold" : "text-gray-500"}>Monthly</span>
                    <button
                    type="button"
                    role="switch"
                    aria-checked={isAnnualBilling}
                    className={`${
                      isAnnualBilling ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    onClick={() => setIsAnnualBilling(!isAnnualBilling)}
                  >
                    <span
                      className={`${
                        isAnnualBilling ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                    </button>
                  <span className={isAnnualBilling ? "font-semibold" : "text-gray-500"}>
                    Annual <span className="text-green-600 text-xs font-medium">(Save 20%)</span>
                  </span>
                  </div>
                  
                {/* Plan upgrade/downgrade policy information */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-300 mb-6">
                  <div className="flex">
                    <svg className="h-5 w-5 text-blue-500 mr-2 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p><strong>Plan Change Policy:</strong> You can upgrade your plan at any time to get immediate access to additional features and credits.</p>
                      <p className="mt-1">However, downgrades are only possible at the end of your current billing period. If you request a downgrade, it will automatically take effect once your current subscription expires.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-5 py-6">
              {/* Current Plan Status */}
              {currentPlan ? (
                <div className="mb-8">
                  <div className={`
                    border-2 rounded-lg p-5 relative
                    ${currentSubscription.status === 'cancelled' ? 'border-black/20' : 'border-primary'}
                  `}>
                    {currentSubscription.status !== 'cancelled' && (
                      <div className="absolute -top-3 left-3 px-2 bg-white">
                        <Badge className="bg-primary text-white">Current Plan</Badge>
                    </div>
                  )}
                  
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-black">{currentPlan.name}</h3>
                        
                        <div className="mt-1 text-xl font-bold text-black">
                          ${currentPlan.price}
                          <span className="text-sm font-normal text-black/70">
                            /{currentPlan.billingPeriod === 'annual' ? 'year' : 'month'}
                      </span>
                    </div>
                    
                        <div className="mt-3 text-black/70">
                          {currentSubscription.status === 'cancelled' ? (
                            <div className="flex items-center text-black/70">
                              <Clock className="h-4 w-4 mr-1.5" />
                              Access until {format(currentSubscription.expiresAt || new Date(), 'MMMM d, yyyy')}
                            </div>
                          ) : (
                            <div className="flex items-center text-black/70">
                              <RefreshCw className="h-4 w-4 mr-1.5" />
                              Renews on {format(currentSubscription.expiresAt || new Date(), 'MMMM d, yyyy')}
                            </div>
                          )}
                        </div>
                        
                        {/* Add auto-renewal toggle */}
                        {currentSubscription.status !== 'cancelled' && (
                          <div className="mt-3 border-t border-gray-200 pt-3">
                            <div className="flex justify-between items-center">
                              <div className="text-sm">
                                <span className="font-medium text-black">Auto-renewal</span>
                                <p className="text-xs text-black/70">
                                  {autoPayEnabled 
                                    ? 'Your subscription will automatically renew' 
                                    : 'Your subscription will expire at the end of period'}
                                </p>
                              </div>
                              <Switch
                                checked={autoPayEnabled}
                                onCheckedChange={handleAutoPayToggle}
                                disabled={isLoadingSubscription}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="sm:text-right">
                        {currentSubscription.status !== 'cancelled' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-black/80 border-black/20 hover:bg-black/5"
                            onClick={handleCancelSubscription}
                          >
                            Cancel Plan
                          </Button>
                        )}
                        
                        <div className="mt-3 bg-primary/5 px-3 py-2 inline-block rounded-lg text-center">
                          <div className="text-sm font-medium text-black">
                            {currentPlan.limitations.carousels} Credits
                          </div>
                          <div className="text-xs text-black/70">per {currentPlan.billingPeriod === 'annual' ? 'year' : 'month'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-8">
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-5 text-center">
                    <h3 className="text-xl font-bold text-black mb-2">No Active Plan</h3>
                    <p className="text-black/70 mb-4">Purchase a plan to start using our services</p>
                    <Button onClick={() => window.location.href = '#plans'}>
                      View Available Plans
                    </Button>
                  </div>
                </div>
              )}
                  
              {/* All Plans Comparison */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-black">Available Plans</h3>
                    <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsExpandedView(!isExpandedView)}
                    className="text-primary"
                  >
                    {isExpandedView ? 'Simple View' : 'Detailed View'}
                    </Button>
          </div>
                
                <div className="space-y-4">
                  {plans.map(plan => (
                    <div
                      key={plan.id}
                      className={`
                        relative border rounded-xl transition-all overflow-hidden
                        ${plan.id === currentSubscription.planId ? 'border-primary' : 'border-primary/10 hover:border-primary/30'}
                      `}
                    >
                      <div className="p-4 gap-4 grid grid-cols-12">
                        {/* Plan Name & Price - takes 3 columns on larger screens, full width on mobile */}
                        <div className="col-span-12 sm:col-span-3 flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-start mb-2 sm:mb-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <h4 className="text-lg font-semibold text-black">{plan.name}</h4>
                            {plan.isPopular && (
                              <Badge className="bg-primary text-white">Popular</Badge>
                            )}
                          </div>
                          
                          <div className="text-right sm:text-left mt-0 sm:mt-2">
                            {plan.id === 'custom' ? (
                              <span className="font-semibold text-black">Custom</span>
                            ) : (
                              <>
                                <span className="font-semibold text-black">${plan.price}</span>
                                <span className="text-sm text-black/70">
                                  /{plan.billingPeriod === 'annual' ? 'yr' : 'mo'}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        {/* Features - takes 6 columns on larger screens, full width on mobile */}
                        <div className={`col-span-12 sm:col-span-6 ${isExpandedView ? 'block' : 'hidden sm:block'}`}>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-1.5">
                              <Sparkles className="h-4 w-4 text-primary flex-shrink-0" />
                              <span className="text-sm text-black">
                                {plan.limitations.carousels === Infinity 
                                  ? 'Unlimited Credits' 
                                  : `${plan.limitations.carousels} Credits`}
                              </span>
                        </div>
                            
                            {plan.features.slice(0, 3).map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-1.5">
                                <Check className="h-4 w-4 text-primary flex-shrink-0" />
                                <span className="text-sm text-black truncate">
                                  {feature}
                                </span>
                          </div>
                            ))}
                          </div>
                  </div>
                  
                        {/* Action Button - takes 3 columns on larger screens, full width on mobile */}
                        <div className="col-span-12 sm:col-span-3 flex justify-end items-center">
                          {plan.id === currentSubscription.planId ? (
                            <Badge 
                              variant="outline" 
                              className="bg-primary/5 border-primary/10 text-primary"
                            >
                              Current Plan
                            </Badge>
                    ) : (
                      <Button 
                              variant={plan.id === 'custom' ? 'outline' : 'default'}
                        size="sm"
                              disabled={isChangingPlan}
                              onClick={() => plan.id === 'custom' 
                                ? window.open('mailto:sales@yourcompany.com', '_blank') 
                                : handleChangePlan(plan.id)
                              }
                              className={plan.id === 'custom' 
                                ? 'border-primary/20 text-primary hover:bg-primary/5' 
                                : ''
                              }
                            >
                              {isChangingPlan ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : plan.id === 'custom' ? (
                                <span>Contact Us</span>
                              ) : plan.id === 'trial' ? (
                                <span>Start Trial</span>
                              ) : (
                                <span>Upgrade</span>
                              )}
                      </Button>
                    )}
                  </div>
                      </div>
                      
                      {/* Expanded Features View */}
                      {isExpandedView && (
                        <div className="border-t border-primary/10 bg-primary/5 p-4">
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {plan.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-1.5">
                                <Check className="h-4 w-4 text-primary flex-shrink-0" />
                                <span className="text-sm text-black">
                                  {feature}
                                </span>
                </div>
              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Card Modal */}
      <Dialog open={showAddCardModal} onOpenChange={setShowAddCardModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Payment Card</DialogTitle>
            <DialogDescription>
              Add a new payment method to your account
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                value={cardInfo.cardholderName}
                onChange={(e) => handleCardInfoChange('cardholderName', e.target.value)}
                placeholder="John Doe"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                value={cardInfo.cardNumber}
                onChange={(e) => handleCardInfoChange('cardNumber', e.target.value.replace(/\D/g, ''))}
                placeholder="1234 5678 9012 3456"
                maxLength={16}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  value={cardInfo.expiryDate}
                  onChange={(e) => handleCardInfoChange('expiryDate', e.target.value)}
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input
                  id="cvc"
                  value={cardInfo.cvc}
                  onChange={(e) => handleCardInfoChange('cvc', e.target.value.replace(/\D/g, ''))}
                  placeholder="123"
                  maxLength={3}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="defaultCard"
                checked={cardInfo.isDefault}
                onCheckedChange={(checked) => handleCardInfoChange('isDefault', Boolean(checked))}
              />
              <Label htmlFor="defaultCard">Set as default payment method</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddCardModal(false)}>
              Cancel
            </Button>
            <Button onClick={saveCardInformation}>
              Add Card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BillingPage; 
