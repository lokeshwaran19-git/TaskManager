package com.taskflow.repository;

import com.taskflow.entity.Task;
import com.taskflow.entity.User;
import com.taskflow.entity.Priority;
import com.taskflow.entity.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    @Query("SELECT t FROM Task t WHERE t.user.id = :userId AND " +
           "(:title IS NULL OR LOWER(t.title) LIKE LOWER(CONCAT('%', CAST(:title AS string), '%'))) AND " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:priority IS NULL OR t.priority = :priority) AND " +
           "(:dueDate IS NULL OR t.dueDate = :dueDate)")
    Page<Task> searchAndFilterTasks(
        @Param("userId") Long userId,
        @Param("title") String title,
        @Param("status") Status status,
        @Param("priority") Priority priority,
        @Param("dueDate") LocalDate dueDate,
        Pageable pageable
    );

    long countByUser(User user);

    long countByUserAndStatus(User user, Status status);

    long countByUserAndPriority(User user, Priority priority);

    long countByUserAndDueDateBeforeAndStatusNot(User user, LocalDate date, Status status);
}
