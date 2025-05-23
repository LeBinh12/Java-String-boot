import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Ngôn ngữ mặc định
const resources = {
  vi: {
    translation: {
      "Thực đơn": "Thực đơn",
      "Thông tin nhà hàng": "Thông tin nhà hàng",
      "Lịch sử đơn hàng": "Lịch sử đơn hàng",
      "Bàn đặt": "Bàn đặt",
      "Trang chủ": "Trang chủ", // Viết hoa lại chữ cái đầu
      "Giỏ hàng": "Giỏ hàng",
      "Trạng thái đơn hàng": "Trạng thái đơn hàng",
      "Đang tải...": "Đang tải...",
      "Vui lòng đăng nhập để xem đơn hàng.":
        "Vui lòng đăng nhập để xem đơn hàng.",
      "Bạn chưa có đơn hàng nào.": "Bạn chưa có đơn hàng nào.",
      "Quay lại trang chủ": "Quay lại trang chủ",
      "Trạng thái": "Trạng thái",
      "Thời gian ước tính": "Thời gian ước tính",
      "Chi tiết đơn hàng": "Chi tiết đơn hàng",
      "Nhà hàng": "Nhà hàng",
      Bàn: "Bàn",
      "Thời gian đặt": "Thời gian đặt",
      "Thời gian đặt bàn": "Thời gian đặt bàn",
      "Món ăn đã đặt": "Món ăn đã đặt",
      "Không có món ăn nào trong đơn hàng này.":
        "Không có món ăn nào trong đơn hàng này.",
      "Tổng tiền": "Tổng tiền",
      "Hành động": "Hành động",
      "Xác nhận hoàn thành": "Xác nhận hoàn thành",
      "Đã lưu vào lịch sử": "Đã lưu vào lịch sử",
      "Xem giỏ hàng": "Xem giỏ hàng",
      "Xem lịch sử đơn hàng": "Xem lịch sử đơn hàng",
      "Đăng xuất": "Đăng xuất",
      "Bạn chưa có lịch sử đơn hàng nào.": "Bạn chưa có lịch sử đơn hàng nào.",
      "Mã lịch sử": "Mã lịch sử",
      "Số lượng": "Số lượng",
      Trước: "Trước",
      Sau: "Sau",
      "Đăng nhập": "Đăng nhập",
      "Đăng ký": "Đăng ký",
    },
  },
  en: {
    translation: {
      "Thực đơn": "Menu",
      "Thông tin nhà hàng": "Restaurant Information",
      "Lịch sử đơn hàng": "Order History",
      "Bàn đặt": "Table Reservation",
      "Trang chủ": "Home",
      "Giỏ hàng": "Cart",
      "Trạng thái đơn hàng": "Order Status",
      "Đang tải...": "Loading...",
      "Vui lòng đăng nhập để xem đơn hàng.":
        "Please log in to view your order.",
      "Bạn chưa có đơn hàng nào.": "You have no orders yet.",
      "Quay lại trang chủ": "Back to Home",
      "Trạng thái": "Status",
      "Thời gian ước tính": "Estimated Time",
      "Chi tiết đơn hàng": "Order Details",
      "Nhà hàng": "Restaurant",
      Bàn: "Table",
      "Thời gian đặt": "Order Time",
      "Thời gian đặt bàn": "Reservation Time",
      "Món ăn đã đặt": "Ordered Dishes",
      "Không có món ăn nào trong đơn hàng này.": "No dishes in this order.",
      "Tổng tiền": "Total Amount",
      "Hành động": "Actions",
      "Xác nhận hoàn thành": "Confirm Completion",
      "Đã lưu vào lịch sử": "Saved to History",
      "Xem giỏ hàng": "View Cart",
      "Xem lịch sử đơn hàng": "View Order History",
      "Đăng xuất": "Logout",
      "Bạn chưa có lịch sử đơn hàng nào.": "You have no order history yet.",
      "Mã lịch sử": "History ID",
      "Số lượng": "Quantity",
      Trước: "Previous",
      Sau: "Next",
      "Đăng nhập": "Login",
      "Đăng ký": "Register",
    },
  },
  zh: {
    translation: {
      "Thực đơn": "菜单",
      "Thông tin nhà hàng": "餐厅信息",
      "Lịch sử đơn hàng": "订单历史",
      "Bàn đặt": "预订桌子",
      "Trang chủ": "首页",
      "Giỏ hàng": "购物车",
      "Trạng thái đơn hàng": "订单状态",
      "Đang tải...": "加载中...",
      "Vui lòng đăng nhập để xem đơn hàng.": "请登录以查看订单。",
      "Bạn chưa có đơn hàng nào.": "您还没有订单。",
      "Quay lại trang chủ": "返回首页",
      "Trạng thái": "状态",
      "Thời gian ước tính": "预计时间",
      "Chi tiết đơn hàng": "订单详情",
      "Nhà hàng": "餐厅",
      Bàn: "桌子",
      "Thời gian đặt": "订单时间",
      "Thời gian đặt bàn": "预订时间",
      "Món ăn đã đặt": "已点菜品",
      "Không có món ăn nào trong đơn hàng này.": "此订单中没有菜品。",
      "Tổng tiền": "总金额",
      "Hành động": "操作",
      "Xác nhận hoàn thành": "确认完成",
      "Đã lưu vào lịch sử": "已保存到历史",
      "Xem giỏ hàng": "查看购物车",
      "Xem lịch sử đơn hàng": "查看订单历史",
      "Đăng xuất": "退出",
      "Bạn chưa có lịch sử đơn hàng nào.": "您还没有订单历史。",
      "Mã lịch sử": "历史ID",
      "Số lượng": "数量",
      Trước: "上一页",
      Sau: "下一页",
      "Đăng nhập": "登录",
      "Đăng ký": "注册",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "vi", // Ngôn ngữ mặc định
    detection: {
      order: ["navigator", "localStorage", "htmlTag"],
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
  });
export default i18n;
