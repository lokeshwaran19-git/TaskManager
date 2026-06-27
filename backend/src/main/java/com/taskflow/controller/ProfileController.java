package com.taskflow.controller;

import com.taskflow.dto.ApiResponse;
import com.taskflow.dto.ChangePasswordRequest;
import com.taskflow.dto.ProfileRequest;
import com.taskflow.dto.ProfileResponse;
import com.taskflow.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<ProfileResponse>> getProfile(Principal principal) {
        ProfileResponse response = profileService.getProfile(principal.getName());
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", response));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<ProfileResponse>> updateProfile(
            @Valid @RequestBody ProfileRequest request,
            Principal principal
    ) {
        ProfileResponse response = profileService.updateProfile(request, principal.getName());
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", response));
    }

    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Principal principal
    ) {
        profileService.changePassword(request, principal.getName());
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully", null));
    }
}
