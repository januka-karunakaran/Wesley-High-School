package com.wesley.school.controller;

import com.wesley.school.document.Notice;
import com.wesley.school.repository.NoticeRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * REST API for School Notice Board & Circulars
 * Base URL: /api/v1/notices
 *
 * Public endpoints  (no auth):  GET /api/v1/notices, GET /api/v1/notices/{id}
 * Admin endpoints   (POST/PUT/DELETE): /api/v1/notices/**
 */
@RestController
@RequestMapping("/api/v1/notices")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class NoticeController {

    private final NoticeRepository noticeRepository;

    // ── PUBLIC ────────────────────────────────────────────────────────────────

    /** Get all notices ordered by date descending */
    @GetMapping
    public ResponseEntity<List<Notice>> getAllNotices() {
        return ResponseEntity.ok(noticeRepository.findAllByOrderByDateDesc());
    }

    /** Get a single notice / circular by its MongoDB id */
    @GetMapping("/{id}")
    public ResponseEntity<Notice> getNoticeById(@PathVariable String id) {
        return noticeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /** Filter by type: Notice | Event | Circular */
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Notice>> getByType(@PathVariable String type) {
        return ResponseEntity.ok(noticeRepository.findByTypeIgnoreCase(type));
    }

    /** Filter by category: Academic | Examinations | Sports | Admissions */
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Notice>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(noticeRepository.findByCategoryIgnoreCase(category));
    }

    /** Fetch only urgent / important notices */
    @GetMapping("/urgent")
    public ResponseEntity<List<Notice>> getUrgentNotices() {
        return ResponseEntity.ok(noticeRepository.findByUrgentTrue());
    }

    // ── ADMIN ─────────────────────────────────────────────────────────────────

    /** Create a new notice / circular (admin only) */
    @PostMapping
    public ResponseEntity<Notice> createNotice(@Valid @RequestBody Notice notice) {
        Notice saved = noticeRepository.save(notice);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    /** Update an existing notice (admin only) */
    @PutMapping("/{id}")
    public ResponseEntity<Notice> updateNotice(
            @PathVariable String id,
            @Valid @RequestBody Notice updated) {
        Optional<Notice> existing = noticeRepository.findById(id);
        if (existing.isEmpty()) return ResponseEntity.notFound().build();

        updated.setId(id);
        return ResponseEntity.ok(noticeRepository.save(updated));
    }

    /** Delete a notice (admin only) */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotice(@PathVariable String id) {
        if (!noticeRepository.existsById(id)) return ResponseEntity.notFound().build();
        noticeRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
