package com.skillverse.controller;

import com.skillverse.dto.Dtos.UserDto;
import com.skillverse.model.User;
import com.skillverse.repository.UserRepository;
import com.skillverse.service.FileStorageService;
import com.skillverse.service.ReviewService;
import com.skillverse.web.ApiException;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.concurrent.TimeUnit;

@RestController
public class FileController {

    private final FileStorageService fileStorageService;
    private final UserRepository userRepository;
    private final ReviewService reviewService;

    public FileController(FileStorageService fileStorageService, UserRepository userRepository,
                          ReviewService reviewService) {
        this.fileStorageService = fileStorageService;
        this.userRepository = userRepository;
        this.reviewService = reviewService;
    }

    /** Upload / replace the profile photo of the logged-in user. */
    @PostMapping(value = "/users/{id}/photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public UserDto upload(@PathVariable String id, @RequestParam("file") MultipartFile file,
                          Authentication authentication) {
        if (authentication == null || !id.equals(authentication.getPrincipal())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You can only change your own photo");
        }
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        String fileId = fileStorageService.store(id, file);
        String url = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/files/").path(fileId).toUriString();
        user.setProfileImage(url);
        userRepository.save(user);
        return UserDto.from(user, reviewService.averageRating(id));
    }

    /** Public: serve a stored image. */
    @GetMapping("/files/{fileId}")
    public ResponseEntity<byte[]> get(@PathVariable String fileId) {
        FileStorageService.StoredFile f = fileStorageService.load(fileId);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(f.contentType()))
                .cacheControl(CacheControl.maxAge(7, TimeUnit.DAYS))
                .body(f.bytes());
    }
}
