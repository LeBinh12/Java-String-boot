package com.example.TestApi.FuncSupport;

import com.example.TestApi.DTO.PaymentTransactionDTO;
import com.example.TestApi.DTO.PaymentWebhookRequest;
import com.example.TestApi.Entities.Order;
import com.example.TestApi.Entities.PaymentTransaction;
import com.example.TestApi.Entities.User;
import com.example.TestApi.Jpa.OrderJpa;
import com.example.TestApi.Jpa.PaymentTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class PaymentTransactionService {

    @Autowired
    private PaymentTransactionRepository paymentTransactionRepository;

    @Autowired
    private OrderJpa orderJpa;


    public PaymentTransactionDTO createPaymentTransaction(Integer orderId, Integer userId, BigDecimal depositAmount) {


        Order order = orderJpa.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        PaymentTransaction transaction = new PaymentTransaction();
        transaction.setOrder(order);

        User user = new User();
        user.setUser_id(userId);
        transaction.setUser(user);

        transaction.setAmount(depositAmount);
        transaction.setPaymentMethod("QRCode");
        transaction.setTransactionStatus("Pending");
        transaction.setTransactionCode(UUID.randomUUID().toString().replace("-",""));
        transaction.setPaymentGateway("VietQR");
        transaction.setCreatedAt(LocalDateTime.now());
        transaction.setUpdatedAt(LocalDateTime.now());

        String qrData = generateQRData(order, transaction, depositAmount);
        transaction.setQrCodeUrl(qrData);

        paymentTransactionRepository.save(transaction);

        PaymentTransactionDTO dto = new PaymentTransactionDTO();
        dto.setTransactionId(transaction.getTransactionId());
        dto.setOrderId(transaction.getOrder().getOrderId());
        dto.setUserId(userId); // Sử dụng userId đã truyền vào
        dto.setAmount(depositAmount);
        dto.setPaymentMethod(transaction.getPaymentMethod());
        dto.setTransactionStatus(transaction.getTransactionStatus());
        dto.setTransactionCode(transaction.getTransactionCode());
        dto.setPaymentGateway(transaction.getPaymentGateway());
        dto.setQrCodeUrl(transaction.getQrCodeUrl());
        dto.setCreatedAt(transaction.getCreatedAt());
        dto.setUpdatedAt(transaction.getUpdatedAt());

        return dto;
    }

    // Tạo dữ liệu mã QR
    public String generateQRData(Order order, PaymentTransaction transaction, BigDecimal depositAmount) {
        String url = "https://api.vietqr.io/v2/generate";

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-client-id", "5dfac793-4037-4034-a43a-0883183efe6f"); // <-- lấy từ VietQR
        headers.set("x-api-key", "d70bcc85-df5c-4531-bd6b-7d4f175a49e0");     // <-- lấy từ VietQR

        Map<String, Object> payload = new HashMap<>();
        payload.put("accountNo", "1025981176");
        payload.put("accountName", "LE PHUOC BINH");
        payload.put("acqId", 970436); // Vietcombank
        payload.put("amount", depositAmount.longValue());
        payload.put("addInfo", "Ma Xac Nhan: "+ transaction.getTransactionCode());
        payload.put("template", "compact2");
        payload.put("callbackUrl", "https://3858-14-191-79-83.ngrok-free.app/payment/webhook");

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            Map<String, Object> data = (Map<String, Object>) response.getBody().get("data");
            return (String) data.get("qrDataURL"); // ảnh QR
        }

        return null;
    }


    // Kiểm tra trạng thái giao dịch
    public PaymentTransactionDTO getTransactionStatusByCode(String transactionCode) {
        PaymentTransaction transaction = paymentTransactionRepository.findByTransactionCode(transactionCode);
        if (transaction == null) {
            throw new RuntimeException("Transaction not found for code: " + transactionCode);
        }

        PaymentTransactionDTO dto = new PaymentTransactionDTO();
        dto.setTransactionId(transaction.getTransactionId());
        dto.setOrderId(transaction.getOrder().getOrderId());
        dto.setUserId(transaction.getUser().getUser_id());
        dto.setAmount(transaction.getAmount());
        dto.setPaymentMethod(transaction.getPaymentMethod());
        dto.setTransactionStatus(transaction.getTransactionStatus());
        dto.setTransactionCode(transaction.getTransactionCode());
        dto.setPaymentGateway(transaction.getPaymentGateway());
        dto.setQrCodeUrl(transaction.getQrCodeUrl());
        dto.setCreatedAt(transaction.getCreatedAt());
        dto.setUpdatedAt(transaction.getUpdatedAt());

        return dto;
    }


    // Cập nhật trạng thái giao dịch (giả lập, bạn cần tích hợp API ngân hàng)
    public void updateTransactionStatus(Integer transactionId, String status) {
        PaymentTransaction transaction = paymentTransactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        transaction.setTransactionStatus(status);
        transaction.setUpdatedAt(LocalDateTime.now());
        paymentTransactionRepository.save(transaction);

    }

    public void handleWebhook(PaymentWebhookRequest request) {
        String transactionCode = request.getTransactionCode();
        String status = request.getStatus();

        System.out.println("Webhook received! ✅");
        System.out.println("TransactionCode: " + transactionCode);
        System.out.println("Status: " + status);

        PaymentTransaction transaction = paymentTransactionRepository.findByTransactionCode(transactionCode);
        if (transaction == null) {
            System.out.println("Transaction not found for code: " + transactionCode);
            return;
        }

        if ("SUCCESS".equalsIgnoreCase(status)) {
            updateTransactionStatus(transaction.getTransactionId(), "Completed");
        } else if ("FAILED".equalsIgnoreCase(status)) {
            updateTransactionStatus(transaction.getTransactionId(), "Failed");
        }
    }
}