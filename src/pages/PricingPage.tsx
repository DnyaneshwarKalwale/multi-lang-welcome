
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Check, HelpCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  
  const pricingPlans = [
    {
      name: "Free",
      description: "For individuals just getting started",
      price: {
        monthly: 0,
        annual: 0
      },
      features: [
        { name: "5 AI content generations per month", included: true },
        { name: "Basic analytics dashboard", included: true },
        { name: "1 social media account", included: true },
        { name: "Standard support", included: true },
        { name: "Scheduled publishing", included: false },
        { name: "Advanced AI voice training", included: false },
        { name: "Team collaboration", included: false },
      ],
      popular: false,
      color: "from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800",
      textColor: "text-gray-800 dark:text-gray-200",
      buttonVariant: "outline" as const
    },
    {
      name: "Pro",
      description: "For professional content creators",
      price: {
        monthly: 29,
        annual: 19
      },
      features: [
        { name: "50 AI content generations per month", included: true },
        { name: "Advanced analytics dashboard", included: true },
        { name: "5 social media accounts", included: true },
        { name: "Priority support", included: true },
        { name: "Scheduled publishing", included: true },
        { name: "Advanced AI voice training", included: true },
        { name: "Team collaboration", included: false },
      ],
      popular: true,
      color: "from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700",
      textColor: "text-white",
      buttonVariant: "secondary" as const
    },
    {
      name: "Business",
      description: "For teams and businesses",
      price: {
        monthly: 79,
        annual: 59
      },
      features: [
        { name: "Unlimited AI content generations", included: true },
        { name: "Custom analytics dashboard", included: true },
        { name: "Unlimited social media accounts", included: true },
        { name: "Dedicated support manager", included: true },
        { name: "Advanced scheduling & planning", included: true },
        { name: "Custom AI voice training", included: true },
        { name: "Team collaboration with roles", included: true },
      ],
      popular: false,
      color: "from-fuchsia-500 to-rose-500 dark:from-fuchsia-600 dark:to-rose-600",
      textColor: "text-white",
      buttonVariant: "default" as const
    }
  ];
  
  const handlePurchase = (planName: string) => {
    toast.info(`${planName} plan selected. Redirecting to checkout...`);
  };
  
  const questions = [
    {
      question: "Can I change plans later?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. If you upgrade, the change will take effect immediately. If you downgrade, the change will take effect at the end of your current billing cycle."
    },
    {
      question: "How do AI content generations work?",
      answer: "Each generation creates a unique piece of content based on your inputs and preferences. Generations refresh at the start of each billing cycle. Unused generations don't roll over to the next cycle."
    },
    {
      question: "Do you offer refunds?",
      answer: "Yes, we offer a 14-day money-back guarantee on all paid plans. If you're not satisfied with our service, contact support within 14 days of your purchase for a full refund."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and in some regions, bank transfers. All payments are processed securely through our payment processor."
    }
  ];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <Layout>
      <div className="bg-gradient-to-b from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-950 min-h-screen">
        <section className="pt-24 pb-16">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 dark:from-indigo-400 dark:via-purple-400 dark:to-fuchsia-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                Simple, Transparent Pricing
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 dark:text-gray-300 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Choose the perfect plan for your content creation needs
              </motion.p>
              
              <motion.div 
                className="flex justify-center mb-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
                  <div className="flex">
                    <button
                      onClick={() => setBillingCycle('monthly')}
                      className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                        billingCycle === 'monthly'
                          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      Monthly
                    </button>
                    
                    <button
                      onClick={() => setBillingCycle('annual')}
                      className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center ${
                        billingCycle === 'annual'
                          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      Annual
                      <span className="ml-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs py-0.5 px-2 rounded-full">
                        Save 30%
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {pricingPlans.map((plan) => (
                <motion.div
                  key={plan.name}
                  variants={itemVariants}
                  className={`relative rounded-2xl overflow-hidden ${
                    plan.popular 
                      ? 'shadow-xl shadow-indigo-500/10 dark:shadow-indigo-700/20 ring-2 ring-indigo-500 dark:ring-indigo-400 transform md:-translate-y-4' 
                      : 'shadow-lg'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 w-full text-center py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  
                  <div className={`bg-gradient-to-br ${plan.color} ${plan.textColor} p-8 ${plan.popular ? 'pt-12' : ''}`}>
                    <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                    <p className="opacity-90 mb-6">{plan.description}</p>
                    
                    <div className="flex items-baseline mb-6">
                      <span className="text-4xl font-bold">${plan.price[billingCycle]}</span>
                      <span className="ml-2 opacity-80">
                        {plan.price[billingCycle] > 0 ? `/month` : ''}
                      </span>
                    </div>
                    
                    {plan.price[billingCycle] > 0 && billingCycle === 'annual' && (
                      <p className="text-sm opacity-90 mb-6">Billed annually (${plan.price[billingCycle] * 12}/year)</p>
                    )}
                    
                    <Button 
                      variant={plan.buttonVariant} 
                      className="w-full"
                      onClick={() => handlePurchase(plan.name)}
                    >
                      {plan.price.monthly === 0 ? 'Start Free' : 'Choose Plan'}
                    </Button>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-8">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Features include:</h4>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature.name} className="flex items-start">
                          <span className="mr-2 mt-1">
                            {feature.included ? (
                              <Check className="h-5 w-5 text-green-500" />
                            ) : (
                              <X className="h-5 w-5 text-gray-300 dark:text-gray-600" />
                            )}
                          </span>
                          <span className={feature.included ? "text-gray-700 dark:text-gray-300" : "text-gray-400 dark:text-gray-500"}>
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <motion.h2 
              className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Frequently Asked Questions
            </motion.h2>
            
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              {questions.map((item, index) => (
                <motion.div 
                  key={index}
                  className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start mb-2">
                    <HelpCircle className="h-5 w-5 text-indigo-500 mr-2 mt-1 flex-shrink-0" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.question}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 ml-7">{item.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-20 bg-indigo-50 dark:bg-indigo-950/30">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              className="max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Need a custom solution?</h2>
              <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
                Contact our team for enterprise plans tailored to your organization's needs
              </p>
              
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                onClick={() => toast.info("Contact form will open soon!")}
              >
                Contact Sales
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
