package com.Prompt_lib.demo.Service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.Prompt_lib.demo.Dto.UserRequestDto;
import com.Prompt_lib.demo.Dto.UserResponseDto;
import com.Prompt_lib.demo.Entity.UserEntity;
import com.Prompt_lib.demo.Mapper.PromptMapper;
import com.Prompt_lib.demo.Repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final BCryptPasswordEncoder passwordEncoder;
    private final UserRepository userRepo;
    private final PromptMapper promptMapper;

    public UserResponseDto RegisteredUser(UserRequestDto userRequestDto) {

        if (userRepo.findByUsername(userRequestDto.getUsername()).isPresent()) {
            throw new RuntimeException("User already exists");
        }
        UserEntity newUser = new UserEntity();
        newUser.setPassword(passwordEncoder.encode(userRequestDto.getPassword()));
        newUser.setUsername(userRequestDto.getUsername());
        newUser.setRoles(userRequestDto.getRoles());
        userRepo.save(newUser);

        UserResponseDto responseDto = promptMapper.userEntityToResponseDto(newUser);
        return responseDto;

    }

}
