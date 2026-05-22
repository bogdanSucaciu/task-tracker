package com.example.tasktracker.task;

import jakarta.validation.constraints.NotNull;

public record StatusUpdateRequest(@NotNull TaskStatus status) {
}
