package com.todolist.backend.controller;

import com.todolist.backend.dto.TaskRequest;
import com.todolist.backend.dto.TaskResponse;
import com.todolist.backend.service.TaskService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public List<TaskResponse> getAll(@AuthenticationPrincipal Jwt jwt) {
        return taskService.getAllTasks(userId(jwt));
    }

    @GetMapping("/{id}")
    public TaskResponse getOne(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        return taskService.getTask(id, userId(jwt));
    }

    @PostMapping
    public ResponseEntity<TaskResponse> create(@Valid @RequestBody TaskRequest request,
                                               @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(taskService.createTask(request, userId(jwt)));
    }

    @PutMapping("/{id}")
    public TaskResponse update(@PathVariable Long id,
                               @Valid @RequestBody TaskRequest request,
                               @AuthenticationPrincipal Jwt jwt) {
        return taskService.updateTask(id, request, userId(jwt));
    }

    @PatchMapping("/{id}/complete")
    public TaskResponse toggleComplete(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        return taskService.toggleComplete(id, userId(jwt));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        taskService.deleteTask(id, userId(jwt));
        return ResponseEntity.noContent().build();
    }

    // The token's subject is the user id (set in JwtService)
    private Long userId(Jwt jwt) {
        return Long.valueOf(jwt.getSubject());
    }
}