package com.wesley.school.service;

import com.wesley.school.document.ExamMark;
import com.wesley.school.repository.ExamMarkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExamMarkService {

    private final ExamMarkRepository examMarkRepository;

    public ExamMark saveExamMark(ExamMark examMark) {
        return examMarkRepository.save(examMark);
    }

    public List<ExamMark> saveAllExamMarks(List<ExamMark> examMarks) {
        return examMarkRepository.saveAll(examMarks);
    }

    public List<ExamMark> getMarksByStudentId(String studentId) {
        return examMarkRepository.findByStudentId(studentId);
    }

    public List<ExamMark> getMarksByStudentIdAndTerm(String studentId, String term) {
        return examMarkRepository.findByStudentIdAndTerm(studentId, term);
    }
}
