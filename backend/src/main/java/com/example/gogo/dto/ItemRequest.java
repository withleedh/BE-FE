package com.example.gogo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ItemRequest {
    @NotBlank
    @Size(max = 255)
    private String title;

    private String description;
}