// Hàm format giá tiền sang dạng "1.000.000 ₫"
export const formatPrice = (price: string): string => {
  if (!price) return "---";
  return Number(price).toLocaleString("vi-VN") + " ₫";
};
