package com.example.tasktracker.task;

import com.example.tasktracker.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(
    name = "tasks",
    indexes = {
        @Index(name = "idx_tasks_assigned_user_id", columnList = "assigned_user_id"),
        @Index(name = "idx_tasks_status", columnList = "status"),
        @Index(name = "idx_tasks_assigned_user_status", columnList = "assigned_user_id,status"),
        @Index(name = "idx_tasks_created_at", columnList = "created_at")
    }
)
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "text")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TaskStatus status = TaskStatus.TODO;

    // columnDefinition supplies a DB default so ddl-auto can add this NOT NULL
    // column and backfill existing rows to MEDIUM.
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20, columnDefinition = "varchar(20) default 'MEDIUM'")
    private TaskPriority priority = TaskPriority.MEDIUM;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "assigned_user_id", nullable = false)
    private User assignedUser;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected Task() {
    }

    public Task(String title, String description, TaskStatus status, TaskPriority priority, User assignedUser) {
        this.title = title;
        this.description = description;
        this.status = status == null ? TaskStatus.TODO : status;
        this.priority = priority == null ? TaskPriority.MEDIUM : priority;
        this.assignedUser = assignedUser;
    }

    public void update(String title, String description, TaskStatus status, TaskPriority priority, User assignedUser) {
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority == null ? TaskPriority.MEDIUM : priority;
        this.assignedUser = assignedUser;
    }

    public void changeStatus(TaskStatus status) {
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public TaskPriority getPriority() {
        return priority;
    }

    public User getAssignedUser() {
        return assignedUser;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
