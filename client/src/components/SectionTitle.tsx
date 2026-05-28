import type { SectionTitleProps } from "../types";
import { motion } from "motion/react";

export default function SectionTitle({
  text1,
  text2,
  text3,
}: SectionTitleProps) {
  return (
    <>
      <motion.p
        className="mx-auto mt-28 w-max rounded-full border border-pink-800 bg-pink-950/70 px-10 py-2 text-center font-medium text-pink-600"
        initial={{ y: 120, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
      >
        {text1}
      </motion.p>

      <motion.h3
        className="mx-auto mt-4 text-center text-3xl font-semibold"
        initial={{ y: 120, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 280, damping: 70, mass: 1 }}
      >
        {text2}
      </motion.h3>

      <motion.p
        className="mx-auto mt-2 max-w-xl text-center text-slate-300"
        initial={{ y: 120, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
      >
        {text3}
      </motion.p>
    </>
  );
}
