package com.wesley.school.controller;

import com.wesley.school.document.Admission;
import com.wesley.school.repository.AdmissionRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admissions")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AdmissionController {
    
    private final AdmissionRepository admissionRepository;

    @GetMapping
    public ResponseEntity<List<Admission>> getAllAdmissions() {
        return ResponseEntity.ok(admissionRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Admission> submitAdmissionForm(@Valid @RequestBody Admission admission) {
        if (admission.getStatus() == null || admission.getStatus().isBlank()) {
            admission.setStatus("PENDING");
        }
        return new ResponseEntity<>(admissionRepository.save(admission), HttpStatus.CREATED);
    }
}
