package com.wesley.school.repository;

import com.wesley.school.document.Admission;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdmissionRepository extends MongoRepository<Admission, String> {
}
