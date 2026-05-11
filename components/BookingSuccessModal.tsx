"use client";

import { motion, AnimatePresence } from "framer-motion";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function BookingSuccessModal({
  open,
  onClose,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* modal */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md text-center shadow-xl">

              <div className="text-4xl mb-3">🎉</div>

              <h2 className="text-xl font-semibold mb-2">
                ¡Reserva confirmada!
              </h2>

              <p className="text-gray-600 text-sm mb-5">
                Tu reserva fue creada correctamente.
              </p>

              <button
                onClick={onClose}
                className="bg-rose-500 text-white px-5 py-2 rounded-xl w-full"
              >
                Entendido
              </button>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}