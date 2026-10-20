package com.skillverse.controller;

import com.skillverse.model.Skill;
import com.skillverse.repository.SkillRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/skills")
public class SkillController {

    private final SkillRepository skillRepository;

    public SkillController(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    @GetMapping
    public List<Skill> list() {
        return skillRepository.findAll().stream()
                .sorted(Comparator.comparing(Skill::getName))
                .toList();
    }
}
