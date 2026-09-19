package com.wesley.school.controller;

import com.wesley.school.document.Attendance;
import com.wesley.school.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/attendance")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping
    public ResponseEntity<List<Attendance>> markAttendance(@RequestBody List<Attendance> records) {
        return new ResponseEntity<>(attendanceService.markAttendance(records), HttpStatus.CREATED);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Attendance>> getByStudent(@PathVariable String studentId) {
        return ResponseEntity.ok(attendanceService.getAttendanceByStudentId(studentId));
    }

    @GetMapping("/class/{gradeClass}")
    public ResponseEntity<List<Attendance>> getByGradeClass(
            @PathVariable String gradeClass,
            @RequestParam(required = false) String date) {
        if (date != null) {
            return ResponseEntity.ok(attendanceService.getAttendanceByGradeClassAndDate(gradeClass, date));
        }
        return ResponseEntity.ok(attendanceService.getAttendanceByGradeClass(gradeClass));
    }
}
