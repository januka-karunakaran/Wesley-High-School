package com.wesley.school.controller;

import com.wesley.school.document.TimetableEntry;
import com.wesley.school.repository.TimetableRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

/**
 * REST API for Wesley High School Timetable Management
 * Base URL: /api/v1/timetables
 */
@RestController
@RequestMapping("/api/v1/timetables")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class TimetableController {

    private final TimetableRepository timetableRepository;

    /**
     * Get timetable entries with optional filtering by gradeClass, dayOfWeek, or teacherName.
     */
    @GetMapping
    public ResponseEntity<List<TimetableEntry>> getTimetables(
            @RequestParam(required = false) String gradeClass,
            @RequestParam(required = false) String dayOfWeek,
            @RequestParam(required = false) String teacherName
    ) {
        if (gradeClass != null && dayOfWeek != null) {
            return ResponseEntity.ok(timetableRepository.findByGradeClassAndDayOfWeekIgnoreCase(gradeClass, dayOfWeek));
        } else if (gradeClass != null) {
            return ResponseEntity.ok(timetableRepository.findByGradeClass(gradeClass));
        } else if (teacherName != null) {
            return ResponseEntity.ok(timetableRepository.findByTeacherNameIgnoreCase(teacherName));
        } else if (dayOfWeek != null) {
            return ResponseEntity.ok(timetableRepository.findByDayOfWeekIgnoreCase(dayOfWeek));
        }
        return ResponseEntity.ok(timetableRepository.findAll());
    }

    /**
     * Get a single entry by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<TimetableEntry> getById(@PathVariable String id) {
        return timetableRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Get all timetable entries for a specific class (e.g., "10-A")
     */
    @GetMapping("/class/{gradeClass}")
    public ResponseEntity<List<TimetableEntry>> getByClass(@PathVariable String gradeClass) {
        List<TimetableEntry> entries = timetableRepository.findByGradeClassOrderByPeriodAsc(gradeClass);
        return ResponseEntity.ok(entries);
    }

    /**
     * Get all timetable entries for a specific teacher
     */
    @GetMapping("/teacher/{teacherName}")
    public ResponseEntity<List<TimetableEntry>> getByTeacher(@PathVariable String teacherName) {
        List<TimetableEntry> entries = timetableRepository.findByTeacherNameIgnoreCaseOrderByPeriodAsc(teacherName);
        return ResponseEntity.ok(entries);
    }

    /**
     * Create a single timetable entry
     */
    @PostMapping
    public ResponseEntity<TimetableEntry> createEntry(@Valid @RequestBody TimetableEntry entry) {
        if (entry.getCreatedAt() == null) {
            entry.setCreatedAt(LocalDateTime.now());
        }
        TimetableEntry saved = timetableRepository.save(entry);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    /**
     * Bulk create timetable entries (ideal for class schedule setup)
     */
    @PostMapping("/bulk")
    public ResponseEntity<List<TimetableEntry>> createBulk(@Valid @RequestBody List<TimetableEntry> entries) {
        LocalDateTime now = LocalDateTime.now();
        entries.forEach(e -> {
            if (e.getCreatedAt() == null) e.setCreatedAt(now);
        });
        List<TimetableEntry> saved = timetableRepository.saveAll(entries);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    /**
     * Update an existing timetable entry
     */
    @PutMapping("/{id}")
    public ResponseEntity<TimetableEntry> updateEntry(@PathVariable String id, @Valid @RequestBody TimetableEntry updated) {
        Optional<TimetableEntry> existingOpt = timetableRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        TimetableEntry existing = existingOpt.get();
        existing.setGradeClass(updated.getGradeClass());
        existing.setGrade(updated.getGrade());
        existing.setDayOfWeek(updated.getDayOfWeek());
        existing.setPeriod(updated.getPeriod());
        existing.setStartTime(updated.getStartTime());
        existing.setEndTime(updated.getEndTime());
        existing.setSubject(updated.getSubject());
        existing.setTeacherName(updated.getTeacherName());
        existing.setTeacherId(updated.getTeacherId());
        existing.setRoomNumber(updated.getRoomNumber());
        existing.setAcademicYear(updated.getAcademicYear());

        TimetableEntry saved = timetableRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    /**
     * Delete a single entry
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteEntry(@PathVariable String id) {
        if (!timetableRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        timetableRepository.deleteById(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Timetable entry deleted successfully");
        response.put("id", id);
        return ResponseEntity.ok(response);
    }

    /**
     * Clear all entries for a specific class
     */
    @DeleteMapping("/class/{gradeClass}")
    public ResponseEntity<Map<String, String>> clearClassTimetable(@PathVariable String gradeClass) {
        timetableRepository.deleteByGradeClass(gradeClass);
        Map<String, String> response = new HashMap<>();
        response.put("message", "All timetable entries cleared for class " + gradeClass);
        return ResponseEntity.ok(response);
    }

    /**
     * Seed initial timetable data if empty
     */
    @PostMapping("/seed")
    public ResponseEntity<Map<String, Object>> seedTimetable() {
        if (timetableRepository.count() > 0) {
            Map<String, Object> resp = new HashMap<>();
            resp.put("message", "Timetable collection already contains data");
            resp.put("count", timetableRepository.count());
            return ResponseEntity.ok(resp);
        }

        List<TimetableEntry> sample = new ArrayList<>();
        String[] days = {"Monday", "Tuesday", "Wednesday", "Thursday", "Friday"};
        String[][] periodSlots = {
            {"1", "07:50 AM", "08:35 AM"},
            {"2", "08:35 AM", "09:20 AM"},
            {"3", "09:20 AM", "10:05 AM"},
            {"4", "10:05 AM", "10:50 AM"},
            {"5", "11:10 AM", "11:50 AM"},
            {"6", "11:50 AM", "12:30 PM"},
            {"7", "12:30 PM", "01:10 PM"},
            {"8", "01:10 PM", "01:50 PM"}
        };

        String[] subjects10A = {
            "Mathematics", "Science", "English Language", "Tamil Language",
            "History", "Information & Communication Tech", "Commerce", "Christianity / Religion"
        };
        String[] teachers10A = {
            "Mr. K. Selvaratnam", "Mrs. R. Pathmanathan", "Miss M. Fernando", "Mr. S. Thavabalasingam",
            "Mrs. N. Gunasekara", "Mr. A. Razik", "Mrs. T. Jeyarajah", "Rev. Fr. D. Emmanuel"
        };

        for (int d = 0; d < days.length; d++) {
            String day = days[d];
            for (int p = 0; p < periodSlots.length; p++) {
                int subjectIdx = (d + p) % subjects10A.length;
                sample.add(TimetableEntry.builder()
                        .gradeClass("10-A")
                        .grade("Grade 10")
                        .dayOfWeek(day)
                        .period(p + 1)
                        .startTime(periodSlots[p][1])
                        .endTime(periodSlots[p][2])
                        .subject(subjects10A[subjectIdx])
                        .teacherName(teachers10A[subjectIdx])
                        .roomNumber("Hall 14")
                        .academicYear("2025/2026")
                        .createdAt(LocalDateTime.now())
                        .build());
            }
        }

        List<TimetableEntry> saved = timetableRepository.saveAll(sample);
        Map<String, Object> resp = new HashMap<>();
        resp.put("message", "Seeded sample timetable successfully");
        resp.put("insertedCount", saved.size());
        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }
}
