package com.wesley.school.repository;

import com.wesley.school.document.ExamMark;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamMarkRepository extends MongoRepository<ExamMark, String> {
    List<ExamMark> findByStudentId(String studentId);
    List<ExamMark> findByStudentIdAndTerm(String studentId, String term);
}
