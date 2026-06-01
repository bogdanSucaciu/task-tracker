package com.example.tasktracker.task;

public enum TaskPriority {
    // Declared low -> high so the reverse-natural-order sort in TaskService.list()
    // yields CRITICAL -> HIGH -> MEDIUM -> LOW -> TRIVIAL. Persisted as a string
    // (EnumType.STRING), so the declaration order is safe to extend.
    TRIVIAL,
    LOW,
    MEDIUM,
    HIGH,
    CRITICAL
}
