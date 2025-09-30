package com.example.gogo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemResponse {
    private Long id;
    private String title;
    private String description;

    // Diagnostic fields
    private String vin;
    private String chassisNumber;
    private String vehicleModel;
    private String modelYear;
    private Integer rpm;
    private Integer engineTemp;
    private Integer mileage;
    private LocalDateTime diagnosticDate;
    private String status;
    private String technician;
    private String engineType;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}