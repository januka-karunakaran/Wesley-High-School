package com.wesley.school.controller;

import com.wesley.school.document.Student;
import com.wesley.school.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/students")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentService.fetchAllStudents());
    }

    @PostMapping
    public ResponseEntity<Student> createStudent(@Valid @RequestBody Student student) {
        Student savedStudent = studentService.saveStudent(student);
        return new ResponseEntity<>(savedStudent, HttpStatus.CREATED);
    }

    @GetMapping("/{studentId}")
    public ResponseEntity<Student> getStudentById(@PathVariable String studentId) {
        Optional<Student> student = studentService.findByStudentId(studentId);
        return student.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
