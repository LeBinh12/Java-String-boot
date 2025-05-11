package com.example.TestApi.Controller;

import com.example.TestApi.DTO.PaymentTransactionDTO;
import com.example.TestApi.DTO.PaymentWebhookRequest;
import com.example.TestApi.Entities.PaymentTransaction;
import com.example.TestApi.FuncSupport.PaymentTransactionService;
import com.example.TestApi.Jpa.PaymentTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = {"http://localhost:5173","http://localhost:5174"})
@RestController
@RequestMapping("/payment")
public class PaymentTransactionController {

    @Autowired
    private PaymentTransactionService paymentTransactionService;
    @Autowired
    private PaymentTransactionRepository jpa;
    // API tạo giao dịch thanh toán và trả về mã QR
    @PostMapping("/create")
    public ResponseEntity<PaymentTransactionDTO> createPaymentTransaction(
            @RequestParam Integer orderId,
            @RequestParam Integer userId,
            @RequestParam BigDecimal depositAmount) {
        PaymentTransactionDTO transactionDTO = paymentTransactionService.createPaymentTransaction(orderId, userId, depositAmount);
        return ResponseEntity.ok(transactionDTO);
    }

    // API kiểm tra trạng thái giao dịch
    @GetMapping("/status/{transactionCode}")
    public ResponseEntity<PaymentTransactionDTO> getTransactionStatus(@PathVariable String transactionCode) {
        PaymentTransactionDTO transactionDTO = paymentTransactionService.getTransactionStatusByCode(transactionCode);
        return ResponseEntity.ok(transactionDTO);
    }


    // API cập nhật trạng thái giao dịch (giả lập, bạn cần tích hợp API ngân hàng)
    @PutMapping("/update-status/{transactionId}")
    public ResponseEntity<Void> updateTransactionStatus(
            @PathVariable Integer transactionId,
            @RequestParam String status) {
        paymentTransactionService.updateTransactionStatus(transactionId, status);
        return ResponseEntity.ok().build();
    }



    @PostMapping("/webhook")
    public ResponseEntity<String> handlePaymentWebhook(@RequestBody PaymentWebhookRequest request) {
        System.out.println("Webhook received! ✅");
        System.out.println("Request: " + request);
        paymentTransactionService.handleWebhook(request);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/by-order/{orderId}")
    public ResponseEntity<List<PaymentTransactionDTO>> getTransactionsByOrderId(@PathVariable Integer orderId) {
        List<PaymentTransaction> transactions = jpa.findByOrderOrderId(orderId);
        List<PaymentTransactionDTO> transactionDTOs = transactions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(transactionDTOs);
    }



    private PaymentTransactionDTO convertToDTO(PaymentTransaction transaction) {
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
}