package com.wesley.school.repository;

import com.wesley.school.document.GalleryItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GalleryRepository extends MongoRepository<GalleryItem, String> {

    /** Get all items in a specific category/album */
    List<GalleryItem> findByCategoryIgnoreCase(String category);

    /** Filter by media type: "photo" or "video" */
    List<GalleryItem> findByMediaTypeIgnoreCase(String mediaType);

    /** Get all items for a specific academic year */
    List<GalleryItem> findByAcademicYear(String academicYear);

    /** Get all items ordered by upload date (newest first) */
    List<GalleryItem> findAllByOrderByUploadedAtDesc();
}
