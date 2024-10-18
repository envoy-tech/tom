"use client";
import Header from "@/components/page-components/Header";
import Footer from "@/components/page-components/Footer";
import Mobile from "@/components/page-components/Mobile";
import useScreenSize from "@/hooks/useScreenSize";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { width, height } = useScreenSize();
  const initial = { opacity: 0 };
  const animate = { opacity: 1 };
  const exit = { opacity: 0 };

  const transition = { duration: 0.6, ease: "easeInOut", delay: 0.25 };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <AnimatePresence>
        <motion.div
          className="h-full w-full flex flex-1 justify-center"
          initial={initial}
          animate={animate}
          exit={exit}
          transition={transition}
        >
          {!width || width >= 768 ? children : <Mobile />}
        </motion.div>
      </AnimatePresence>

      <Footer mode="dark" />
    </div>
  );
}
