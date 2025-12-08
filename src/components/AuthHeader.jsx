import React from 'react';
import { FaCheckCircle } from 'react-icons/fa'; // FontAwesome-style checkmark
import { motion } from 'framer-motion';
import logo from '../assets/image.png'; // Import image

const AuthHeader = () => {
  const subtitle = "Empowering smarter operations.";

  return (
    <div className="bg-[#222653] w-full h-full flex items-center justify-center">
      <div className="text-center text-white p-10">
        {/* Animated Checkmark Icon */}
        {/* <motion.div
          className="flex justify-center items-center mb-4"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <FaCheckCircle size={60} color="white" />
        </motion.div> */}

          {/* Image with animation */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <img src={logo} alt="EAZE Consulting Logo" className="max-w-full h-auto" />
        </motion.div>

        {/* Animated Subtitle */}
        {/* <motion.p
          className="mt-4 text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {subtitle}
        </motion.p> */}
      </div>
    </div>
  );
};

export default AuthHeader;
