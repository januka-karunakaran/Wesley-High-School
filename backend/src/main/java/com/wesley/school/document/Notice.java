package com.wesley.school.document;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "notices")
public class Notice {

    @Id
    private String id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Date is required")
    private String date; // e.g. 2025-09-20

    @NotBlank(message = "Type is required")
    private String type; // "Notice" | "Event" | "Circular"

    private String category; // "Academic" | "Examinations" | "Sports" | "Admissions" | "Achievements"

    private String imageUrl;

    /** Public URL or path to an uploaded PDF circular */
    private String pdfUrl;

    /** Optional filename shown in the download link */
    private String pdfFileName;

    /** Flag for urgent / important notices */
    private boolean urgent;

    /** Who posted this (admin name/role) */
    private String postedBy;

    @CreatedDate
    private LocalDateTime createdAt;
}
