package com.wesley.school.controller;

import com.wesley.school.repository.StudentRepository;
import com.wesley.school.repository.TeacherRepository;
import com.wesley.school.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/dashboard")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class DashboardController {
    
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final AttendanceRepository attendanceRepository;
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStudents", studentRepository.count());
        stats.put("totalTeachers", teacherRepository.count());
        stats.put("totalAttendanceRecords", attendanceRepository.count());
        return ResponseEntity.ok(stats);
    }
}
