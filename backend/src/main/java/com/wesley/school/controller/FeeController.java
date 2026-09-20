package com.wesley.school.controller;

import com.wesley.school.document.FeeRecord;
import com.wesley.school.repository.FeeRecordRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Fee & Payment Tracking REST API
 *
 * GET    /api/v1/fees                              - all records (admin)
 * GET    /api/v1/fees/{studentId}                  - records for student
 * GET    /api/v1/fees/status/{status}              - filter by payment status
 * GET    /api/v1/fees/year/{year}                  - all records for year
 * POST   /api/v1/fees                              - create fee record (admin)
 * PUT    /api/v1/fees/{id}                         - update payment (admin)
 * DELETE /api/v1/fees/{id}                         - remove record (admin)
 */
@RestController
@RequestMapping("/api/v1/fees")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class FeeController {

    private final FeeRecordRepository feeRecordRepository;

    /** List all fee records (admin management table) */
    @GetMapping
    public ResponseEntity<List<FeeRecord>> getAllFees() {
        return ResponseEntity.ok(feeRecordRepository.findAll());
    }

    /** Get all fee records for a specific student */
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<FeeRecord>> getFeesByStudent(@PathVariable String studentId) {
        return ResponseEntity.ok(feeRecordRepository.findByStudentId(studentId));
    }

    /** Filter fee records by payment status */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<FeeRecord>> getFeesByStatus(@PathVariable String status) {
        return ResponseEntity.ok(feeRecordRepository.findByPaymentStatus(status.toUpperCase()));
    }

    /** Get all fees for a given academic year */
    @GetMapping("/year/{year}")
    public ResponseEntity<List<FeeRecord>> getFeesByYear(@PathVariable String year) {
        return ResponseEntity.ok(feeRecordRepository.findByAcademicYearOrderByPaymentStatusAsc(year));
    }

    /** Create a new fee record (admin) */
    @PostMapping
    public ResponseEntity<FeeRecord> createFeeRecord(@Valid @RequestBody FeeRecord record) {
        // Auto-compute due amount before saving
        if (record.getTotalAmount() != null && record.getPaidAmount() != null) {
            double due = record.getTotalAmount() - record.getPaidAmount();
            record.setDueAmount(Math.max(due, 0.0));
            if (due <= 0) record.setPaymentStatus("PAID");
            else if (record.getPaidAmount() > 0) record.setPaymentStatus("PARTIAL");
            else record.setPaymentStatus("PENDING");
        }
        return new ResponseEntity<>(feeRecordRepository.save(record), HttpStatus.CREATED);
    }

    /** Update an existing fee record — e.g. mark as PAID (admin) */
    @PutMapping("/{id}")
    public ResponseEntity<FeeRecord> updateFeeRecord(
            @PathVariable String id,
            @Valid @RequestBody FeeRecord updated) {
        Optional<FeeRecord> existing = feeRecordRepository.findById(id);
        if (existing.isEmpty()) return ResponseEntity.notFound().build();

        // Recompute due amount and status
        if (updated.getTotalAmount() != null && updated.getPaidAmount() != null) {
            double due = updated.getTotalAmount() - updated.getPaidAmount();
            updated.setDueAmount(Math.max(due, 0.0));
            if (due <= 0) updated.setPaymentStatus("PAID");
            else if (updated.getPaidAmount() > 0) updated.setPaymentStatus("PARTIAL");
            else updated.setPaymentStatus("PENDING");
        }

        updated.setId(id);
        return ResponseEntity.ok(feeRecordRepository.save(updated));
    }

    /** Delete a fee record (admin) */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeeRecord(@PathVariable String id) {
        if (!feeRecordRepository.existsById(id)) return ResponseEntity.notFound().build();
        feeRecordRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
