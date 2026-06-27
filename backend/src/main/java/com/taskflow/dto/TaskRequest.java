package com.taskflow.dto;

import com.taskflow.entity.Priority;
import com.taskflow.entity.Status;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class TaskRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Priority is required")
    private Priority priority;

    @NotNull(message = "Status is required")
    private Status status;

    @FutureOrPresent(message = "Due date must be in the present or future")
    private LocalDate dueDate;
}
