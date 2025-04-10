
import React from "react";
import { Order, PaymentStatus } from "@/types/checkout";
import CustomerDetailsModal from "./modals/CustomerDetailsModal";
import PaymentDetailsModal from "./modals/PaymentDetailsModal";
import EditStatusModal from "./modals/EditStatusModal";
import ConfirmDeleteModal from "./modals/ConfirmDeleteModal";

// Re-export modal components for backwards compatibility
export {
  CustomerDetailsModal as CustomerModal,
  PaymentDetailsModal as PaymentModal,
  EditStatusModal as StatusModal,
  ConfirmDeleteModal as DeleteConfirmModal,
};
