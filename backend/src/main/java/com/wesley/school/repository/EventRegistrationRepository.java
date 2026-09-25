package com.wesley.school.repository;

import com.wesley.school.document.EventRegistration;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRegistrationRepository extends MongoRepository<EventRegistration, String> {

    List<EventRegistration> findByEventNameIgnoreCase(String eventName);

    List<EventRegistration> findByEmailIgnoreCase(String email);

    Optional<EventRegistration> findByRegistrationNumber(String registrationNumber);

    long countByEventNameIgnoreCase(String eventName);

    List<EventRegistration> findAllByOrderByRegisteredAtDesc();
}
