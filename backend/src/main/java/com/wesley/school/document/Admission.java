package com.wesley.school.document;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "admissions")
public class Admission {
    
    @Id
    private String id;
    
    @NotBlank(message = "Student name is required")
    private String studentName;
    
    @NotBlank(message = "Date of birth is required")
    private String dateOfBirth; // YYYY-MM-DD
    
    @NotBlank(message = "Grade applying for is required")
    private String gradeApplyingFor;
    
    @NotBlank(message = "Parent contact is required")
    private String parentContact;
    
    @NotBlank(message = "Address is required")
    private String address;
    
    private String status; // PENDING, APPROVED, REJECTED
}
