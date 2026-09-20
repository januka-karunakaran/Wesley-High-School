package com.wesley.school.controller;

import com.wesley.school.document.Attendance;
import com.wesley.school.document.ExamMark;
import com.wesley.school.document.FeeRecord;
import com.wesley.school.document.Student;
import com.wesley.school.repository.AttendanceRepository;
import com.wesley.school.repository.ExamMarkRepository;
import com.wesley.school.repository.FeeRecordRepository;
import com.wesley.school.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Student Self-Service Portal API
 *
 * GET /api/v1/portal/{studentId}           - full student profile
 * GET /api/v1/portal/{studentId}/results   - exam results (all terms)
 * GET /api/v1/portal/{studentId}/attendance - attendance percentage
 * GET /api/v1/portal/{studentId}/fees       - fee payment status
 * GET /api/v1/portal/{studentId}/summary    - combined dashboard data
 */
@RestController
@RequestMapping("/api/v1/portal")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class StudentPortalController {

    private final StudentRepository       studentRepository;
    private final AttendanceRepository    attendanceRepository;
    private final ExamMarkRepository      examMarkRepository;
    private final FeeRecordRepository     feeRecordRepository;

    /** Verify a student exists and return their profile */
    @GetMapping("/{studentId}")
    public ResponseEntity<Student> getProfile(@PathVariable String studentId) {
        return studentRepository.findByStudentId(studentId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /** Return all exam marks for the student */
    @GetMapping("/{studentId}/results")
    public ResponseEntity<List<ExamMark>> getResults(@PathVariable String studentId) {
        return ResponseEntity.ok(examMarkRepository.findByStudentId(studentId));
    }

    /** Compute attendance percentage for the student */
    @GetMapping("/{studentId}/attendance")
    public ResponseEntity<Map<String, Object>> getAttendance(@PathVariable String studentId) {
        List<Attendance> records = attendanceRepository.findByStudentId(studentId);

        long total   = records.size();
        long present = records.stream()
                .filter(a -> "Present".equalsIgnoreCase(a.getStatus()))
                .count();
        double percentage = total == 0 ? 0.0 : Math.round((present * 100.0 / total) * 100.0) / 100.0;

        Map<String, Object> result = new HashMap<>();
        result.put("studentId",  studentId);
        result.put("totalDays",  total);
        result.put("presentDays", present);
        result.put("absentDays", total - present);
        result.put("attendancePercentage", percentage);
        result.put("records", records);

        return ResponseEntity.ok(result);
    }

    /** Return all fee records for the student */
    @GetMapping("/{studentId}/fees")
    public ResponseEntity<List<FeeRecord>> getFees(@PathVariable String studentId) {
        return ResponseEntity.ok(feeRecordRepository.findByStudentId(studentId));
    }

    /**
     * Aggregated summary for the student dashboard:
     * profile + attendance % + latest term marks + fee status
     */
    @GetMapping("/{studentId}/summary")
    public ResponseEntity<Map<String, Object>> getSummary(@PathVariable String studentId) {
        Optional<Student> studentOpt = studentRepository.findByStudentId(studentId);
        if (studentOpt.isEmpty()) return ResponseEntity.notFound().build();

        Student student = studentOpt.get();

        // Attendance
        List<Attendance> attendanceRecords = attendanceRepository.findByStudentId(studentId);
        long total   = attendanceRecords.size();
        long present = attendanceRecords.stream()
                .filter(a -> "Present".equalsIgnoreCase(a.getStatus()))
                .count();
        double attendancePct = total == 0 ? 0.0 : Math.round((present * 100.0 / total) * 100.0) / 100.0;

        // Exam Results
        List<ExamMark> marks = examMarkRepository.findByStudentId(studentId);

        // Fees
        List<FeeRecord> fees = feeRecordRepository.findByStudentId(studentId);

        Map<String, Object> summary = new HashMap<>();
        summary.put("student", student);
        summary.put("attendancePercentage", attendancePct);
        summary.put("totalAttendanceDays", total);
        summary.put("presentDays", present);
        summary.put("examResults", marks);
        summary.put("feeRecords", fees);

        return ResponseEntity.ok(summary);
    }
}
