package com.wesley.school.controller;

import com.wesley.school.document.EventRegistration;
import com.wesley.school.repository.EventRegistrationRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

/**
 * REST API for School Event Registrations & Public RSVPs
 * Base URL: /api/v1/events/registrations & /api/v1/events/rsvp
 */
@RestController
@RequestMapping("/api/v1/events")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class EventRegistrationController {

    private final EventRegistrationRepository registrationRepository;

    /**
     * Public RSVP submission endpoint
     */
    @PostMapping("/rsvp")
    public ResponseEntity<Map<String, Object>> submitRsvp(@Valid @RequestBody EventRegistration registration) {
        // Generate unique registration code: WHS-EVT-XXXXX
        int randomCode = 10000 + new Random().nextInt(90000);
        String regNo = "WHS-EVT-" + randomCode;
        registration.setRegistrationNumber(regNo);

        if (registration.getRegisteredAt() == null) {
            registration.setRegisteredAt(LocalDateTime.now());
        }
        if (registration.getStatus() == null || registration.getStatus().isBlank()) {
            registration.setStatus("CONFIRMED");
        }

        EventRegistration saved = registrationRepository.save(registration);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "RSVP registered successfully! We look forward to welcoming you to Wesley High School.");
        response.put("registrationNumber", saved.getRegistrationNumber());
        response.put("data", saved);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Get all registrations (ordered by registeredAt descending)
     */
    @GetMapping("/registrations")
    public ResponseEntity<List<EventRegistration>> getAllRegistrations(
            @RequestParam(required = false) String eventName
    ) {
        if (eventName != null && !eventName.isBlank()) {
            return ResponseEntity.ok(registrationRepository.findByEventNameIgnoreCase(eventName));
        }
        return ResponseEntity.ok(registrationRepository.findAllByOrderByRegisteredAtDesc());
    }

    /**
     * Get registration by MongoDB ID
     */
    @GetMapping("/registrations/{id}")
    public ResponseEntity<EventRegistration> getById(@PathVariable String id) {
        return registrationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Verify ticket / registration pass by Registration Number
     */
    @GetMapping("/registrations/verify/{regNo}")
    public ResponseEntity<Map<String, Object>> verifyPass(@PathVariable String regNo) {
        Optional<EventRegistration> opt = registrationRepository.findByRegistrationNumber(regNo);
        Map<String, Object> resp = new HashMap<>();
        if (opt.isPresent()) {
            resp.put("verified", true);
            resp.put("registration", opt.get());
            resp.put("message", "Valid registration found for " + opt.get().getFullName());
            return ResponseEntity.ok(resp);
        } else {
            resp.put("verified", false);
            resp.put("message", "No registration found with pass number " + regNo);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(resp);
        }
    }

    /**
     * Event registration counts and statistics
     */
    @GetMapping("/registrations/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        List<EventRegistration> all = registrationRepository.findAll();
        Map<String, Long> countByEvent = new HashMap<>();
        Map<String, Long> countByType = new HashMap<>();

        for (EventRegistration r : all) {
            countByEvent.put(r.getEventName(), countByEvent.getOrDefault(r.getEventName(), 0L) + r.getNumberOfGuests());
            countByType.put(r.getAttendeeType(), countByType.getOrDefault(r.getAttendeeType(), 0L) + 1);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("totalRegistrations", all.size());
        result.put("attendeesByEvent", countByEvent);
        result.put("attendeesByType", countByType);

        return ResponseEntity.ok(result);
    }

    /**
     * Cancel or delete a registration
     */
    @DeleteMapping("/registrations/{id}")
    public ResponseEntity<Map<String, String>> deleteRegistration(@PathVariable String id) {
        if (!registrationRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        registrationRepository.deleteById(id);
        Map<String, String> resp = new HashMap<>();
        resp.put("message", "Registration cancelled successfully");
        return ResponseEntity.ok(resp);
    }
}
