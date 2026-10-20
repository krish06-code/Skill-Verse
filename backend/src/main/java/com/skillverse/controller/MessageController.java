package com.skillverse.controller;

import com.skillverse.dto.Dtos.MessageDto;
import com.skillverse.dto.Dtos.MessageRequest;
import com.skillverse.model.Message;
import com.skillverse.service.MessageService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/messages")
public class MessageController {

    private static final DateTimeFormatter TIME =
            DateTimeFormatter.ofPattern("HH:mm").withZone(ZoneId.systemDefault());

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping("/{userId}")
    public List<MessageDto> list(@PathVariable String userId) {
        return messageService.forUser(userId).stream().map(MessageController::toDto).toList();
    }

    @PostMapping
    public MessageDto send(@Valid @RequestBody MessageRequest request) {
        return toDto(messageService.send(request.senderId(), request.receiverId(), request.message()));
    }

    private static MessageDto toDto(Message m) {
        return new MessageDto(m.getId(), m.getSenderId(), m.getReceiverId(), m.getMessage(),
                m.getTimestamp() != null ? TIME.format(m.getTimestamp()) : "");
    }
}
