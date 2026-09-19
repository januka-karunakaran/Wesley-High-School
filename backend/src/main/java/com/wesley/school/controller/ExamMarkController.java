package com.wesley.school.controller;

import com.wesley.school.document.ExamMark;
import com.wesley.school.service.ExamMarkService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/marks")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ExamMarkController {

    private final ExamMarkService examMarkService;

    @PostMapping
    public ResponseEntity<List<ExamMark>> submitMarks(@Valid @RequestBody List<ExamMark> marks) {
        return new ResponseEntity<>(examMarkService.saveAllExamMarks(marks), HttpStatus.CREATED);
    }

    @PostMapping("/single")
    public ResponseEntity<ExamMark> submitSingleMark(@Valid @RequestBody ExamMark mark) {
        return new ResponseEntity<>(examMarkService.saveExamMark(mark), HttpStatus.CREATED);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<ExamMark>> getMarksByStudent(
            @PathVariable String studentId,
            @RequestParam(required = false) String term) {
        if (term != null && !term.isBlank()) {
            return ResponseEntity.ok(examMarkService.getMarksByStudentIdAndTerm(studentId, term));
        }
        return ResponseEntity.ok(examMarkService.getMarksByStudentId(studentId));
    }
}
