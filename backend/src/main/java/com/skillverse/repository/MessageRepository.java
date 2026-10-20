package com.skillverse.repository;

import com.skillverse.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findBySenderIdOrReceiverIdOrderByTimestampAsc(String senderId, String receiverId);
}
