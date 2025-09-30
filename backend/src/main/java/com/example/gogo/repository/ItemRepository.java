package com.example.gogo.repository;

import com.example.gogo.entity.Item;
import com.example.gogo.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    Page<Item> findByUser(User user, Pageable pageable);

    @Query("SELECT i FROM Item i WHERE i.user = :user AND (i.title LIKE %:search% OR i.description LIKE %:search%)")
    Page<Item> findByUserAndSearch(@Param("user") User user, @Param("search") String search, Pageable pageable);

    Page<Item> findByTitleContainingOrDescriptionContaining(String titleSearch, String descriptionSearch, Pageable pageable);
}