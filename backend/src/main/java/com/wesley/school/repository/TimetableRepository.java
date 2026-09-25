package com.wesley.school.repository;

import com.wesley.school.document.TimetableEntry;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimetableRepository extends MongoRepository<TimetableEntry, String> {

    List<TimetableEntry> findByGradeClass(String gradeClass);

    List<TimetableEntry> findByGrade(String grade);

    List<TimetableEntry> findByTeacherNameIgnoreCase(String teacherName);

    List<TimetableEntry> findByTeacherId(String teacherId);

    List<TimetableEntry> findByDayOfWeekIgnoreCase(String dayOfWeek);

    List<TimetableEntry> findByGradeClassAndDayOfWeekIgnoreCase(String gradeClass, String dayOfWeek);

    List<TimetableEntry> findByGradeClassOrderByPeriodAsc(String gradeClass);

    List<TimetableEntry> findByTeacherNameIgnoreCaseOrderByPeriodAsc(String teacherName);

    void deleteByGradeClass(String gradeClass);
}
