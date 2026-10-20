package com.skillverse.service;

import com.skillverse.model.Connection;
import com.skillverse.repository.ConnectionRepository;
import com.skillverse.repository.UserRepository;
import com.skillverse.web.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConnectionService {

    private final ConnectionRepository connectionRepository;
    private final UserRepository userRepository;

    public ConnectionService(ConnectionRepository connectionRepository, UserRepository userRepository) {
        this.connectionRepository = connectionRepository;
        this.userRepository = userRepository;
    }

    public List<Connection> forUser(String userId) {
        return connectionRepository.findBySenderIdOrReceiverId(userId, userId);
    }

    public Connection send(String senderId, String receiverId) {
        if (senderId.equals(receiverId)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "You cannot connect with yourself");
        }
        return connectionRepository.findBySenderIdAndReceiverId(senderId, receiverId)
                .or(() -> connectionRepository.findBySenderIdAndReceiverId(receiverId, senderId))
                .orElseGet(() -> connectionRepository.save(
                        new Connection(senderId, receiverId, Connection.Status.PENDING)));
    }

    public Connection respond(String id, String status) {
        Connection connection = connectionRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Connection request not found"));

        Connection.Status newStatus;
        try {
            newStatus = Connection.Status.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invalid status");
        }

        connection.setStatus(newStatus);
        Connection saved = connectionRepository.save(connection);

        // Accepted connections earn both students skill points.
        if (newStatus == Connection.Status.ACCEPTED) {
            awardPoints(saved.getSenderId(), 10);
            awardPoints(saved.getReceiverId(), 10);
        }
        return saved;
    }

    private void awardPoints(String userId, int points) {
        userRepository.findById(userId).ifPresent(u -> {
            u.setSkillPoints(u.getSkillPoints() + points);
            userRepository.save(u);
        });
    }
}
