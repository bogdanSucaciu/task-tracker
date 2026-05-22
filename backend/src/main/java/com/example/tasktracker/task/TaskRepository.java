package com.example.tasktracker.task;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByStatus(TaskStatus status);

    List<Task> findByAssignedUserId(Long assignedUserId);

    List<Task> findByAssignedUserIdAndStatus(Long assignedUserId, TaskStatus status);
}
