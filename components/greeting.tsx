import { motion } from 'framer-motion';
import type { User } from 'next-auth';

interface GreetingProps {
  user?: User;
}

export const Greeting = ({ user }: GreetingProps) => {
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getPersonalizedGreeting = () => {
    const timeGreeting = getTimeBasedGreeting();
    const fullName = user?.name || 'there';
    const firstName = fullName.split(' ')[0];
    return `${timeGreeting}, ${firstName}.`;
  };

  return (
    <div
      key="overview"
      className="mx-auto mt-4 flex size-full max-w-3xl flex-col justify-center px-4 md:mt-16 md:px-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.5 }}
        className="font-semibold text-xl md:text-2xl"
      >
        {getPersonalizedGreeting()}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.6 }}
        className="text-xl text-zinc-500 md:text-2xl"
      >
        How can I help you today?
      </motion.div>
    </div>
  );
};
