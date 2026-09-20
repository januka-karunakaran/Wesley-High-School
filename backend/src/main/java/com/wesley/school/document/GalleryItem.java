package com.wesley.school.document;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * Represents a single media item (photo or video) in the school gallery.
 * Used by: GET /api/v1/gallery  |  POST /api/v1/gallery (admin)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "gallery")
public class GalleryItem {

    @Id
    private String id;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    /**
     * Category / album: "Sports Meet", "Prize Giving", "Wesley Day",
     * "Science Fair", "Cultural Night", "Other"
     */
    @NotBlank(message = "Category is required")
    private String category;

    /** "photo" or "video" */
    @NotBlank(message = "Media type is required")
    private String mediaType;

    /** URL of the full-resolution image or the video link (YouTube/direct) */
    @NotBlank(message = "Media URL is required")
    private String mediaUrl;

    /** Thumbnail / preview URL for the grid */
    private String thumbnailUrl;

    /** Academic year the event took place, e.g. "2025" */
    private String academicYear;

    /** Date of the event in ISO format: "2025-09-15" */
    private String eventDate;

    @CreatedDate
    private LocalDateTime uploadedAt;
}
