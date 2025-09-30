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

                // Create sample diagnostic records
                String[][] diagnostics = {
                    {"KMHXX00XXXX000001", "CH2025001", "Sonata", "2024", "Theta", "3200", "85", "45000", "NORMAL", "John Kim"},
                    {"KMHXX00XXXX000002", "CH2025002", "Tucson", "2024", "Smartstream", "2800", "78", "32000", "WARNING", "Sarah Lee"},
                    {"KMHXX00XXXX000003", "CH2025003", "Santa Fe", "2023", "Smartstream", "3100", "92", "58000", "CRITICAL", "Mike Park"},
                    {"KMHXX00XXXX000004", "CH2025004", "Elantra", "2024", "Smartstream", "2950", "82", "25000", "NORMAL", "John Kim"},
                    {"KMHXX00XXXX000005", "CH2025005", "Kona", "2023", "Gamma", "3300", "88", "41000", "WARNING", "Sarah Lee"},
                    {"KMHXX00XXXX000006", "CH2025006", "Palisade", "2024", "Theta", "2700", "75", "18000", "NORMAL", "Mike Park"},
                    {"KMHXX00XXXX000007", "CH2025007", "Ioniq 5", "2024", "Electric", "0", "45", "12000", "NORMAL", "John Kim"},
                    {"KMHXX00XXXX000008", "CH2025008", "Genesis G80", "2023", "Theta", "3400", "90", "52000", "WARNING", "Sarah Lee"},
                    {"KMHXX00XXXX000009", "CH2025009", "Venue", "2024", "Gamma", "3000", "80", "28000", "NORMAL", "Mike Park"},
                    {"KMHXX00XXXX000010", "CH2025010", "Staria", "2023", "Smartstream", "2900", "86", "38000", "NORMAL", "John Kim"}
                };

                for (int i = 0; i < diagnostics.length; i++) {
                    String[] data = diagnostics[i];
                    String engineType = data[4];
                    String title = engineType + " Engine - VIN: " + data[0];
                    String description = "Vehicle Model: " + data[2] + " | Year: " + data[3] + " | Status: " + data[8];

                    Item item = Item.builder()
                            .title(title)
                            .description(description)
                            .vin(data[0])
                            .chassisNumber(data[1])
                            .vehicleModel(data[2])
                            .modelYear(data[3])
                            .engineType(data[4])
                            .rpm(Integer.parseInt(data[5]))
                            .engineTemp(Integer.parseInt(data[6]))
                            .mileage(Integer.parseInt(data[7]))
                            .status(data[8])
                            .technician(data[9])
                            .diagnosticDate(LocalDateTime.now().minusDays(i))
                            .user(adminUser)
                            .createdAt(LocalDateTime.now())
                            .updatedAt(LocalDateTime.now())
                            .build();
                    itemRepository.save(item);
                }
                System.out.println("✓ Created 10 sample diagnostic records");
            } catch (Exception e) {
                System.err.println("Error initializing data: " + e.getMessage());
                e.printStackTrace();
            }
        };
    }
}
