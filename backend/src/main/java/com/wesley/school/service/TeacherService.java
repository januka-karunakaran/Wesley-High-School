package com.wesley.school.service;

import com.wesley.school.document.Teacher;
import com.wesley.school.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TeacherService {

    private final TeacherRepository teacherRepository;

    public List<Teacher> fetchAllTeachers() {
        return teacherRepository.findAll();
    }

    public Teacher saveTeacher(Teacher teacher) {
        return teacherRepository.save(teacher);
    }

    public Optional<Teacher> findByTeacherId(String teacherId) {
        return teacherRepository.findByTeacherId(teacherId);
    }

    public Teacher updateTeacher(String teacherId, Teacher updatedTeacher) {
        Optional<Teacher> existingOpt = teacherRepository.findByTeacherId(teacherId);
        if (existingOpt.isPresent()) {
            Teacher existing = existingOpt.get();
            existing.setFullName(updatedTeacher.getFullName());
            existing.setEmail(updatedTeacher.getEmail());
            existing.setPhone(updatedTeacher.getPhone());
            existing.setSubjectSpecialization(updatedTeacher.getSubjectSpecialization());
            existing.setQualification(updatedTeacher.getQualification());
            existing.setPhotoUrl(updatedTeacher.getPhotoUrl());
            return teacherRepository.save(existing);
        }
        return null;
    }
}
