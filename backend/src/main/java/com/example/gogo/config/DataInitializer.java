package com.example.gogo.config;

import com.example.gogo.entity.Item;
import com.example.gogo.entity.User;
import com.example.gogo.repository.ItemRepository;
import com.example.gogo.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, ItemRepository itemRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            try {
                // Clear existing data
                itemRepository.deleteAll();
                userRepository.deleteAll();

                // Create test user
                User testUser = User.builder()
                        .username("test")
                        .email("test@hyundai.com")
                        .password(passwordEncoder.encode("123456"))
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build();
                userRepository.save(testUser);
                System.out.println("✓ Created test user: test / 123456");

                // Create admin user
                User adminUser = User.builder()
                        .username("admin")
                        .email("admin@hyundai.com")
                        .password(passwordEncoder.encode("admin123"))
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build();
                adminUser = userRepository.save(adminUser);
                System.out.println("✓ Created admin user: admin / admin123");

                // Create 100 sample diagnostic records
                String[] models = {"Sonata", "Tucson", "Santa Fe", "Elantra", "Kona", "Palisade", "Ioniq 5", "Genesis G80", "Venue", "Staria"};
                String[] engineTypes = {"Theta", "Smartstream", "Gamma", "Electric"};
                String[] statuses = {"NORMAL", "WARNING", "CRITICAL"};
                String[] technicians = {"John Kim", "Sarah Lee", "Mike Park", "Emily Chen", "David Park"};
                String[] years = {"2022", "2023", "2024", "2025"};

                for (int i = 1; i <= 100; i++) {
                    String vinNumber = String.format("KMHXX00XXXX%06d", i);
                    String chassisNumber = String.format("CH2025%03d", i);
                    String model = models[i % models.length];
                    String year = years[i % years.length];
                    String engineType = engineTypes[i % engineTypes.length];

                    // Electric cars have 0 RPM
                    int rpm = engineType.equals("Electric") ? 0 : 2700 + (i * 13) % 800;
                    int engineTemp = 70 + (i * 7) % 30;
                    int mileage = 10000 + (i * 1000) % 60000;
                    String status = statuses[i % statuses.length];
                    String technician = technicians[i % technicians.length];

                    String title = engineType + " Engine - VIN: " + vinNumber;
                    String description = "Vehicle Model: " + model + " | Year: " + year + " | Status: " + status;

                    Item item = Item.builder()
                            .title(title)
                            .description(description)
                            .vin(vinNumber)
                            .chassisNumber(chassisNumber)
                            .vehicleModel(model)
                            .modelYear(year)
                            .engineType(engineType)
                            .rpm(rpm)
                            .engineTemp(engineTemp)
                            .mileage(mileage)
                            .status(status)
                            .technician(technician)
                            .diagnosticDate(LocalDateTime.now().minusDays(i))
                            .user(adminUser)
                            .createdAt(LocalDateTime.now())
                            .updatedAt(LocalDateTime.now())
                            .build();
                    itemRepository.save(item);
                }
                System.out.println("✓ Created 100 sample diagnostic records");
            } catch (Exception e) {
                System.err.println("Error initializing data: " + e.getMessage());
                e.printStackTrace();
            }
        };
    }
}
