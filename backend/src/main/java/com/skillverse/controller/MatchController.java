package com.skillverse.controller;

import com.skillverse.dto.Dtos.MatchResultDto;
import com.skillverse.service.MatchService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/matches")
public class MatchController {

    private final MatchService matchService;

    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @GetMapping("/{userId}")
    public List<MatchResultDto> matches(@PathVariable String userId) {
        return matchService.matchesFor(userId);
    }
}
