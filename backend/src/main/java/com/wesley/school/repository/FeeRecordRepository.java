package com.wesley.school.repository;

import com.wesley.school.document.FeeRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeeRecordRepository extends MongoRepository<FeeRecord, String> {

    /** Get all fee records for a specific student */
    List<FeeRecord> findByStudentId(String studentId);

    /** Filter by payment status: "PAID", "PARTIAL", "PENDING", "OVERDUE" */
    List<FeeRecord> findByPaymentStatus(String paymentStatus);

    /** Get fee records for a student in a specific academic year */
    List<FeeRecord> findByStudentIdAndAcademicYear(String studentId, String academicYear);

    /** Get all overdue / pending records for a class */
    List<FeeRecord> findByGradeClassAndPaymentStatus(String gradeClass, String paymentStatus);

    /** All records for a given academic year ordered by status */
    List<FeeRecord> findByAcademicYearOrderByPaymentStatusAsc(String academicYear);
}
