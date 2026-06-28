package com.taskflow.controller;

import com.taskflow.dto.ApiResponse;
import com.taskflow.dto.TaskRequest;
import com.taskflow.dto.TaskResponse;
import com.taskflow.entity.Priority;
import com.taskflow.entity.Status;
import com.taskflow.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.time.LocalDate;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(
            @Valid @RequestBody TaskRequest request,
            Principal principal
    ) {
        TaskResponse response = taskService.createTask(request, principal.getName());
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Task Created Successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest request,
            Principal principal
    ) {
        TaskResponse response = taskService.updateTask(id, request, principal.getName());
        return ResponseEntity.ok(ApiResponse.success("Task Updated Successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(
            @PathVariable Long id,
            Principal principal
    ) {
        taskService.deleteTask(id, principal.getName());
        return ResponseEntity.ok(ApiResponse.success("Task Deleted Successfully", null));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> getTask(
            @PathVariable Long id,
            Principal principal
    ) {
        TaskResponse response = taskService.getTask(id, principal.getName());
        return ResponseEntity.ok(ApiResponse.success("Task Retrieved Successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<TaskResponse>>> getAllTasks(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Status status,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dueDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "newest") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            Principal principal
    ) {
        Page<TaskResponse> response = taskService.getAllTasks(
                principal.getName(),
                search,
                status,
                priority,
                dueDate,
                page,
                size,
                sortBy,
                sortDir
        );
        return ResponseEntity.ok(ApiResponse.success("Tasks Retrieved Successfully", response));
    }
}
