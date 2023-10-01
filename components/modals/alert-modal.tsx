"use client";

import { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}
const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) => {
  const [isMounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }
  return (
    <Modal
      title="Are you sure?"
      desc="This action cannot br undone"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-end w-full ">
        <Button disabled={loading} variant={"outline"} onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={onConfirm} disabled={loading} variant={"destructive"}>
          Continue
        </Button>
      </div>
    </Modal>
  );
};
export default AlertModal;
