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
      id: 'free',
      name: 'Free',
      price: 0,
      billingPeriod: 'monthly',
      features: [
        '1 Personal Workspace',
        '10 AI-Generated Posts/Month',
        'Basic Analytics',
        'Standard Support'
      ],
      limitations: {
        workspaces: 1,
        posts: 10,
        carousels: 0
      }
    },
    {
      id: 'pro',
      name: 'Pro',
      price: isAnnualBilling ? 39 : 49,
      billingPeriod: isAnnualBilling ? 'annual' : 'monthly',
      features: [
        '3 Workspaces',
        'Unlimited AI-Generated Posts',
        '3 Carousel Requests/Month',
        'Advanced Analytics',
        'Priority Support',
        'Content Scraper'
      ],
      limitations: {
        workspaces: 3,
        posts: Infinity,
        carousels: 3
      },
      isPopular: true
    },
    {
      id: 'business',
      name: 'Business',
      price: isAnnualBilling ? 79 : 99,
      billingPeriod: isAnnualBilling ? 'annual' : 'monthly',
      features: [
        '10 Workspaces',
        'Unlimited AI-Generated Posts',
        '10 Carousel Requests/Month',
        'Team Collaboration',
        'API Access',
        'Advanced Analytics',
        'Priority Support',
        'Content Scraper',
        'White Label Options'
      ],
      limitations: {
        workspaces: 10,
        posts: Infinity,
        carousels: 10
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
                      {currentPlan?.price ? (
                        <div className="text-xl font-bold mt-1">
                          ${currentPlan.price}
                          <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
                            /{currentPlan.billingPeriod === 'annual' ? 'year' : 'month'}
                          </span>
                        </div>
                      ) : (
                        <div className="text-xl font-bold mt-1">Free</div>
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
                  
                  {!currentSubscription.isCancelled && currentPlan?.id !== 'free' && (
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
                  <h4 className="font-medium mb-2">Plan Features</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Workspaces
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {currentPlan?.limitations.workspaces === Infinity 
                          ? 'Unlimited' 
                          : currentPlan?.limitations.workspaces || 0}
                      </div>
                    </div>
                    
                    <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        AI Posts
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {currentPlan?.limitations.posts === Infinity 
                          ? 'Unlimited' 
                          : currentPlan?.limitations.posts || 0}
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
                          /month
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Carousel Requests
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {currentPlan?.limitations.carousels || 0}
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
                          /month
                        </span>
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map(plan => (
                <Card key={plan.id} className={`relative ${plan.isPopular ? 'border-primary' : ''}`}>
                  {plan.isPopular && (
                    <div className="absolute top-0 right-0 translate-x-2 -translate-y-2">
                      <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>
                      {plan.id === 'free' 
                        ? 'For personal use' 
                        : plan.id === 'pro'
                          ? 'For professionals and creators'
                          : 'For teams and businesses'}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold">
                      ${plan.price}
                      <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">
                        /{plan.billingPeriod === 'annual' ? 'year' : 'month'}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      className="w-full"
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
                          {plan.id === 'free' ? 'Downgrade' : 'Upgrade'}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
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
                                ? 'success' 
                                : invoice.status === 'pending'
                                  ? 'outline'
                                  : 'destructive'
                            }
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