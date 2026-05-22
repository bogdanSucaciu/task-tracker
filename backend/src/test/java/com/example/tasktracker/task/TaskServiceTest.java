package com.example.tasktracker.task;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import com.example.tasktracker.common.NotFoundException;
import com.example.tasktracker.user.User;
import com.example.tasktracker.user.UserRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

class TaskServiceTest {

    private final TaskRepository taskRepository = Mockito.mock(TaskRepository.class);
    private final UserRepository userRepository = Mockito.mock(UserRepository.class);
    private final TaskService taskService = new TaskService(taskRepository, userRepository);

    @Test
    void createAssignsTaskToUser() {
        User user = new User("dev@example.com", "Dev User", "hash");
        Task saved = new Task("Ship demo", "Prepare workflow", TaskStatus.TODO, user);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(taskRepository.save(Mockito.any(Task.class))).thenReturn(saved);

        TaskResponse response = taskService.create(new TaskRequest("Ship demo", "Prepare workflow", null, 1L));

        assertThat(response.title()).isEqualTo("Ship demo");
        assertThat(response.assignedUser().email()).isEqualTo("dev@example.com");
        assertThat(response.status()).isEqualTo(TaskStatus.TODO);
    }

    @Test
    void createFailsWhenAssignedUserMissing() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.create(new TaskRequest("Task", null, TaskStatus.TODO, 99L)))
            .isInstanceOf(NotFoundException.class);
    }
}
