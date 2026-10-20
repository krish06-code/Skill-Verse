package com.skillverse.repository;

import com.skillverse.model.Skill;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface SkillRepository extends MongoRepository<Skill, String> {
    Optional<Skill> findByNameIgnoreCase(String name);
}
