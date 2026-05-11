"use client";

import { motion, AnimatePresence } from "framer-motion";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ReservationModal({
  open,
  onClose,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div
              className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold mb-2">
                Reserva confirmada 🎉
              </h2>

              <p className="text-gray-600 text-sm mb-6">
                Tu reserva fue creada correctamente. Recibirás una confirmación pronto.
              </p>

              <button
                onClick={onClose}
                className="w-full bg-black text-white py-3 rounded-xl hover:opacity-90 transition"
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