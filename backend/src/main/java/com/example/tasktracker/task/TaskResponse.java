package com.example.tasktracker.task;

import com.example.tasktracker.user.UserResponse;
import java.time.Instant;

public record TaskResponse(
    Long id,
    String title,
    String description,
    TaskStatus status,
    UserResponse assignedUser,
    Instant createdAt,
    Instant updatedAt
) {
    public static TaskResponse from(Task task) {
        return new TaskResponse(
            task.getId(),
            task.getTitle(),
            task.getDescription(),
            task.getStatus(),
            UserResponse.from(task.getAssignedUser()),
            task.getCreatedAt(),
            task.getUpdatedAt()
        );
    }
}
