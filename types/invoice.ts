// src/types/invoice.ts

// Ini bentuk data "Barang" yang dibeli
export type InvoiceItem = {
  name: string;
  quantity: number;
  price: number;
};

// Ini bentuk data "Invoice" utuh yang mau disimpan
export type InvoiceData = {
  customer_name: string;
  total_amount: number;
  items: InvoiceItem[]; // Array of items
};