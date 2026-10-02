package com.todolist.backend.service;

import com.todolist.backend.dto.TaskRequest;
import com.todolist.backend.dto.TaskResponse;
import com.todolist.backend.entity.Priority;
import com.todolist.backend.entity.Task;
import com.todolist.backend.entity.TaskStatus;
import com.todolist.backend.exception.ResourceNotFoundException;
import com.todolist.backend.repository.TaskRepository;
import com.todolist.backend.repository.UserRepository;
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
    public List<TaskResponse> getAllTasks(Long userId) {
        return taskRepository.findAllByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(TaskResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public TaskResponse getTask(Long id, Long userId) {
        return TaskResponse.from(findOwnedOrThrow(id, userId));
    }

    @Transactional
    public TaskResponse createTask(TaskRequest request, Long userId) {
        Task task = new Task();
        task.setUser(userRepository.getReferenceById(userId));
        applyRequest(task, request);
        return TaskResponse.from(taskRepository.save(task));
    }

    @Transactional
    public TaskResponse updateTask(Long id, TaskRequest request, Long userId) {
        Task task = findOwnedOrThrow(id, userId);
        applyRequest(task, request);
        return TaskResponse.from(taskRepository.save(task));
    }

    @Transactional
    public TaskResponse toggleComplete(Long id, Long userId) {
        Task task = findOwnedOrThrow(id, userId);
        task.setStatus(task.getStatus() == TaskStatus.COMPLETED
                ? TaskStatus.PENDING
                : TaskStatus.COMPLETED);
        return TaskResponse.from(taskRepository.save(task));
    }

    @Transactional
    public void deleteTask(Long id, Long userId) {
        taskRepository.delete(findOwnedOrThrow(id, userId));
    }

    // Finds the task only if it belongs to this user
    private Task findOwnedOrThrow(Long id, Long userId) {
        return taskRepository.findByIdAndUserId(id, userId)
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