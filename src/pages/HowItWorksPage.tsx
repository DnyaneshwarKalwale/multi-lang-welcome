
import React from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { useTheme } from "@/contexts/ThemeContext";
import { 
  Sparkles, Rocket, MessageSquare, LineChart, 
  Zap, Target, GanttChart, Users, Award, 
  PuzzlePiece, BookOpen, Brain
} from "lucide-react";

export default function HowItWorksPage() {
  const { theme } = useTheme();
  
  const stepsData = [
    {
      title: "Choose your audience",
      description: "Define who you want to connect with. Our AI analyzes your ideal audience to create messaging that resonates.",
      icon: <Target className="h-8 w-8 text-indigo-500" />,
      delay: 0
    },
    {
      title: "Shape your voice",
      description: "Select your tone, style preferences, and key messaging points. WritePulse adapts to your unique brand voice.",
      icon: <MessageSquare className="h-8 w-8 text-purple-500" />,
      delay: 0.1
    },
    {
      title: "Generate content",
      description: "Our AI crafts compelling copy tailored to your specifications while maintaining professional standards.",
      icon: <Sparkles className="h-8 w-8 text-fuchsia-500" />,
      delay: 0.2
    },
    {
      title: "Analyze & optimize",
      description: "Track performance metrics and receive AI-driven suggestions to continuously improve your engagement.",
      icon: <LineChart className="h-8 w-8 text-rose-500" />,
      delay: 0.3
    }
  ];
  
  const featuresData = [
    {
      title: "Intelligent Content Generation",
      description: "Our advanced AI analyzes your industry, audience, and competitors to create engaging content that stands out.",
      icon: <Brain className="h-8 w-8" />,
      color: "from-indigo-500 to-blue-500"
    },
    {
      title: "Personalized Voice Training",
      description: "The more you use WritePulse, the better it learns your unique voice and style preferences.",
      icon: <Zap className="h-8 w-8" />,
      color: "from-purple-500 to-indigo-500"
    },
    {
      title: "Smart Scheduling",
      description: "Optimize your posting schedule based on when your audience is most active and receptive.",
      icon: <GanttChart className="h-8 w-8" />,
      color: "from-fuchsia-500 to-purple-500"
    },
    {
      title: "Collaborative Workspace",
      description: "Seamlessly work with team members to plan, create, and approve content before publishing.",
      icon: <Users className="h-8 w-8" />,
      color: "from-rose-500 to-fuchsia-500"
    },
    {
      title: "Performance Analytics",
      description: "Comprehensive metrics tracking to understand what works best for your specific audience.",
      icon: <LineChart className="h-8 w-8" />,
      color: "from-amber-500 to-rose-500"
    },
    {
      title: "Integration Ecosystem",
      description: "Connect seamlessly with your favorite tools including major social platforms and CRM systems.",
      icon: <PuzzlePiece className="h-8 w-8" />,
      color: "from-emerald-500 to-teal-500"
    }
  ];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };
  
  // Floating animation for decorative elements
  const floatingAnimation = {
    y: ["-10px", "10px"],
    transition: {
      y: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };
  
  return (
    <Layout>
      <div className="bg-gradient-to-b from-white to-indigo-50 dark:from-gray-900 dark:to-indigo-950">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-20 right-10 opacity-20">
            <motion.div 
              animate={floatingAnimation}
              className="text-indigo-500 dark:text-indigo-300"
            >
              <Sparkles size={60} />
            </motion.div>
          </div>
          
          <div className="absolute bottom-10 left-10 opacity-20">
            <motion.div 
              animate={{
                ...floatingAnimation,
                transition: { ...floatingAnimation.transition, delay: 0.5 }
              }}
              className="text-purple-500 dark:text-purple-300"
            >
              <Award size={50} />
            </motion.div>
          </div>
          
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 dark:from-indigo-400 dark:via-purple-400 dark:to-fuchsia-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                How WritePulse Works
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 dark:text-gray-300 mb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Our powerful AI content platform simplifies your content creation process,
                from ideation to publication and beyond.
              </motion.p>
              
              <motion.div
                className="mx-auto w-24 h-24 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 flex items-center justify-center mb-12 shadow-lg shadow-indigo-500/20 dark:shadow-indigo-900/30"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
              >
                <Rocket className="h-10 w-10 text-white" />
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* How It Works Steps */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-6">
            <motion.h2 
              className="text-3xl font-bold text-center mb-16 text-gray-900 dark:text-white"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Four Simple Steps to Content Success
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stepsData.map((step, index) => (
                <motion.div 
                  key={step.title}
                  className="relative bg-indigo-50 dark:bg-indigo-950/50 rounded-xl p-8 overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="mb-4 relative z-10">
                    {step.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 relative z-10 text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 relative z-10">
                    {step.description}
                  </p>
                  
                  <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-indigo-200/50 dark:bg-indigo-700/20 blur-xl"></div>
                  <div className="absolute top-1/2 left-0 transform -translate-x-1/2 w-12 h-12 rounded-full bg-purple-300/50 dark:bg-purple-700/20 blur-lg"></div>
                  
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                  
                  <div className="absolute -bottom-1 -left-1 w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 border-2 border-indigo-200 dark:border-indigo-700/50">
                    {index + 1}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <motion.h2 
              className="text-3xl font-bold text-center mb-4 text-gray-900 dark:text-white"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Powerful Features to Elevate Your Content
            </motion.h2>
            
            <motion.p 
              className="text-xl text-center max-w-3xl mx-auto mb-16 text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Everything you need to create engaging content that converts and connects with your audience
            </motion.p>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {featuresData.map((feature, index) => (
                <motion.div 
                  key={feature.title}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden"
                  variants={itemVariants}
                >
                  <div className={`h-2 w-full bg-gradient-to-r ${feature.color}`}></div>
                  <div className="p-6">
                    <div className={`w-14 h-14 rounded-lg mb-5 bg-gradient-to-br ${feature.color} flex items-center justify-center text-white`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-20 bg-indigo-50 dark:bg-indigo-950/30">
          <div className="container mx-auto px-6">
            <motion.h2 
              className="text-3xl font-bold text-center mb-16 text-gray-900 dark:text-white"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Frequently Asked Questions
            </motion.h2>
            
            <div className="max-w-3xl mx-auto">
              {[
                {
                  question: "How does the AI understand my brand voice?",
                  answer: "Our AI analyzes your existing content, preferences, and the examples you provide during onboarding. It then creates a unique voice profile that's continuously refined as you use the platform and provide feedback on generated content."
                },
                {
                  question: "Can I edit the AI-generated content?",
                  answer: "Absolutely! You have complete editorial control. Our AI provides high-quality starting points, but you can edit, refine, or completely rewrite any generated content to perfectly match your needs."
                },
                {
                  question: "Is my data secure with WritePulse?",
                  answer: "Yes. We employ enterprise-grade encryption, regular security audits, and strict access controls to protect your data. We never share your content or analytics with third parties without your explicit permission."
                },
                {
                  question: "How often can I generate new content?",
                  answer: "It depends on your subscription plan. Our free tier offers a limited number of generations per month, while our paid plans provide more generous allowances scaled to your needs. Check our pricing page for detailed information."
                }
              ].map((faq, index) => (
                <motion.div 
                  key={index}
                  className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">{faq.question}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 dark:from-indigo-900 dark:via-purple-900 dark:to-fuchsia-900 text-white">
          <div className="container mx-auto px-6 text-center">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Ready to transform your content strategy?
            </motion.h2>
            
            <motion.p 
              className="text-xl mb-10 max-w-2xl mx-auto opacity-90"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Join thousands of professionals who are already using WritePulse to create content that engages, converts, and builds genuine connections.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <a 
                href="/pricing" 
                className="inline-block bg-white text-indigo-600 hover:bg-indigo-50 rounded-full px-10 py-4 font-medium text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                See our pricing
              </a>
            </motion.div>
          </div>
        </section>
        
        {/* Testimonial Section */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <motion.div 
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <BookOpen className="mx-auto h-12 w-12 text-indigo-500 mb-8" />
              
              <blockquote className="text-2xl md:text-3xl font-light italic text-gray-700 dark:text-gray-300 mb-8">
                "WritePulse has completely transformed how our marketing team creates content. What used to take days now takes minutes, and the quality is consistently excellent."
              </blockquote>
              
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src="https://randomuser.me/api/portraits/women/42.jpg" 
                    alt="Testimonial author"
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 dark:text-white">Sarah Johnson</p>
                  <p className="text-gray-600 dark:text-gray-400">Marketing Director at TechFlow</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
