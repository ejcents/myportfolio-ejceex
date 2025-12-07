"use client";

import { motion } from 'framer-motion';

// This wrapper ensures framer-motion only loads on client side
export const MotionDiv = motion.div;
export const MotionH1 = motion.h1;
export const MotionH2 = motion.h2;
export const MotionH3 = motion.h3;
export const MotionP = motion.p;
export const MotionButton = motion.button;
export const MotionSection = motion.section;

export default motion;
