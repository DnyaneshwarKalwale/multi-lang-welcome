
import React from "react";
import { motion } from "framer-motion";
import { Star, Quote, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const TestimonialsPage = () => {
  const navigate = useNavigate();

  // Testimonial data
  const testimonials = [
    {
      id: 1,
      name: "Michael Johnson",
      role: "Social Media Manager at TechCorp",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      quote: "BrandOut has completely transformed our social media strategy. The AI-generated content is so authentic that our audience engagement has increased by over 200% in just three months.",
      rating: 5
    },
    {
      id: 2,
      name: "Sarah Williams",
      role: "Content Creator",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      quote: "As a solo content creator, I was struggling to maintain a consistent posting schedule. BrandOut has been a game-changer, helping me create quality content in a fraction of the time.",
      rating: 5
    },
    {
      id: 3,
      name: "David Chen",
      role: "Marketing Director at GrowthHub",
      image: "https://randomuser.me/api/portraits/men/36.jpg",
      quote: "The analytics features alone are worth the investment. We've been able to fine-tune our content strategy based on actual data, resulting in a 45% increase in conversion rates.",
      rating: 4
    },
    {
      id: 4,
      name: "Emily Rodriguez",
      role: "Influencer & Brand Consultant",
      image: "https://randomuser.me/api/portraits/women/29.jpg",
      quote: "I manage multiple brand accounts and BrandOut has made it so much easier to maintain distinct voices for each one. The platform understands nuance in a way other tools simply don't.",
      rating: 5
    },
    {
      id: 5,
      name: "James Wilson",
      role: "E-commerce Entrepreneur",
      image: "https://randomuser.me/api/portraits/men/22.jpg",
      quote: "Our product promotions used to fall flat on social media. With BrandOut, we're creating compelling content that actually converts. Our ROI on social campaigns has doubled.",
      rating: 5
    },
    {
      id: 6,
      name: "Sophia Lee",
      role: "Digital Marketing Specialist",
      image: "https://randomuser.me/api/portraits/women/54.jpg",
      quote: "The team collaboration features are excellent. We can now seamlessly work together on content calendars and campaigns without endless email chains and confusion.",
      rating: 4
    }
  ];

  // Featured case studies
  const caseStudies = [
    {
      id: 1,
      company: "TechStart",
      industry: "SaaS",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      results: ["150% increase in social engagement", "75% reduction in content creation time", "45% growth in qualified leads"]
    },
    {
      id: 2,
      company: "FitLife",
      industry: "Health & Fitness",
      image: "https://images.unsplash.com/photo-1518310383802-640c2de311b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      results: ["200K+ new followers in 6 months", "35% increase in class bookings", "Consistent brand voice across 12 locations"]
    }
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
            What Our Customers Are Saying
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 dark:text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover how BrandOut has helped content creators, marketers, and businesses transform their content strategy and achieve remarkable results.
          </motion.p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700 flex flex-col h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center mb-6">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-14 h-14 rounded-full object-cover border-2 border-teal-500" 
                />
                <div className="ml-4">
                  <h3 className="font-bold text-gray-900 dark:text-white">{testimonial.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="mb-4 text-yellow-400 flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="w-5 h-5" 
                    fill={i < testimonial.rating ? "currentColor" : "none"} 
                  />
                ))}
              </div>
              
              <div className="mb-6 flex-grow">
                <div className="text-teal-600 dark:text-teal-400 mb-2">
                  <Quote className="w-8 h-8 opacity-50" />
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">
                  "{testimonial.quote}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Success Stories
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Read how these companies achieved incredible results with BrandOut.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={study.image} 
                  alt={study.company} 
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-500 ease-in-out" 
                />
              </div>
              <div className="p-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{study.company}</h3>
                  <span className="text-sm px-3 py-1 bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 rounded-full">
                    {study.industry}
                  </span>
                </div>
                <ul className="space-y-2 mb-4">
                  {study.results.map((result, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-xs font-bold">{idx + 1}</span>
                      </div>
                      <span className="text-gray-600 dark:text-gray-300">{result}</span>
                    </li>
                  ))}
                </ul>
                <button className="text-teal-600 dark:text-teal-400 font-medium hover:text-teal-700 dark:hover:text-teal-300 transition-colors flex items-center">
                  Read full case study
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-12">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4 text-white">
              The Numbers Speak for Themselves
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-4xl font-bold text-white mb-2">93%</h3>
              <p className="text-indigo-100">Users report time savings</p>
            </motion.div>
            
            <motion.div 
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-4xl font-bold text-white mb-2">5,300+</h3>
              <p className="text-indigo-100">Active customers</p>
            </motion.div>
            
            <motion.div 
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-4xl font-bold text-white mb-2">78%</h3>
              <p className="text-indigo-100">Average engagement increase</p>
            </motion.div>
            
            <motion.div 
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-4xl font-bold text-white mb-2">4.9/5</h3>
              <p className="text-indigo-100">Average customer rating</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-10 text-center shadow-xl border border-gray-100 dark:border-gray-700">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Ready to Join Our Success Stories?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
            Start creating content that resonates with your audience and drives real results.
          </p>
          <Button 
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 text-white text-lg font-medium py-6 px-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
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

export default TestimonialsPage;
