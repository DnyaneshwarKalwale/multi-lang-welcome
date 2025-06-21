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
  billingPeriod: 'monthly' | 'annual' | 'trial';
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
  const [isChangingPlan, setIsChangingPlan] = useState<string | null>(null); // Change to track which plan is being changed
  const [isExpandedView, setIsExpandedView] = useState(false);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // Track if user is admin
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  
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
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  
  // Invoices
  const [invoices, setInvoices] = useState<Invoice[]>([]);

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
        `${import.meta.env.VITE_API_URL || 'https://api.brandout.ai/api'}/user-limits/me`, 
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

  // Subscription plans (trial removed since it's automatically given to new users)
  const plans: SubscriptionPlan[] = [
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

  // Fetch payment methods
  const fetchPaymentMethods = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'https://api.brandout.ai/api'}/payments/methods`, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        // Transform the data to match the frontend interface
        const transformedMethods = response.data.data.map((method: any) => ({
          id: method._id,
          type: method.type,
          lastFour: method.card?.last4 || method.bankAccount?.last4,
          expiryDate: method.card ? `${method.card.expMonth.toString().padStart(2, '0')}/${method.card.expYear.toString().slice(-2)}` : undefined,
          brand: method.card?.brand,
          email: method.paypal?.email,
          isDefault: method.isDefault
        }));
        setPaymentMethods(transformedMethods);
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      // Don't show error toast for empty payment methods
      if (error.response?.status !== 404) {
        toast.error('Failed to load payment methods', { duration: 2000 });
      }
    }
  };

  // Fetch invoices/billing history
  const fetchInvoices = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'https://api.brandout.ai/api'}/payments/history`, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        // Transform the data to match the frontend interface
        const transformedInvoices = response.data.data.transactions.map((transaction: any) => ({
          id: transaction.transactionId,
          amount: transaction.amount,
          date: new Date(transaction.createdAt),
          status: transaction.paymentStatus,
          downloadUrl: `/api/payments/invoices/${transaction.transactionId}/download`
        }));
        setInvoices(transformedInvoices);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      // Don't show error toast for empty invoices
      if (error.response?.status !== 404) {
        toast.error('Failed to load billing history', { duration: 2000 });
      }
    }
  };

  // Fetch current subscription from API
  useEffect(() => {
    fetchCurrentSubscription();
    fetchPaymentMethods();
    fetchInvoices();
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
        `${import.meta.env.VITE_API_URL || 'https://api.brandout.ai'}/user-limits/${user?.id}/update-plan`,
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

  // Update handleChangePlan function to handle loading state per button
  const handleChangePlan = async (planId: string) => {
    try {
      setIsChangingPlan(planId); // Set the specific plan being changed
      
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
        setIsChangingPlan(null);
        return;
      }
      

      
      // Fix the API URL format - ensure consistency
      const baseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai';
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
        mode: 'subscription',
        recurring: isAnnualBilling ? 'year' : 'month',
        remainingCredits: remainingCredits > 0 ? remainingCredits : 0,
        currentPlanId: currentSubscription.planId,
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
      
      setIsChangingPlan(null);
    }
  };

  // Set default payment method
  const handleSetDefaultPayment = async (paymentId: string) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL || 'https://api.brandout.ai/api'}/payments/methods/${paymentId}/default`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        // Update local state
        setPaymentMethods(methods => 
          methods.map(method => ({
            ...method,
            isDefault: method.id === paymentId
          }))
        );
        toast.success('Default payment method updated!', { duration: 2000 });
      }
    } catch (error) {
      console.error('Error setting default payment method:', error);
      toast.error('Failed to update default payment method', { duration: 2000 });
    }
  };

  // Download invoice
  const handleDownloadInvoice = async (invoice: Invoice) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'https://api.brandout.ai/api'}/payments/invoices/${invoice.id}/download`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        // If it's invoice details, show them
        if (response.data.data) {
          toast.success('Invoice details retrieved', { duration: 2000 });
          console.log('Invoice details:', response.data.data);
        } else {
          toast.success('Invoice download started', { duration: 2000 });
        }
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice', { duration: 2000 });
    }
  };

  // Buy credit pack
  const handleBuyCreditPack = async (packId: string) => {
    if (!user || !user.id) {
      toast.error('You must be logged in to purchase credits');
      return;
    }
    
    setIsChangingPlan(packId);
    
    try {
      // Get the credit pack details for better error messages
      const creditPack = creditPacks.find(pack => pack.id === packId);
      
      // Extract the ID number from packId (e.g., 'pack-5' -> '5')
      const creditsAmount = creditPack?.credits || parseInt(packId.split('-')[1]) || 0;
      
      // Fix the API URL format
      const baseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai';
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
      
      setIsChangingPlan(null);
    }
  };

  // Add function to verify session and update plan
  const verifySessionAndUpdatePlan = async (sessionId: string) => {
    try {
      // Fix the API URL format
      const baseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai';
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
        // Refresh subscription data and payment information
        await fetchCurrentSubscription();
        await fetchPaymentMethods();
        await fetchInvoices();
        
        // Different success messages based on what was purchased
        if (data.productType === 'credit-pack' || data.type === 'credit-pack') {
          toast.success(`Your payment was successful! ${data.credits || ''} credits have been added to your account.`, { duration: 2000 });
        } else {
          // If it was a plan upgrade with credit transfer
          if (data.transferredCredits && data.transferredCredits > 0) {
            toast.success(
              `Your plan has been successfully upgraded! ${data.transferredCredits} credits from your previous plan have been transferred.`,
              { duration: 2000 }
            );
          } else {
            toast.success('Your plan has been successfully upgraded!', { duration: 2000 });
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
      const baseUrl = import.meta.env.VITE_API_URL || 'https://api.brandout.ai';
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
      toast.success('Payment card added successfully', { duration: 2000 });
      
      // Clear form
      setCardInfo({
        cardNumber: '',
        expiryDate: '',
        cvc: '',
        cardholderName: '',
        isDefault: true
      });
      
      // Refresh payment methods
      await fetchPaymentMethods();
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
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="space-y-6">
          {/* Plans Section */}
          <div id="plans" className="bg-white rounded-2xl border border-primary/10 shadow-sm overflow-hidden">
            <div className="border-b border-primary/10 px-5 py-4 flex justify-between items-center flex-wrap gap-2">
              <div>
                <h2 className="text-xl font-semibold text-black">Choose Your Plan</h2>
                <p className="text-black/70 text-sm mt-1">Select the perfect plan for your content creation needs</p>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsExpandedView(!isExpandedView)}
                className="text-primary hover:text-primary/70 hover:bg-primary/5"
              >
                {isExpandedView ? 'Simple View' : 'Detailed View'}
              </Button>
            </div>
            
            <div className="p-5">
              {/* Plan upgrade/downgrade policy information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 mb-6">
                <div className="flex">
                  <svg className="h-5 w-5 text-blue-500 mr-2 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium mb-1">Plan Information:</p>
                    <p>• New users automatically get a 7-day free trial with 3 credits</p>
                    <p>• Upgrade anytime to get immediate access to additional features and credits</p>
                    <p>• Downgrades take effect at the end of your current billing period</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {plans.map(plan => (
                  <div
                    key={plan.id}
                    className={`
                      relative border rounded-xl transition-all overflow-hidden h-full
                      ${plan.id === currentSubscription.planId 
                        ? 'border-primary ring-2 ring-primary/20' 
                        : plan.isPopular 
                          ? 'border-primary shadow-lg' 
                          : 'border-primary/10 hover:border-primary/30 hover:shadow-md'
                      }
                    `}
                  >
                    {plan.isPopular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-primary text-white shadow-sm">Most Popular</Badge>
                      </div>
                    )}
                    
                    {plan.id === currentSubscription.planId && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-green-500 text-white shadow-sm">Current Plan</Badge>
                      </div>
                    )}
                    
                    <div className="p-5 h-full flex flex-col">
                      {/* Plan Header */}
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-bold text-black">{plan.name}</h3>
                        <div className="mt-2">
                          {plan.id === 'custom' ? (
                            <span className="text-2xl font-bold text-black">Custom</span>
                          ) : plan.id === 'trial' ? (
                            <span className="text-3xl font-bold text-green-600">FREE</span>
                          ) : (
                            <>
                              <span className="text-3xl font-bold text-black">${plan.price}</span>
                              <span className="text-black/70">
                                /{plan.billingPeriod === 'annual' ? 'year' : 'month'}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* Credits Badge */}
                      <div className="text-center mb-4">
                        <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full">
                          <Sparkles className="h-4 w-4" />
                          <span className="font-medium">
                            {plan.limitations.carousels === Infinity 
                              ? 'Unlimited Credits' 
                              : `${plan.limitations.carousels} Credits`}
                          </span>
                        </div>
                      </div>
                      
                      {/* Features */}
                      <div className="flex-1 space-y-2 mb-6">
                        {(isExpandedView ? plan.features : plan.features.slice(0, 3)).map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-black">{feature}</span>
                          </div>
                        ))}
                        {!isExpandedView && plan.features.length > 3 && (
                          <div className="text-xs text-black/70 text-center">
                            +{plan.features.length - 3} more features
                          </div>
                        )}
                      </div>
                      
                      {/* Action Button */}
                      <div className="mt-auto">
                        {plan.id === currentSubscription.planId ? (
                          <Button 
                            variant="outline" 
                            className="w-full bg-primary/5 border-primary/20 text-primary"
                            disabled
                          >
                            <BadgeCheck className="h-4 w-4 mr-2" />
                            Current Plan
                          </Button>
                        ) : (
                          <Button 
                            variant={plan.id === 'custom' ? 'outline' : 'default'}
                            className={`w-full ${plan.id === 'custom' 
                              ? 'border-primary/20 text-primary hover:bg-primary/5' 
                              : plan.isPopular 
                                ? 'bg-primary hover:bg-primary/90' 
                                : ''
                            }`}
                            disabled={isChangingPlan !== null}
                            onClick={() => plan.id === 'custom' 
                              ? window.open('mailto:sales@yourcompany.com', '_blank') 
                              : handleChangePlan(plan.id)
                            }
                          >
                            {isChangingPlan === plan.id ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : plan.id === 'custom' ? (
                              <>
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Contact Sales
                              </>
                            ) : plan.id === 'trial' ? (
                              <>
                                <Sparkles className="h-4 w-4 mr-2" />
                                Start Free Trial
                              </>
                            ) : (
                              <>
                                <ArrowRight className="h-4 w-4 mr-2" />
                                Upgrade Now
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Credit Packs Section */}
          {currentPlan && (
            <div className="bg-white rounded-2xl border border-primary/10 shadow-sm overflow-hidden">
              <div className="border-b border-primary/10 px-5 py-4">
                <h2 className="text-lg font-semibold text-black">Need More Credits?</h2>
                <p className="text-black/70 text-sm mt-1">Purchase additional credits for your current plan</p>
              </div>
              
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {creditPacks.map((pack) => (
                    <div key={pack.id} className={`
                      group relative border rounded-xl p-4 transition-all text-center
                      ${pack.isPopular ? 
                        'border-primary bg-primary/5 shadow-md' : 
                        'border-primary/10 hover:border-primary/30 hover:bg-primary/5'}
                    `}>
                      {pack.isPopular && (
                        <div className="absolute -top-2 -right-2">
                          <Badge className="bg-primary text-white shadow-sm">Best Value</Badge>
                        </div>
                      )}
                      
                      <div className="mb-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                          <PlusCircle className="w-6 h-6 text-primary" />
                        </div>
                        
                        <div className="text-2xl font-bold text-black">{pack.credits}</div>
                        <div className="text-sm text-black/70 mb-2">Credits</div>
                        <div className="text-xl font-semibold text-primary">${pack.price}</div>
                      </div>
                      
                      <Button
                        variant={pack.isPopular ? "default" : "outline"}
                        className="w-full"
                        onClick={() => handleBuyCreditPack(pack.id)}
                        disabled={isChangingPlan !== null}
                      >
                        {isChangingPlan === pack.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <CreditCard className="h-4 w-4 mr-2" />
                        )}
                        Buy Now
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                  <div className="flex">
                    <svg className="h-5 w-5 text-amber-500 mr-2 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-medium mb-1">Important:</p>
                      <p>• Credits expire at the end of your billing cycle</p>
                      <p>• Each credit can be used for one AI post or carousel</p>
                      <p>• Credits purchased on trial plans expire when trial ends</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Current Plan & Usage Overview */}
          {currentPlan && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Plan Card */}
              <div className="bg-white rounded-2xl border border-primary/10 shadow-sm overflow-hidden">
                <div className="border-b border-primary/10 px-5 py-4">
                  <h2 className="text-lg font-semibold text-black">Current Plan</h2>
                </div>
                
                <div className="p-5 space-y-4">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-black">{currentPlan.name}</h3>
                    <div className="mt-1 text-2xl font-bold text-primary">
                      {currentPlan.id === 'trial' ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        <>
                          ${currentPlan.price}
                          <span className="text-sm font-normal text-black/70">
                            /{currentPlan.billingPeriod === 'annual' ? 'year' : 'month'}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-primary/5 rounded-lg p-3 text-center">
                    <div className="text-sm text-black/70">Credits</div>
                    <div className="text-xl font-semibold text-black">
                      {currentSubscription.usedCredits} / {currentSubscription.totalCredits}
                    </div>
                    <div className="w-full bg-primary/20 rounded-full h-2 mt-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${usagePercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-center text-sm text-black/70">
                    {currentSubscription.status === 'cancelled' ? (
                      <div className="flex items-center justify-center text-black/70">
                        <Clock className="h-4 w-4 mr-1.5" />
                        Access until {format(currentSubscription.expiresAt || new Date(), 'MMM d')}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center text-black/70">
                        <RefreshCw className="h-4 w-4 mr-1.5" />
                        Renews {format(currentSubscription.expiresAt || new Date(), 'MMM d')}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Methods Card */}
              <div className="bg-white rounded-2xl border border-primary/10 shadow-sm overflow-hidden">
                <div className="border-b border-primary/10 px-5 py-4">
                  <h2 className="text-lg font-semibold text-black">Payment Methods</h2>
                </div>
                
                <div className="p-5">
                  {paymentMethods.length > 0 ? (
                    <div className="space-y-3 mb-4">
                      {paymentMethods.slice(0, 2).map((method) => (
                        <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {method.type === 'card' ? (
                              <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center">
                                <CreditCard className="h-4 w-4" />
                              </div>
                            ) : (
                              <div className="h-8 w-12 bg-blue-100 rounded flex items-center justify-center">
                                <span className="text-xs font-bold text-blue-700">PP</span>
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium">
                                {method.type === 'card'
                                  ? `****${method.lastFour}`
                                  : `PayPal`}
                              </p>
                              {method.type === 'card' && method.expiryDate && (
                                <p className="text-xs text-gray-500">Expires {method.expiryDate}</p>
                              )}
                            </div>
                          </div>
                          {method.isDefault && (
                            <Badge variant="outline" className="bg-primary/5 text-primary text-xs">Default</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <CreditCard className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">No payment methods</p>
                    </div>
                  )}
                  
                  <Button
                    variant="outline"
                    onClick={() => setShowAddCardModal(true)}
                    className="w-full"
                    size="sm"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Add Payment Method
                  </Button>
                </div>
              </div>
            </div>
          )}
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
