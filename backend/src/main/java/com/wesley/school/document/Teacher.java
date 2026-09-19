package com.wesley.school.document;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "teachers")
public class Teacher {

    @Id
    private String id;

    @Indexed(unique = true)
    @NotBlank(message = "Teacher ID is required")
    private String teacherId;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "Subject specialization is required")
    private String subjectSpecialization;

    @NotBlank(message = "Qualification is required")
    private String qualification;

    private String photoUrl;

    private String academicYear;

    private String status; // "ACTIVE", "RETIRED", "ARCHIVED"
}
