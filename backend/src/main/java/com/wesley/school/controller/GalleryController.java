package com.wesley.school.controller;

import com.wesley.school.document.GalleryItem;
import com.wesley.school.repository.GalleryRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * REST API for School Gallery & Events Hub
 * Base URL: /api/v1/gallery
 *
 * GET /api/v1/gallery                   - all items (newest first)
 * GET /api/v1/gallery/{id}              - single item
 * GET /api/v1/gallery/category/{cat}    - filter by category/album
 * GET /api/v1/gallery/type/{type}       - filter by "photo" | "video"
 * GET /api/v1/gallery/year/{year}       - filter by academic year
 * POST /api/v1/gallery                  - admin: add new item
 * PUT  /api/v1/gallery/{id}             - admin: update item
 * DELETE /api/v1/gallery/{id}           - admin: remove item
 */
@RestController
@RequestMapping("/api/v1/gallery")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class GalleryController {

    private final GalleryRepository galleryRepository;

    @GetMapping
    public ResponseEntity<List<GalleryItem>> getAllItems() {
        return ResponseEntity.ok(galleryRepository.findAllByOrderByUploadedAtDesc());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GalleryItem> getItemById(@PathVariable String id) {
        return galleryRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<GalleryItem>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(galleryRepository.findByCategoryIgnoreCase(category));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<GalleryItem>> getByMediaType(@PathVariable String type) {
        return ResponseEntity.ok(galleryRepository.findByMediaTypeIgnoreCase(type));
    }

    @GetMapping("/year/{year}")
    public ResponseEntity<List<GalleryItem>> getByYear(@PathVariable String year) {
        return ResponseEntity.ok(galleryRepository.findByAcademicYear(year));
    }

    @PostMapping
    public ResponseEntity<GalleryItem> addItem(@Valid @RequestBody GalleryItem item) {
        return new ResponseEntity<>(galleryRepository.save(item), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GalleryItem> updateItem(
            @PathVariable String id,
            @Valid @RequestBody GalleryItem updated) {
        Optional<GalleryItem> existing = galleryRepository.findById(id);
        if (existing.isEmpty()) return ResponseEntity.notFound().build();
        updated.setId(id);
        return ResponseEntity.ok(galleryRepository.save(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable String id) {
        if (!galleryRepository.existsById(id)) return ResponseEntity.notFound().build();
        galleryRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
