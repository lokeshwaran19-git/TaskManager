package com.taskflow.service;

import com.taskflow.dto.DashboardResponse;
import com.taskflow.entity.Priority;
import com.taskflow.entity.Status;
import com.taskflow.entity.User;
import com.taskflow.exception.ResourceNotFoundException;
import com.taskflow.repository.TaskRepository;
import com.taskflow.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;

@Service
public class DashboardService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public DashboardService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    public DashboardResponse getDashboardStats(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        long total = taskRepository.countByUser(user);
        long completed = taskRepository.countByUserAndStatus(user, Status.COMPLETED);
        long pending = taskRepository.countByUserAndStatus(user, Status.PENDING);
        long inProgress = taskRepository.countByUserAndStatus(user, Status.IN_PROGRESS);
        long highPriority = taskRepository.countByUserAndPriority(user, Priority.HIGH);
        long overdue = taskRepository.countByUserAndDueDateBeforeAndStatusNot(user, LocalDate.now(), Status.COMPLETED);

        double completionPercentage = 0.0;
        if (total > 0) {
            completionPercentage = Math.round(((double) completed / total * 100.0) * 100.0) / 100.0;
        }

        return DashboardResponse.builder()
                .totalTasks(total)
                .completedTasks(completed)
                .pendingTasks(pending)
                .inProgressTasks(inProgress)
                .highPriorityTasks(highPriority)
                .overdueTasks(overdue)
                .completionPercentage(completionPercentage)
                .build();
    }
}
