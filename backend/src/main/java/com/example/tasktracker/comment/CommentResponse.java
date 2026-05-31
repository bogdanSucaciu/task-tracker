package com.example.tasktracker.comment;

import java.time.Instant;

public record CommentResponse(
    Long id,
    String body,
    String authorDisplayName,
    Instant createdAt
) {
    public static CommentResponse from(Comment comment) {
        return new CommentResponse(
            comment.getId(),
            comment.getBody(),
            comment.getAuthor().getDisplayName(),
            comment.getCreatedAt()
        );
    }
}
