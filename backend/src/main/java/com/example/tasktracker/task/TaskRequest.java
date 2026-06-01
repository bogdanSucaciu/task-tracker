package com.example.tasktracker.task;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record TaskRequest(
    @NotBlank @Size(max = 200) String title,
    @Size(max = 5000) String description,
    TaskStatus status,
    TaskPriority priority,
    @NotNull Long assignedUserId
) {
}
