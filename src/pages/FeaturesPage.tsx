
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Shield, Zap, Users, LineChart, Play, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const FeaturesPage = () => {
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
            Powerful Features to Boost Your Content
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 dark:text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover all the tools and features that make BrandOut the ultimate platform for content creators and social media managers.
          </motion.p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="w-14 h-14 rounded-xl bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center mb-6">
              <Zap className="w-7 h-7 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">AI-Powered Content</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Generate high-quality content that aligns with your brand voice and resonates with your audience using our advanced AI technology.
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-teal-500 mr-2 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">Personalized content recommendations</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-teal-500 mr-2 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">Smart content optimization</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-teal-500 mr-2 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">Voice and tone matching</span>
              </li>
            </ul>
          </motion.div>

          {/* Feature 2 */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="w-14 h-14 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mb-6">
              <LineChart className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Advanced Analytics</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Track performance metrics and get actionable insights to improve your content strategy and grow your audience.
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-emerald-500 mr-2 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">Engagement metrics and trends</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-emerald-500 mr-2 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">Audience growth tracking</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-emerald-500 mr-2 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">Content performance reports</span>
              </li>
            </ul>
          </motion.div>

          {/* Feature 3 */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="w-14 h-14 rounded-xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center mb-6">
              <Users className="w-7 h-7 text-violet-600 dark:text-violet-400" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Team Collaboration</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Work seamlessly with your team to create, review, and publish content with our collaborative features.
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-violet-500 mr-2 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">Real-time content editing</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-violet-500 mr-2 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">Approval workflows</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-violet-500 mr-2 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">Role-based permissions</span>
              </li>
            </ul>
          </motion.div>

          {/* Feature 4 */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="w-14 h-14 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mb-6">
              <Play className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Multi-Platform Publishing</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Publish your content to multiple social media platforms with just a few clicks and schedule posts in advance.
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-indigo-500 mr-2 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">Social media integration</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-indigo-500 mr-2 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">Advanced scheduling</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-indigo-500 mr-2 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">Cross-platform analytics</span>
              </li>
            </ul>
          </motion.div>

          {/* Feature 5 */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="w-14 h-14 rounded-xl bg-cyan-100 dark:bg-cyan-900/40 flex items-center justify-center mb-6">
              <Star className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Content Templates</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Save time with ready-to-use templates for different content types and customize them to match your brand.
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-cyan-500 mr-2 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">Industry-specific templates</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-cyan-500 mr-2 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">Customizable designs</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-cyan-500 mr-2 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">Brand asset library</span>
              </li>
            </ul>
          </motion.div>

          {/* Feature 6 */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="w-14 h-14 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center mb-6">
              <Shield className="w-7 h-7 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Content Security</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Keep your content and data secure with our advanced security features and regular backups.
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-amber-500 mr-2 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">End-to-end encryption</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-amber-500 mr-2 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">Automatic content backups</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-amber-500 mr-2 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">Secure access controls</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-teal-500 to-indigo-600 rounded-2xl p-10 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience These Features?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of content creators who are already using BrandOut to create amazing content.
          </p>
          <Button 
            onClick={() => navigate("/")}
            className="bg-white hover:bg-gray-100 text-teal-600 text-lg font-medium py-6 px-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
            size="lg"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;
