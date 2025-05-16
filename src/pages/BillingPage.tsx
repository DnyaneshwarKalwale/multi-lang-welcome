import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const BillingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('plans');
  const [isChangingPlan, setIsChangingPlan] = useState(false);
  const [isAnnualBilling, setIsAnnualBilling] = useState(true);
  
  // Current subscription info (mock)
  const [currentSubscription, setCurrentSubscription] = useState({
    planId: 'pro',
    status: 'active',
    renewDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    isCancelled: false
  });
  
  // Payment methods (mock)
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
  
  // Invoices (mock)
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 'inv-001',
      amount: 49,
      date: new Date('2023-10-15'),
      status: 'paid',
      downloadUrl: '/invoices/inv-001.pdf'
    },
    {
      id: 'inv-002',
      amount: 49,
      date: new Date('2023-09-15'),
      status: 'paid',
      downloadUrl: '/invoices/inv-002.pdf'
    },
    {
      id: 'inv-003',
      amount: 49,
      date: new Date('2023-08-15'),
      status: 'paid',
      downloadUrl: '/invoices/inv-003.pdf'
    }
  ]);

  // Subscription plans (mock)
  const plans: SubscriptionPlan[] = [
    {
      id: 'trial',
      name: 'Trial',
      price: 20,
      billingPeriod: 'monthly',
      features: [
        '3 Total Credits for AI-Generated Content',
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
      billingPeriod: isAnnualBilling ? 'annual' : 'monthly',
      features: [
        '10 Total Credits for AI-Generated Content',
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
      billingPeriod: isAnnualBilling ? 'annual' : 'monthly',
      features: [
        '25 Total Credits for AI-Generated Content',
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
      billingPeriod: isAnnualBilling ? 'annual' : 'monthly',
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

  // Find current plan details
  const currentPlan = plans.find(plan => plan.id === currentSubscription.planId);

  // Change subscription plan
  const handleChangePlan = (planId: string) => {
    setIsChangingPlan(true);
    
    // Simulate API call
    setTimeout(() => {
      setCurrentSubscription(prev => ({
        ...prev,
        planId: planId
      }));
      setIsChangingPlan(false);
      toast.success('Subscription plan updated successfully!');
    }, 1500);
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
    // In a real app, trigger actual download
    toast.success('Invoice download started');
  };

  // Cancel subscription
  const handleCancelSubscription = () => {
    // In a real app, make API call to cancel subscription
    setCurrentSubscription(prev => ({
      ...prev,
      isCancelled: true
    }));
    toast.success('Your subscription has been cancelled. You will have access until the end of your billing period.');
  };

  // Define the credit packs
  const creditPacks: CreditPack[] = [
    {
      id: 'pack-5',
      credits: 5,
      price: 45
    },
    {
      id: 'pack-10',
      credits: 10,
      price: 85,
      isPopular: true
    },
    {
      id: 'pack-20',
      credits: 20,
      price: 160
    }
  ];

  // Add new function to handle credit pack purchase
  const handleBuyCreditPack = (packId: string) => {
    setIsChangingPlan(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, this would add credits to the user's account
      const pack = creditPacks.find(p => p.id === packId);
      if (pack) {
        toast.success(`Successfully purchased ${pack.credits} additional credits!`);
      }
      setIsChangingPlan(false);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Billing & Subscription</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your subscription plans and payment methods
        </p>
      </div>
      
      <Tabs defaultValue="plans" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="plans" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span>Subscription Plans</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Payment Methods</span>
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Invoices</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Subscription Plans Tab */}
        <TabsContent value="plans">
          {/* Current Subscription */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Current Subscription</CardTitle>
              <CardDescription>
                Your active subscription plan and usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{currentPlan?.name || 'No Plan'}</h3>
                      {currentPlan?.id === 'custom' ? (
                        <div className="text-xl font-bold mt-1 text-black dark:text-white">
                          Custom Plan
                        </div>
                      ) : currentPlan?.id === 'trial' ? (
                        <div className="text-xl font-bold mt-1 text-black dark:text-white">
                          ${currentPlan.price}
                          <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
                            /7 days
                          </span>
                        </div>
                      ) : currentPlan?.price ? (
                        <div className="text-xl font-bold mt-1 text-black dark:text-white">
                          ${currentPlan.price}
                          <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
                            /{currentPlan.billingPeriod === 'annual' ? 'year' : 'month'}
                          </span>
                        </div>
                      ) : (
                        <div className="text-xl font-bold mt-1 text-black dark:text-white">Free</div>
                      )}
                    </div>
                    
                    <Badge 
                      variant={currentSubscription.isCancelled ? 'destructive' : 'default'}
                      className="rounded-md"
                    >
                      {currentSubscription.isCancelled 
                        ? 'Cancelled' 
                        : 'Active'}
                    </Badge>
                  </div>
                  
                  {currentSubscription.isCancelled ? (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Your subscription will end on {format(currentSubscription.renewDate, 'MMMM d, yyyy')}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Renews on {format(currentSubscription.renewDate, 'MMMM d, yyyy')}
                    </div>
                  )}
                  
                  {!currentSubscription.isCancelled && currentPlan?.id !== 'trial' && (
                    <Button 
                      variant="outline" 
                      className="text-destructive hover:text-destructive"
                      onClick={handleCancelSubscription}
                    >
                      Cancel Subscription
                    </Button>
                  )}
                </div>
                
                <div className="space-y-4 md:col-span-2">
                  <h4 className="font-medium mb-2">Your Credit Usage</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                      <div className="text-sm font-medium text-primary/80 mb-1">
                        Monthly Credits
                      </div>
                      <div className="text-2xl font-bold text-black dark:text-white">
                        {currentPlan?.limitations.carousels === Infinity 
                          ? 'Unlimited' 
                          : currentPlan?.limitations.carousels || 0}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Resets on {format(currentSubscription.renewDate, 'MMMM d, yyyy')}
                      </div>
                    </div>
                    
                    <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                      <div className="text-sm font-medium text-primary/80 mb-1">
                        Additional Credits
                      </div>
                      <div className="text-2xl font-bold text-black dark:text-white">
                        0
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
                          available
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Never expire
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Available Plans */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <h2 className="text-lg font-semibold mb-2 sm:mb-0">Available Plans</h2>
              
              <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-md">
                <Button
                  variant={isAnnualBilling ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setIsAnnualBilling(true)}
                >
                  Annual (Save 20%)
                </Button>
                <Button
                  variant={!isAnnualBilling ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setIsAnnualBilling(false)}
                >
                  Monthly
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map(plan => (
                <Card 
                  key={plan.id} 
                  className={`relative border-2 hover:shadow-lg transition-all duration-300 ${
                    plan.isPopular 
                      ? 'border-primary shadow-md shadow-primary/10' 
                      : 'border-gray-200 dark:border-gray-800 hover:border-primary/30'
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute top-0 right-0 translate-x-2 -translate-y-2">
                      <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <CardHeader className="pb-2 text-center border-b border-gray-100 dark:border-gray-800">
                    <CardTitle className="text-2xl font-bold text-black dark:text-white">{plan.name}</CardTitle>
                    <CardDescription className="text-primary/80">
                      {plan.id === 'trial' 
                        ? 'Get started with carousels' 
                        : plan.id === 'basic'
                          ? 'For professionals and creators'
                          : plan.id === 'premium'
                            ? 'For teams and agencies'
                            : 'For enterprise needs'}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-6 space-y-6">
                    {plan.id === 'custom' ? (
                      <div className="text-3xl font-bold text-center text-black dark:text-white">
                        Custom
                        <span className="text-sm font-normal text-primary/80 ml-1">
                          (Contact us)
                        </span>
                      </div>
                    ) : (
                      <div className="text-3xl font-bold text-center text-black dark:text-white mb-4">
                      ${plan.price}
                        <span className="text-sm font-normal text-primary/80 ml-1">
                          {plan.id === 'trial' ? '/7 days' : `/${plan.billingPeriod === 'annual' ? 'year' : 'month'}`}
                      </span>
                    </div>
                    )}
                    
                    {plan.id === 'trial' && (
                      <div className="flex justify-center">
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          One-time only
                        </Badge>
                      </div>
                    )}
                    
                    <div className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-2 pb-6">
                    {plan.id === 'custom' ? (
                      <Button 
                        className="w-full bg-white hover:bg-primary/5 text-primary border-primary"
                        variant="outline"
                        onClick={() => window.open('mailto:sales@yourcompany.com', '_blank')}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact Sales
                      </Button>
                    ) : (
                    <Button 
                        className={`w-full ${
                          plan.id === currentSubscription.planId 
                            ? 'bg-white hover:bg-primary/5 text-primary border-primary' 
                            : 'bg-primary hover:bg-primary/90 text-white'
                        }`}
                      variant={plan.id === currentSubscription.planId ? 'outline' : 'default'}
                      disabled={plan.id === currentSubscription.planId || isChangingPlan}
                      onClick={() => handleChangePlan(plan.id)}
                    >
                      {isChangingPlan ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Processing...
                        </>
                      ) : plan.id === currentSubscription.planId ? (
                        <>
                          <BadgeCheck className="h-4 w-4 mr-2" />
                          Current Plan
                        </>
                      ) : (
                        <>
                            {plan.id === 'trial' ? 'Start Trial' : 'Subscribe'}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Additional Credit Packs Section */}
          <div className="mt-12 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold mb-1">Need More Credits?</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Purchase additional credits to use at any time
                </p>
              </div>
              
              <Badge variant="outline" className="bg-primary/5 border-primary/10 text-primary mt-2 sm:mt-0">
                Credits never expire
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {creditPacks.map(pack => (
                <Card 
                  key={pack.id} 
                  className={`relative border-2 hover:shadow-lg transition-all duration-300 ${
                    pack.isPopular 
                      ? 'border-primary shadow-md shadow-primary/10' 
                      : 'border-gray-200 dark:border-gray-800 hover:border-primary/30'
                  }`}
                >
                  {pack.isPopular && (
                    <div className="absolute top-0 right-0 translate-x-2 -translate-y-2">
                      <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                        Best Value
                      </span>
                    </div>
                  )}
                  
                  <CardHeader className="pb-2 text-center">
                    <CardTitle className="text-xl font-bold text-black dark:text-white">
                      {pack.credits} Additional Credits
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="pt-4 text-center">
                    <div className="text-3xl font-bold text-black dark:text-white mb-4">
                      ${pack.price}
                    </div>
                    
                    <p className="text-primary/80 text-sm mb-4">
                      Use for any combination of AI posts or carousels
                    </p>
                    
                    <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Instant delivery</span>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-2 pb-6">
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90 text-white"
                      onClick={() => handleBuyCreditPack(pack.id)}
                      disabled={isChangingPlan}
                    >
                      {isChangingPlan ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Buy Now
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <div className="mt-6 bg-primary/5 border border-primary/10 rounded-lg p-4">
              <div className="flex items-start">
                <PlusCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-black dark:text-white">How Credits Work</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    Each credit can be used for either an AI-generated post or carousel. You can mix and match however you prefer.
                    Credits purchased separately from your subscription never expire and are used after your monthly allocation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Payment Methods Tab */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Manage your payment methods for your subscription
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {paymentMethods.map(method => (
                <div 
                  key={method.id} 
                  className={`p-4 border rounded-lg flex items-center justify-between ${
                    method.isDefault 
                      ? 'border-primary bg-primary-50 dark:bg-primary-900/10' 
                      : 'border-gray-200 dark:border-gray-800'
                  }`}
                >
                  <div className="flex items-center">
                    {method.type === 'card' ? (
                      <>
                        <div className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-800 rounded-md mr-4">
                          <CreditCard className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {method.brand} •••• {method.lastFour}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Expires {method.expiryDate}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-800 rounded-md mr-4">
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                            <path d="M7.5 19.5C11.0899 19.5 14 16.5899 14 13C14 9.41015 11.0899 6.5 7.5 6.5C3.91015 6.5 1 9.41015 1 13C1 16.5899 3.91015 19.5 7.5 19.5Z" fill="#00457C" />
                            <path d="M14 7.5H21.5C22.3284 7.5 23 8.17157 23 9V17C23 17.8284 22.3284 18.5 21.5 18.5H14C14 14.9101 16.9101 12 20.5 12C16.9101 12 14 9.08985 14 5.5V7.5Z" fill="#0079C1" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium">
                            PayPal
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {method.email}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center">
                    {method.isDefault ? (
                      <Badge variant="outline" className="mr-2">Default</Badge>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSetDefaultPayment(method.id)}
                      >
                        Set as Default
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              <Button className="gap-2 w-full">
                <PlusCircle className="h-4 w-4" />
                Add Payment Method
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Invoices Tab */}
        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>
                View and download your past invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-left border-b border-gray-200 dark:border-gray-800">
                      <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Invoice</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Amount</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                      <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Download</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map(invoice => (
                      <tr 
                        key={invoice.id} 
                        className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <td className="px-4 py-3 text-sm">
                          {format(invoice.date, 'MMM d, yyyy')}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {invoice.id}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          ${invoice.amount.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Badge 
                            variant={
                              invoice.status === 'paid' 
                                ? 'default' 
                                : invoice.status === 'pending'
                                  ? 'outline'
                                  : 'destructive'
                            }
                            className={invoice.status === 'paid' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}
                          >
                            {invoice.status === 'paid' 
                              ? 'Paid' 
                              : invoice.status === 'pending'
                                ? 'Pending'
                                : 'Failed'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="gap-1"
                            onClick={() => handleDownloadInvoice(invoice)}
                          >
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* FAQ Section */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-4">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="space-y-2">
          <AccordionItem value="item-1" className="border rounded-lg">
            <AccordionTrigger className="px-4">
              How do I change my subscription plan?
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              You can upgrade or downgrade your subscription plan at any time from the "Subscription Plans" tab. Changes to a higher-tier plan will take effect immediately, while downgrades will take effect at the end of your current billing cycle.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2" className="border rounded-lg">
            <AccordionTrigger className="px-4">
              Can I cancel my subscription?
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              Yes, you can cancel your subscription at any time. Your subscription will remain active until the end of your current billing period. After that, your account will revert to the Free plan, with limited features.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3" className="border rounded-lg">
            <AccordionTrigger className="px-4">
              Will I be charged immediately when upgrading?
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              When upgrading, we'll prorate your existing subscription and charge only for the difference. You'll have immediate access to the features of your new plan.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4" className="border rounded-lg">
            <AccordionTrigger className="px-4">
              How do I add a new payment method?
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              You can add a new payment method in the "Payment Methods" tab. We accept major credit cards and PayPal. Your payment information is securely stored and processed through our payment provider.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default BillingPage; 