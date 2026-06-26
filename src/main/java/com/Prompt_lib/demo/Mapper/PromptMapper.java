package com.Prompt_lib.demo.Mapper;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import com.Prompt_lib.demo.Dto.PromptRequestDto;
import com.Prompt_lib.demo.Dto.PromptResponseDto;
import com.Prompt_lib.demo.Dto.UserRequestDto;
import com.Prompt_lib.demo.Dto.UserResponseDto;
import com.Prompt_lib.demo.Entity.PromptEntity;
import com.Prompt_lib.demo.Entity.UserEntity;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class PromptMapper {

    private final ModelMapper modelMapper;

    public UserResponseDto userEntityToResponseDto(UserEntity userEntity){
        UserResponseDto UserResponseDto = this.modelMapper.map(userEntity, UserResponseDto.class);
        return UserResponseDto;
    }

    public UserEntity UserRequestToEntity(UserRequestDto UserRequestDto){
        UserEntity userEntity = this.modelMapper.map(UserRequestDto, UserEntity.class);
        return userEntity;
    }

    public PromptResponseDto promptEntityToResponseDto(PromptEntity searchprompt) {
        PromptResponseDto promptResponseDto = this.modelMapper.map(searchprompt, PromptResponseDto.class);
        return promptResponseDto;
    }

    public PromptEntity promptRequestToEntity(PromptRequestDto promptRequestDto) {
        PromptEntity promptEntity = this.modelMapper.map(promptRequestDto, PromptEntity.class);
        return promptEntity;
    }

    



}
