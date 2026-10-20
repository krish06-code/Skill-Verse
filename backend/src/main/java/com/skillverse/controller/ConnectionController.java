package com.skillverse.controller;

import com.skillverse.dto.Dtos.ConnectionRequest;
import com.skillverse.dto.Dtos.ConnectionStatusRequest;
import com.skillverse.model.Connection;
import com.skillverse.service.ConnectionService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/connections")
public class ConnectionController {

    private final ConnectionService connectionService;

    public ConnectionController(ConnectionService connectionService) {
        this.connectionService = connectionService;
    }

    @GetMapping
    public List<Connection> list(@RequestParam String userId) {
        return connectionService.forUser(userId);
    }

    @PostMapping
    public Connection send(@Valid @RequestBody ConnectionRequest request) {
        return connectionService.send(request.senderId(), request.receiverId());
    }

    @PutMapping("/{id}")
    public Connection respond(@PathVariable String id, @Valid @RequestBody ConnectionStatusRequest request) {
        return connectionService.respond(id, request.status());
    }
}
