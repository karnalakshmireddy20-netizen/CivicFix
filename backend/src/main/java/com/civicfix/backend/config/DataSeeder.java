package com.civicfix.backend.config;

import com.civicfix.backend.entity.Department;
import com.civicfix.backend.entity.User;
import com.civicfix.backend.repository.DepartmentRepository;
import com.civicfix.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedDepartments();
        seedUsers();
    }

    private void seedDepartments() {
        if (departmentRepository.count() == 0) {
            List<Department> departments = List.of(
                Department.builder().name("Road Maintenance")
                    .description("Handles road repairs, pothole filling, and road infrastructure").build(),
                Department.builder().name("Sanitation")
                    .description("Manages garbage collection, waste disposal, and cleanliness").build(),
                Department.builder().name("Water Supply")
                    .description("Manages water distribution, leakage repairs, and supply issues").build(),
                Department.builder().name("Electrical Department")
                    .description("Handles streetlights, electrical infrastructure, and power issues").build(),
                Department.builder().name("Drainage Department")
                    .description("Manages drainage systems, flood prevention, and sewage").build(),
                Department.builder().name("Public Works")
                    .description("Handles public property maintenance and infrastructure").build()
            );
            departmentRepository.saveAll(departments);
            logger.info("Seeded {} departments", departments.size());
        }
    }

    private void seedUsers() {
        // Admin user
        if (!userRepository.existsByEmail("admin@civicfix.com")) {
            User admin = User.builder()
                    .name("Admin User")
                    .email("admin@civicfix.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .phone("9000000001")
                    .role(User.Role.ADMIN)
                    .build();
            userRepository.save(admin);
            logger.info("Seeded admin user: admin@civicfix.com");
        }

        // Demo citizen
        if (!userRepository.existsByEmail("citizen@civicfix.com")) {
            User citizen = User.builder()
                    .name("Rahul Sharma")
                    .email("citizen@civicfix.com")
                    .password(passwordEncoder.encode("Citizen@123"))
                    .phone("9000000002")
                    .role(User.Role.CITIZEN)
                    .build();
            userRepository.save(citizen);
            logger.info("Seeded citizen user: citizen@civicfix.com");
        }
    }
}
