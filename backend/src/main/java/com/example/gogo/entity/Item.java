package com.example.gogo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 255)
    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    // Diagnostic fields
    @Column(name = "vin")
    private String vin;

    @Column(name = "chassis_number")
    private String chassisNumber;

    @Column(name = "vehicle_model")
    private String vehicleModel;

    @Column(name = "model_year")
    private String modelYear;

    @Column(name = "rpm")
    private Integer rpm;

    @Column(name = "engine_temp")
    private Integer engineTemp;

    @Column(name = "mileage")
    private Integer mileage;

    @Column(name = "diagnostic_date")
    private LocalDateTime diagnosticDate;

    @Column(name = "status")
    private String status;

    @Column(name = "technician")
    private String technician;

    @Column(name = "engine_type")
    private String engineType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}