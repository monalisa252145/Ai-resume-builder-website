package com.airesumebuilder.repository;

import com.airesumebuilder.model.Resume;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface ResumeRepository extends MongoRepository<Resume, String> {
    List<Resume> findByUserId(String userId);
    Optional<Resume> findByIdAndUserId(String id, String userId);
    void deleteByIdAndUserId(String id, String userId);
}
