package com.Prompt_lib.demo.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.Prompt_lib.demo.Entity.UserEntity;
import com.Prompt_lib.demo.Type.AuthType;

import java.util.Optional;


public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findByUsername(String username);

    Optional<UserEntity> findByProviderIdAndAuthType(String providerId, AuthType authType);
}
