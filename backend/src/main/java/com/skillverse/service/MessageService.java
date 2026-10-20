package com.skillverse.service;

import com.skillverse.model.Message;
import com.skillverse.repository.MessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {

    private final MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public List<Message> forUser(String userId) {
        return messageRepository.findBySenderIdOrReceiverIdOrderByTimestampAsc(userId, userId);
    }

    public Message send(String senderId, String receiverId, String text) {
        return messageRepository.save(new Message(senderId, receiverId, text));
    }
}
