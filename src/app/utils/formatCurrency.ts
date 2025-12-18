/**
 * Format số tiền theo định dạng Việt Nam với dấu chấm ngắt
 * Ví dụ: 4490000000 -> "4.490.000.000"
 */
export function formatCurrency(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null || amount === '') {
    return '0';
  }
  
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    return '0';
  }
  
  return numAmount.toLocaleString('vi-VN');
}

/**
 * Format số tiền với đơn vị VND
 * Ví dụ: 4490000000 -> "4.490.000.000 ₫"
 */
export function formatCurrencyVND(amount: number | string | undefined | null): string {
  return `${formatCurrency(amount)} ₫`;
}

/**
 * Format số tiền khi nhập vào input (thêm dấu chấm ngắt)
 * Ví dụ: "4490000" -> "4.490.000"
 */
export function formatCurrencyInput(value: string): string {
  // Loại bỏ tất cả ký tự không phải số
  const numbers = value.replace(/[^\d]/g, '');
  
  if (!numbers) return '';
  
  // Format với dấu chấm ngắt
  return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Parse số tiền từ input (loại bỏ dấu chấm)
 * Ví dụ: "4.490.000" -> 4490000
 */
export function parseCurrencyInput(value: string): number {
  // Loại bỏ tất cả ký tự không phải số
  const numbers = value.replace(/[^\d]/g, '');
  
  if (!numbers) return 0;
  
  return parseFloat(numbers);
}

