package com.wesley.school.repository;

import com.wesley.school.document.Notice;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoticeRepository extends MongoRepository<Notice, String> {

    /** Fetch all notices of a specific type: "Notice", "Event", "Circular" */
    List<Notice> findByTypeIgnoreCase(String type);

    /** Fetch notices by category */
    List<Notice> findByCategoryIgnoreCase(String category);

    /** Fetch all urgent notices */
    List<Notice> findByUrgentTrue();

    /** Fetch notices ordered by date descending (most recent first) */
    List<Notice> findAllByOrderByDateDesc();
}
