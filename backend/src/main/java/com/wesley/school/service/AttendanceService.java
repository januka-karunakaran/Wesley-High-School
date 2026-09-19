package com.wesley.school.service;

import com.wesley.school.document.Attendance;
import com.wesley.school.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;

    public List<Attendance> markAttendance(List<Attendance> attendanceRecords) {
        return attendanceRepository.saveAll(attendanceRecords);
    }

    public List<Attendance> getAttendanceByStudentId(String studentId) {
        return attendanceRepository.findByStudentId(studentId);
    }

    public List<Attendance> getAttendanceByGradeClass(String gradeClass) {
        return attendanceRepository.findByGradeClass(gradeClass);
    }
    
    public List<Attendance> getAttendanceByGradeClassAndDate(String gradeClass, String date) {
        return attendanceRepository.findByGradeClassAndDate(gradeClass, date);
    }
}
