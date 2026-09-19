package com.wesley.school.controller;

import com.wesley.school.document.Notice;
import com.wesley.school.repository.NoticeRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notices")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class NoticeController {
    
    private final NoticeRepository noticeRepository;

    @GetMapping
    public ResponseEntity<List<Notice>> getAllNotices() {
        return ResponseEntity.ok(noticeRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Notice> createNotice(@Valid @RequestBody Notice notice) {
        return new ResponseEntity<>(noticeRepository.save(notice), HttpStatus.CREATED);
    }
}
