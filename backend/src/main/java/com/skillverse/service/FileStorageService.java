package com.skillverse.service;

import com.mongodb.client.gridfs.model.GridFSFile;
import com.skillverse.web.ApiException;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Set;

import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Query.query;

/** Stores profile photos in MongoDB GridFS. */
@Service
public class FileStorageService {

    private static final Set<String> ALLOWED = Set.of("image/jpeg", "image/png", "image/webp", "image/gif");
    private static final long MAX_BYTES = 5L * 1024 * 1024;

    private final GridFsTemplate gridFsTemplate;
    private final GridFsOperations gridFsOperations;

    public FileStorageService(GridFsTemplate gridFsTemplate, GridFsOperations gridFsOperations) {
        this.gridFsTemplate = gridFsTemplate;
        this.gridFsOperations = gridFsOperations;
    }

    public String store(String userId, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Please choose an image to upload");
        }
        if (file.getSize() > MAX_BYTES) {
            throw new ApiException(HttpStatus.PAYLOAD_TOO_LARGE, "Image must be smaller than 5 MB");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED.contains(contentType.toLowerCase())) {
            throw new ApiException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Only JPG, PNG, WEBP or GIF images are allowed");
        }

        // remove any previous avatar for this user
        gridFsTemplate.delete(query(where("metadata.userId").is(userId)));

        try (InputStream in = file.getInputStream()) {
            org.springframework.data.mongodb.core.query.Query ignored = null;
            ObjectId id = gridFsTemplate.store(
                    in,
                    file.getOriginalFilename() == null ? "avatar" : file.getOriginalFilename(),
                    contentType,
                    new org.bson.Document("userId", userId));
            return id.toHexString();
        } catch (IOException e) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not read the uploaded image");
        }
    }

    public StoredFile load(String fileId) {
        GridFSFile file;
        try {
            file = gridFsTemplate.findOne(query(where("_id").is(new ObjectId(fileId))));
        } catch (IllegalArgumentException e) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Image not found");
        }
        if (file == null) throw new ApiException(HttpStatus.NOT_FOUND, "Image not found");

        try (InputStream in = gridFsOperations.getResource(file).getInputStream()) {
            byte[] bytes = in.readAllBytes();
            String contentType = file.getMetadata() != null
                    ? file.getMetadata().getString("_contentType")
                    : null;
            return new StoredFile(bytes, contentType == null ? "application/octet-stream" : contentType);
        } catch (IOException e) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not read the stored image");
        }
    }

    public record StoredFile(byte[] bytes, String contentType) {}

    /** kept for API symmetry with potential future listing needs */
    public List<String> noop() { return List.of(); }
}
