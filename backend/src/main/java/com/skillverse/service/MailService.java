package com.skillverse.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Sends transactional email. When SMTP is not configured the message is logged
 * instead, so local development still works without a mail provider.
 */
@Service
public class MailService {

    private static final Logger log = LoggerFactory.getLogger(MailService.class);

    private final Optional<JavaMailSender> mailSender;

    @Value("${skillverse.mail.from:no-reply@skillverse.local}")
    private String from;

    @Value("${spring.mail.host:}")
    private String mailHost;

    public MailService(Optional<JavaMailSender> mailSender) {
        this.mailSender = mailSender;
    }

    public void send(String to, String subject, String body) {
        if (mailSender.isEmpty() || mailHost == null || mailHost.isBlank()) {
            log.warn("SMTP not configured. Email intended for {}:\nSubject: {}\n{}", to, subject, body);
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(from);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.get().send(message);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }
}
