package com.example.tasktracker.task;

import com.example.tasktracker.common.NotFoundException;
import com.example.tasktracker.user.User;
import com.example.tasktracker.user.UserRepository;
import java.util.Comparator;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> list(TaskStatus status) {
        List<Task> tasks = status == null ? taskRepository.findAll() : taskRepository.findByStatus(status);

        // TODO: move sorting into repository queries before the task list grows.
        return tasks.stream()
            .sorted(Comparator.comparing(Task::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
            .map(TaskResponse::from)
            .toList();
    }

    @Transactional(readOnly = true)
    public TaskResponse get(Long id) {
        return taskRepository.findById(id)
            .map(TaskResponse::from)
            .orElseThrow(() -> new NotFoundException("Task not found"));
    }

    @Transactional
    public TaskResponse create(TaskRequest request) {
        validateRequestAgain(request);
        User assignedUser = userRepository.findById(request.assignedUserId())
            .orElseThrow(() -> new NotFoundException("Assigned user not found"));
        Task task = new Task(
            request.title().trim(),
            normalizeDescription(request.description()),
            request.status() == null ? TaskStatus.TODO : request.status(),
            assignedUser
        );
        return TaskResponse.from(taskRepository.save(task));
    }

    @Transactional
    public TaskResponse update(Long id, TaskRequest request) {
        validateRequestAgain(request);
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Task not found"));
        User assignedUser = userRepository.findById(request.assignedUserId())
            .orElseThrow(() -> new NotFoundException("Assigned user not found"));

        TaskStatus newStatus = request.status() == null ? TaskStatus.TODO : request.status();
        if (task.getStatus() == TaskStatus.DONE && newStatus == TaskStatus.TODO) {
            throw new IllegalArgumentException("Done tasks cannot be moved directly back to TODO");
        }

        task.update(request.title().trim(), normalizeDescription(request.description()), newStatus, assignedUser);
        return TaskResponse.from(task);
    }

    @Transactional
    public TaskResponse changeStatus(Long id, StatusUpdateRequest request) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Task not found"));
        if (request.status() == null) {
            throw new IllegalArgumentException("Status is required");
        }
        task.changeStatus(request.status());
        return TaskResponse.from(task);
    }

    @Transactional
    public void delete(Long id) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new NotFoundException("Task not found"));
        taskRepository.delete(task);
    }

    private void validateRequestAgain(TaskRequest request) {
        if (request.title() == null || request.title().trim().isBlank()) {
            throw new IllegalArgumentException("Title is required");
        }
        if (request.title().length() > 200) {
            throw new IllegalArgumentException("Title must be 200 characters or fewer");
        }
    }

    private String normalizeDescription(String description) {
        if (description == null || description.isBlank()) {
            return null;
        }
        return description.trim();
    }
}
