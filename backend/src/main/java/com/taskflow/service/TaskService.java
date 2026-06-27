package com.taskflow.service;

import com.taskflow.dto.TaskRequest;
import com.taskflow.dto.TaskResponse;
import com.taskflow.entity.Priority;
import com.taskflow.entity.Status;
import com.taskflow.entity.Task;
import com.taskflow.entity.User;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.exception.UnauthorizedException;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.time.LocalDate;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    public TaskResponse createTask(TaskRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority())
                .status(request.getStatus())
                .dueDate(request.getDueDate())
                .user(user)
                .build();

        Task savedTask = taskRepository.save(task);
        return mapToTaskResponse(savedTask);
    }

    public TaskResponse updateTask(Long taskId, TaskRequest request, String userEmail) {
        Task task = getTaskAndValidateUser(taskId, userEmail);

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority());
        task.setStatus(request.getStatus());
        task.setDueDate(request.getDueDate());

        Task updatedTask = taskRepository.save(task);
        return mapToTaskResponse(updatedTask);
    }

    public void deleteTask(Long taskId, String userEmail) {
        Task task = getTaskAndValidateUser(taskId, userEmail);
        taskRepository.delete(task);
    }

    public TaskResponse getTask(Long taskId, String userEmail) {
        Task task = getTaskAndValidateUser(taskId, userEmail);
        return mapToTaskResponse(task);
    }

    public Page<TaskResponse> getAllTasks(
            String userEmail,
            String search,
            Status status,
            Priority priority,
            LocalDate dueDate,
            int page,
            int size,
            String sortBy,
            String sortDir
    ) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Match sorting string to entity fields: map "newest"/"oldest" to "createdAt"
        String sortField = sortBy;
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        
        if (sortBy.equalsIgnoreCase("newest")) {
            sortField = "createdAt";
            direction = Sort.Direction.DESC;
        } else if (sortBy.equalsIgnoreCase("oldest")) {
            sortField = "createdAt";
            direction = Sort.Direction.ASC;
        } else if (sortBy.equalsIgnoreCase("dueDate")) {
            sortField = "dueDate";
        } else if (sortBy.equalsIgnoreCase("priority")) {
            sortField = "priority";
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortField));
        
        // Use empty/null values mapping for title search
        String titleParam = (search == null || search.trim().isEmpty()) ? null : search;

        Page<Task> taskPage = taskRepository.searchAndFilterTasks(
                user.getId(),
                titleParam,
                status,
                priority,
                dueDate,
                pageable
        );

        return taskPage.map(this::mapToTaskResponse);
    }

    private Task getTaskAndValidateUser(Long taskId, String userEmail) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));
        if (!task.getUser().getEmail().equals(userEmail)) {
            throw new UnauthorizedException("You are not authorized to perform actions on this task");
        }
        return task;
    }

    private TaskResponse mapToTaskResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .priority(task.getPriority())
                .status(task.getStatus())
                .dueDate(task.getDueDate())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}
