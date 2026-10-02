package com.todolist.backend.dto;

public record AuthResponse(String token, String name, String email) {
}