package com.wesley.school.document;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * Tracks fee payment status per student per term/year.
 * Used by: GET /api/v1/fees/{studentId}  |  PUT /api/v1/fees/{id}  (admin)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "fee_records")
public class FeeRecord {

    @Id
    private String id;

    @NotBlank(message = "Student ID is required")
    @Indexed
    private String studentId;

    @NotBlank(message = "Student name is required")
    private String studentName;

    @NotBlank(message = "Grade/Class is required")
    private String gradeClass;

    /** "Term 1", "Term 2", "Term 3", or "Annual" */
    @NotBlank(message = "Term is required")
    private String term;

    @NotBlank(message = "Academic year is required")
    private String academicYear;

    @NotNull(message = "Total fee amount is required")
    @Min(value = 0)
    private Double totalAmount;

    @NotNull(message = "Paid amount is required")
    @Min(value = 0)
    private Double paidAmount;

    /** Computed or stored: totalAmount - paidAmount */
    private Double dueAmount;

    /**
     * "PAID"     - fully settled
     * "PARTIAL"  - partially paid
     * "PENDING"  - not yet paid
     * "OVERDUE"  - past due date, unpaid
     */
    private String paymentStatus;

    /** ISO date of the last payment made */
    private String lastPaymentDate;

    /** Optional remarks by admin */
    private String remarks;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
