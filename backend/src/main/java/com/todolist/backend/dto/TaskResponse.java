package com.todolist.backend.dto;

import com.todolist.backend.entity.Priority;
import com.todolist.backend.entity.Task;
import com.todolist.backend.entity.TaskStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record TaskResponse(
        Long id,
        String title,
        String description,
        LocalDate dueDate,
        Priority priority,
        TaskStatus status,
        String category,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static TaskResponse from(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getDueDate(),
                task.getPriority(),
                task.getStatus(),
                task.getCategory(),
                task.getCreatedAt(),
                task.getUpdatedAt()
        );
    }
}