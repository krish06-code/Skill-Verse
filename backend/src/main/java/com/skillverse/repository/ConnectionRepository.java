package com.skillverse.repository;

import com.skillverse.model.Connection;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ConnectionRepository extends MongoRepository<Connection, String> {
    List<Connection> findBySenderIdOrReceiverId(String senderId, String receiverId);
    Optional<Connection> findBySenderIdAndReceiverId(String senderId, String receiverId);
}
