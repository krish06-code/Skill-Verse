package com.skillverse.controller;

import com.skillverse.dto.Dtos.AddSkillRequest;
import com.skillverse.dto.Dtos.OkResponse;
import com.skillverse.dto.Dtos.UpdateUserRequest;
import com.skillverse.dto.Dtos.UserDto;
import com.skillverse.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<UserDto> list() {
        return userService.list();
    }

    @GetMapping("/{id}")
    public UserDto get(@PathVariable String id) {
        return userService.get(id);
    }

    @PutMapping("/{id}")
    public UserDto update(@PathVariable String id, @RequestBody UpdateUserRequest request) {
        return userService.update(id, request);
    }

    @PostMapping("/{id}/skills")
    public OkResponse addSkill(@PathVariable String id, @Valid @RequestBody AddSkillRequest request) {
        userService.addSkill(id, request.skillName(), request.type());
        return new OkResponse(true);
    }
}
