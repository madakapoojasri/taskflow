package com.todolist.backend.service;

import com.todolist.backend.dto.TaskRequest;
import com.todolist.backend.dto.TaskResponse;
import com.todolist.backend.entity.Priority;
import com.todolist.backend.entity.Task;
import com.todolist.backend.entity.TaskStatus;
import com.todolist.backend.exception.ResourceNotFoundException;
import com.todolist.backend.repository.TaskRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getAllTasks() {
        return taskRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(TaskResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public TaskResponse getTask(Long id) {
        return TaskResponse.from(findOrThrow(id));
    }

    @Transactional
    public TaskResponse createTask(TaskRequest request) {
        Task task = new Task();
        applyRequest(task, request);
        return TaskResponse.from(taskRepository.save(task));
    }

    @Transactional
    public TaskResponse updateTask(Long id, TaskRequest request) {
        Task task = findOrThrow(id);
        applyRequest(task, request);
        return TaskResponse.from(taskRepository.save(task));
    }

    // Flips PENDING <-> COMPLETED, like the checkbox in React
    @Transactional
    public TaskResponse toggleComplete(Long id) {
        Task task = findOrThrow(id);
        task.setStatus(task.getStatus() == TaskStatus.COMPLETED
                ? TaskStatus.PENDING
                : TaskStatus.COMPLETED);
        return TaskResponse.from(taskRepository.save(task));
    }

    @Transactional
    public void deleteTask(Long id) {
        taskRepository.delete(findOrThrow(id));
    }

    private Task findOrThrow(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id " + id));
    }

    private void applyRequest(Task task, TaskRequest request) {
        task.setTitle(request.title().trim());
        task.setDescription(request.description());
        task.setDueDate(request.dueDate());
        task.setPriority(request.priority() != null ? request.priority() : Priority.MEDIUM);
        task.setCategory(request.category());
    }
}