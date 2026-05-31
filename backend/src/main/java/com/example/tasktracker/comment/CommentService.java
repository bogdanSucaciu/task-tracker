package com.example.tasktracker.comment;

import com.example.tasktracker.common.NotFoundException;
import com.example.tasktracker.task.Task;
import com.example.tasktracker.task.TaskRepository;
import com.example.tasktracker.user.User;
import com.example.tasktracker.user.UserRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public CommentService(
        CommentRepository commentRepository,
        TaskRepository taskRepository,
        UserRepository userRepository
    ) {
        this.commentRepository = commentRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> getComments(Long taskId) {
        return commentRepository.findAll().stream()
            .filter(c -> c.getTask().getId().equals(taskId))
            .map(CommentResponse::from)
            .toList();
    }

    @Transactional
    public CommentResponse addComment(Long taskId, String authorEmail, CommentRequest request) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new NotFoundException("Task not found"));
        User author = userRepository.findByEmail(authorEmail)
            .orElseThrow(() -> new NotFoundException("User not found"));
        Comment comment = new Comment(request.body().trim(), task, author);
        return CommentResponse.from(commentRepository.save(comment));
    }

    @Transactional
    public void deleteComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new NotFoundException("Comment not found"));
        commentRepository.delete(comment);
    }
}
