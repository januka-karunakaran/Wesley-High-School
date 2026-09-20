package com.wesley.school.document;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Extended Teacher document supporting public Staff Directory profile.
 * Extends Teacher with department, designation, bio, and join year.
 * Note: The existing Teacher.java collection ("teachers") is reused.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "teachers")
public class Teacher {

    @Id
    private String id;

    @org.springframework.data.mongodb.core.index.Indexed(unique = true)
    @NotBlank(message = "Teacher ID is required")
    private String teacherId;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @jakarta.validation.constraints.Email(message = "Invalid email format")
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

    // ── Extended fields for Staff Directory ──────────────────────────────────

    /** E.g. "Science & Mathematics", "Languages", "Social Studies", "Administration" */
    private String department;

    /** E.g. "Head of Department", "Senior Teacher", "Class Teacher", "Lab In-charge" */
    private String designation;

    /** Short biography shown on the staff directory card */
    private String bio;

    /** Year the teacher joined Wesley High School */
    private Integer joinYear;
}
