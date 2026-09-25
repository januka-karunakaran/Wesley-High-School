package com.wesley.school.document;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * Class Timetable Entry document representing scheduled periods
 * for each class / grade and assigned teachers at Wesley High School.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "timetables")
@CompoundIndexes({
    @CompoundIndex(name = "grade_day_period_idx", def = "{'gradeClass': 1, 'dayOfWeek': 1, 'period': 1}"),
    @CompoundIndex(name = "teacher_day_period_idx", def = "{'teacherName': 1, 'dayOfWeek': 1, 'period': 1}")
})
public class TimetableEntry {

    @Id
    private String id;

    /** E.g., "10-A", "11-B", "6-A", "12-Maths" */
    @NotBlank(message = "Grade and Class is required")
    @Indexed
    private String gradeClass;

    /** E.g., "Grade 10", "Grade 11" */
    private String grade;

    /** E.g., "Monday", "Tuesday", "Wednesday", "Thursday", "Friday" */
    @NotBlank(message = "Day of week is required")
    @Indexed
    private String dayOfWeek;

    /** Period index: 1 through 8 */
    @NotNull(message = "Period number is required")
    @Min(value = 1, message = "Period must be at least 1")
    @Max(value = 8, message = "Period cannot exceed 8")
    private Integer period;

    /** E.g., "07:50 AM" */
    private String startTime;

    /** E.g., "08:35 AM" */
    private String endTime;

    /** E.g., "Mathematics", "Science", "English Literature", "Tamil Language" */
    @NotBlank(message = "Subject name is required")
    private String subject;

    /** E.g., "Mr. K. Selvaratnam", "Mrs. R. Pathmanathan" */
    @NotBlank(message = "Teacher name is required")
    @Indexed
    private String teacherName;

    /** Optional teacher employee / ID code */
    private String teacherId;

    /** E.g., "Hall 14", "Science Lab B", "ICT Lab 1" */
    private String roomNumber;

    /** E.g., "2025/2026" */
    @Builder.Default
    private String academicYear = "2025/2026";

    @CreatedDate
    private LocalDateTime createdAt;
}
