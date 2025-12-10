package com.bookmymovie.backend.controller;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    // You need to add these in application.properties
    @Value("${razorpay.key.id:rzp_test_YOUR_KEY_ID}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret:YOUR_KEY_SECRET}")
    private String razorpayKeySecret;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> data) {
        try {
            Integer amount = (Integer) data.get("amount"); // amount in rupees
            String currency = "INR";
            String receipt = "txn_" + System.currentTimeMillis();

            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amount * 100); // Razorpay accepts amount in paise (1 rupee = 100 paise)
            orderRequest.put("currency", currency);
            orderRequest.put("receipt", receipt);
            orderRequest.put("payment_capture", 1); // Auto capture payment

            Order order = razorpayClient.orders.create(orderRequest);

            Map<String, Object> response = new HashMap<>();
            response.put("orderId", order.get("id"));
            response.put("currency", order.get("currency"));
            response.put("amount", order.get("amount"));
            response.put("keyId", razorpayKeyId);

            return ResponseEntity.ok(response);

        } catch (RazorpayException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> data) {
        try {
            // In production, verify the payment signature here
            // For now, just return success
            Map<String, String> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Payment verified successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/key")
    public ResponseEntity<?> getKey() {
        Map<String, String> response = new HashMap<>();
        response.put("keyId", razorpayKeyId);
        return ResponseEntity.ok(response);
    }
}
