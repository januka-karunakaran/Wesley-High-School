package com.wesley.school.document;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * Event Registration (RSVP) Document for public events, sports meets,
 * founders day memorial, prize giving, and alumni reunions.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "event_registrations")
public class EventRegistration {

    @Id
    private String id;

    @Indexed(unique = true)
    private String registrationNumber; // e.g. WHS-EVT-78291

    @NotBlank(message = "Event name is required")
    @Indexed
    private String eventName;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    @Indexed
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phone;

    /** "Parent", "Alumni", "Student", "Staff", "Special Guest" */
    @NotBlank(message = "Attendee type is required")
    private String attendeeType;

    /** For Alumni: e.g. "2015" or "Class of 2008" */
    private String batchYear;

    /** Total number of people attending under this registration */
    @Min(value = 1, message = "At least 1 attendee is required")
    @Builder.Default
    private int numberOfGuests = 1;

    /** "Standard" | "Vegetarian" | "None" */
    private String dietaryPreference;

    private String specialNotes;

    /** "CONFIRMED" | "PENDING" | "CANCELLED" */
    @Builder.Default
    private String status = "CONFIRMED";

    @CreatedDate
    private LocalDateTime registeredAt;
}
