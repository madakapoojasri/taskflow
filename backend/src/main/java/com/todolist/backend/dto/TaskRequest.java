package com.todolist.backend.dto;

import com.todolist.backend.entity.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record TaskRequest(
        @NotBlank(message = "Title is required")
        @Size(max = 150, message = "Title must be at most 150 characters")
        String title,

        @Size(max = 1000, message = "Description must be at most 1000 characters")
        String description,

        LocalDate dueDate,

        Priority priority,

        @Size(max = 50, message = "Category must be at most 50 characters")
        String category
) {
}