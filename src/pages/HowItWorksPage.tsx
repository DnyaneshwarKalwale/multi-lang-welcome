
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const HowItWorksPage = () => {
  const navigate = useNavigate();

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
            How Scripe Works for You
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 dark:text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Learn how our platform helps you create better content, grow your audience, and save time with our streamlined workflow.
          </motion.p>
        </div>
      </section>

      {/* Step-by-Step Process */}
      <section className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Step 1 */}
          <motion.div 
            className="flex flex-col md:flex-row items-center mb-20 relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-teal-500 text-white text-3xl font-bold flex items-center justify-center flex-shrink-0 mb-6 md:mb-0 z-10">1</div>
            
            {/* Connecting line */}
            <div className="absolute left-10 md:left-12 top-20 md:top-24 w-0.5 h-full md:h-[calc(100%+80px)] bg-gray-200 dark:bg-gray-700 hidden md:block -z-10"></div>
            
            <div className="md:ml-10 max-w-lg">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Sign Up and Set Your Preferences</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Create your account and tell us about your brand, content style, and goals. Our AI will learn from your preferences to generate tailored content that matches your unique voice.
              </p>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-teal-500 mr-2 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Set up your brand profile and preferences</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-teal-500 mr-2 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Connect your social media accounts</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-teal-500 mr-2 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Define your target audience</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div 
            className="flex flex-col md:flex-row items-center mb-20 relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-indigo-500 text-white text-3xl font-bold flex items-center justify-center flex-shrink-0 mb-6 md:mb-0 z-10">2</div>
            
            {/* Connecting line */}
            <div className="absolute left-10 md:left-12 top-20 md:top-24 w-0.5 h-full md:h-[calc(100%+80px)] bg-gray-200 dark:bg-gray-700 hidden md:block -z-10"></div>
            
            <div className="md:ml-10 max-w-lg">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Create AI-Powered Content</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Use our AI engine to generate engaging content for various platforms. Edit and refine the suggestions to match your exact requirements.
              </p>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-indigo-500 mr-2 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Choose content type and format</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-indigo-500 mr-2 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Generate multiple content options</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-indigo-500 mr-2 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Edit and customize to perfection</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div 
            className="flex flex-col md:flex-row items-center mb-20 relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-emerald-500 text-white text-3xl font-bold flex items-center justify-center flex-shrink-0 mb-6 md:mb-0 z-10">3</div>
            
            {/* Connecting line */}
            <div className="absolute left-10 md:left-12 top-20 md:top-24 w-0.5 h-full md:h-[calc(100%+80px)] bg-gray-200 dark:bg-gray-700 hidden md:block -z-10"></div>
            
            <div className="md:ml-10 max-w-lg">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Schedule and Publish</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Plan your content calendar and schedule posts for optimal times. Publish directly to all your connected social platforms with a single click.
              </p>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-emerald-500 mr-2 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Plan your content calendar</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-emerald-500 mr-2 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Schedule posts for optimal engagement times</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-emerald-500 mr-2 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Publish to multiple platforms simultaneously</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Step 4 */}
          <motion.div 
            className="flex flex-col md:flex-row items-center relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-violet-500 text-white text-3xl font-bold flex items-center justify-center flex-shrink-0 mb-6 md:mb-0 z-10">4</div>
            
            <div className="md:ml-10 max-w-lg">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Analyze and Optimize</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Track the performance of your content with detailed analytics. Learn what works best and continuously improve your strategy.
              </p>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-violet-500 mr-2 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Monitor engagement metrics across platforms</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-violet-500 mr-2 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Get AI-powered content improvement suggestions</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-violet-500 mr-2 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Continuously optimize your content strategy</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Works With Your Favorite Tools
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Seamlessly integrate with popular platforms and tools to streamline your workflow.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-10 mb-12">
          {/* Platform logos would go here - using placeholders */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="w-24 h-24 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-md">
              <div className="w-12 h-12 rounded-md bg-gray-200 dark:bg-gray-700 opacity-50"></div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="bg-gradient-to-r from-teal-500 to-indigo-600 rounded-2xl p-10 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Streamline Your Content Creation?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already using Scripe to create amazing content faster and smarter.
          </p>
          <Button 
            onClick={() => navigate("/")}
            className="bg-white hover:bg-gray-100 text-teal-600 text-lg font-medium py-6 px-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
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

export default HowItWorksPage;
