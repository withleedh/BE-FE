package com.example.gogo.service;

import com.example.gogo.dto.ItemRequest;
import com.example.gogo.dto.ItemResponse;
import com.example.gogo.entity.Item;
import com.example.gogo.entity.User;
import com.example.gogo.repository.ItemRepository;
import com.example.gogo.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    public Page<ItemResponse> getItems(String username, String search, Pageable pageable) {
        // For diagnostic data, show all items regardless of user
        Page<Item> items;

        if (search != null && !search.isEmpty()) {
            items = itemRepository.findByTitleContainingOrDescriptionContaining(search, search, pageable);
        } else {
            items = itemRepository.findAll(pageable);
        }

        return items.map(this::mapToResponse);
    }

    public ItemResponse getItemById(String username, Long itemId) {
        // For diagnostic data, allow all users to view
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        return mapToResponse(item);
    }

    @Transactional
    public ItemResponse createItem(String username, ItemRequest request) {
        User user = getUserByUsername(username);

        Item item = Item.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .user(user)
                .build();

        Item savedItem = itemRepository.save(item);
        return mapToResponse(savedItem);
    }

    @Transactional
    public ItemResponse updateItem(String username, Long itemId, ItemRequest request) {
        User user = getUserByUsername(username);
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if (!item.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to update this item");
        }

        item.setTitle(request.getTitle());
        item.setDescription(request.getDescription());

        Item updatedItem = itemRepository.save(item);
        return mapToResponse(updatedItem);
    }

    @Transactional
    public void deleteItem(String username, Long itemId) {
        User user = getUserByUsername(username);
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if (!item.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to delete this item");
        }

        itemRepository.delete(item);
    }

    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    private ItemResponse mapToResponse(Item item) {
        return ItemResponse.builder()
                .id(item.getId())
                .title(item.getTitle())
                .description(item.getDescription())
                .vin(item.getVin())
                .chassisNumber(item.getChassisNumber())
                .vehicleModel(item.getVehicleModel())
                .modelYear(item.getModelYear())
                .rpm(item.getRpm())
                .engineTemp(item.getEngineTemp())
                .mileage(item.getMileage())
                .diagnosticDate(item.getDiagnosticDate())
                .status(item.getStatus())
                .technician(item.getTechnician())
                .engineType(item.getEngineType())
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .build();
    }
}