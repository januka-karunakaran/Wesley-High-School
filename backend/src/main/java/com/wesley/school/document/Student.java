package com.wesley.school.document;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "students")
public class Student {

    @Id
    private String id;

    @Indexed(unique = true)
    @NotBlank(message = "Student ID is required")
    private String studentId;

    @NotBlank(message = "Full name is required")
    private String fullName;

    private LocalDate dateOfBirth;

    private String gender;

    @NotBlank(message = "Grade/Class is required")
    private String gradeClass;

    private String address;

    @NotBlank(message = "Parent name is required")
    private String parentName;

    @NotBlank(message = "Parent contact is required")
    private String parentContact;

    private String photoUrl;
}
