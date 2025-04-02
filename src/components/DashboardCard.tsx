
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface DashboardCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
}

export default function DashboardCard({
  title,
  icon,
  children,
  delay = 0,
}: DashboardCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
    >
      <Card className="h-full border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200">
        <CardHeader className="pb-2 flex flex-row items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-brand-purple/10 to-brand-pink/10 dark:from-brand-purple/20 dark:to-brand-pink/20 rounded-full">
            {icon}
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  );
}
