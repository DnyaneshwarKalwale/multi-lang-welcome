import React from 'react';
import { motion } from 'framer-motion';
import { Twitter } from 'lucide-react';

const itemVariants = {
  initial: { scale: 0 },
  animate: { scale: 1 },
  transition: { duration: 0.5 }
};

const LoginPage: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <motion.div
        className="w-20 h-20 mx-auto mb-6 rounded-full bg-brand-primary/20 flex items-center justify-center"
        variants={itemVariants}
      >
        <Twitter className="w-12 h-12 text-brand-primary" />
      </motion.div>
    </div>
  );
};

export default LoginPage; 