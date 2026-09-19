package com.wesley.school.document;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "exam_marks")
public class ExamMark {

    @Id
    private String id;

    @NotBlank(message = "Student ID is required")
    private String studentId;

    @NotBlank(message = "Term is required")
    private String term;

    @NotBlank(message = "Subject name is required")
    private String subjectName;

    @NotNull(message = "Marks obtained cannot be null")
    @Min(value = 0, message = "Marks cannot be negative")
    private Double marksObtained;

    @NotNull(message = "Maximum marks cannot be null")
    @Min(value = 1, message = "Maximum marks must be greater than zero")
    private Double maxMarks;
}
