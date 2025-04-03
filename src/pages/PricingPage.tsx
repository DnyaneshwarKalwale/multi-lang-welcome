
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, HelpCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const PricingPage = () => {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(true);

  // Define pricing tiers
  const pricingTiers = [
    {
      name: "Free",
      description: "Get started with basic content creation",
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        { label: "Generate up to 20 posts per month", included: true },
        { label: "Basic analytics", included: true },
        { label: "Single user account", included: true },
        { label: "Content templates", included: true },
        { label: "Single platform publishing", included: true },
        { label: "AI content optimization", included: false },
        { label: "Team collaboration", included: false },
        { label: "Multi-platform publishing", included: false },
        { label: "Custom branding", included: false },
        { label: "Priority support", included: false },
      ],
      buttonLabel: "Start for Free",
      popular: false
    },
    {
      name: "Pro",
      description: "Perfect for content creators and small businesses",
      monthlyPrice: 29,
      annualPrice: 24,
      features: [
        { label: "Generate up to 100 posts per month", included: true },
        { label: "Advanced analytics", included: true },
        { label: "Up to 3 user accounts", included: true },
        { label: "Premium content templates", included: true },
        { label: "Multi-platform publishing", included: true },
        { label: "AI content optimization", included: true },
        { label: "Basic team collaboration", included: true },
        { label: "Content calendar", included: true },
        { label: "Custom branding", included: false },
        { label: "Priority support", included: false },
      ],
      buttonLabel: "Get Pro",
      popular: true
    },
    {
      name: "Business",
      description: "For teams and businesses with advanced needs",
      monthlyPrice: 79,
      annualPrice: 69,
      features: [
        { label: "Unlimited post generation", included: true },
        { label: "Comprehensive analytics", included: true },
        { label: "Up to 10 user accounts", included: true },
        { label: "All content templates", included: true },
        { label: "Multi-platform publishing", included: true },
        { label: "Advanced AI optimization", included: true },
        { label: "Full team collaboration suite", included: true },
        { label: "Content calendar & planning", included: true },
        { label: "Custom branding", included: true },
        { label: "Priority support", included: true },
      ],
      buttonLabel: "Get Business",
      popular: false
    }
  ];

  // FAQs
  const faqs = [
    {
      question: "Can I switch plans later?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll have immediate access to the new features. When downgrading, the change will take effect at the end of your current billing period."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express), as well as PayPal. For Business plan customers, we also offer invoicing options."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! You can try any paid plan free for 14 days. No credit card required for the trial period. You'll be notified before the trial ends so you can decide if you want to continue."
    },
    {
      question: "What's the refund policy?",
      answer: "If you're not satisfied with our service, you can request a refund within the first 30 days of your paid subscription. Please contact our support team to process your refund."
    },
    {
      question: "Can I use Scripe on multiple platforms?",
      answer: "Yes, our Pro and Business plans support publishing to multiple social media platforms including Twitter, Facebook, Instagram, LinkedIn, and more."
    },
    {
      question: "Do you offer discounts for non-profits?",
      answer: "Yes, we offer special pricing for non-profit organizations. Please contact our sales team for more information."
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 pt-24 pb-16">
      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-10 pb-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-indigo-600 dark:from-teal-400 dark:to-indigo-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Simple, Transparent Pricing
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 dark:text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Choose the plan that fits your needs. All plans include a 14-day free trial.
          </motion.p>
          
          {/* Billing toggle */}
          <motion.div 
            className="flex items-center justify-center gap-3 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
              Monthly
            </span>
            <Switch 
              checked={isAnnual} 
              onCheckedChange={setIsAnnual} 
              className="data-[state=checked]:bg-teal-600"
            />
            <span className={`text-sm font-medium ${isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
              Annual <span className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-xs px-2 py-0.5 rounded-full ml-1">Save 20%</span>
            </span>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <motion.div 
              key={tier.name}
              className={`relative rounded-2xl shadow-lg overflow-hidden ${
                tier.popular 
                  ? 'border-2 border-teal-500 dark:border-teal-400 bg-white dark:bg-gray-800' 
                  : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {tier.popular && (
                <div className="absolute top-0 left-0 right-0 bg-teal-500 dark:bg-teal-600 text-white py-1 text-sm font-medium text-center">
                  Most Popular
                </div>
              )}
              
              <div className={`p-8 ${tier.popular ? 'pt-10' : ''}`}>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{tier.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{tier.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    ${isAnnual ? tier.annualPrice : tier.monthlyPrice}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">
                    /month
                  </span>
                  {isAnnual && tier.monthlyPrice > 0 && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Billed annually (${tier.annualPrice * 12}/year)
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={() => navigate("/")}
                  className={`w-full py-6 mb-8 ${
                    tier.popular 
                      ? 'bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'
                  }`}
                  size="lg"
                >
                  {tier.buttonLabel}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                
                <div className="space-y-4">
                  {tier.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-teal-500 mr-3 mt-0.5 flex-shrink-0" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 dark:text-gray-600 mr-3 mt-0.5 flex-shrink-0" />
                      )}
                      <span className={feature.included ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}>
                        {feature.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="container mx-auto px-6 py-16">
        <motion.div 
          className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-10 text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-6 md:mb-0">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Need a custom plan?</h2>
                <p className="text-indigo-100 mb-0 md:pr-10">
                  We offer tailored solutions for agencies and large organizations with specific requirements.
                </p>
              </div>
              <Button 
                onClick={() => navigate("/")}
                className="bg-white text-indigo-600 hover:bg-gray-100 px-6 py-3 font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
                size="lg"
              >
                Contact Sales
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Find answers to common questions about our pricing and plans.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white flex items-center">
                <HelpCircle className="w-5 h-5 text-teal-500 mr-2 flex-shrink-0" />
                {faq.question}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {faq.answer}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 text-center shadow-xl border border-gray-100 dark:border-gray-700">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-block">
                  <span className="bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 text-sm px-3 py-1 rounded-full mb-4 inline-block">
                    Limited Time Offer
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Get 20% off your first 3 months</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Start Creating Better Content Today</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
            Try any plan free for 14 days. No credit card required.
          </p>
          <Button 
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 text-white text-lg font-medium py-6 px-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
            size="lg"
          >
            Get Started Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
