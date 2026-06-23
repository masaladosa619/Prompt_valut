package com.Prompt_lib.demo.Mapper;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import com.Prompt_lib.demo.Dto.PromptRequestDto;
import com.Prompt_lib.demo.Dto.PromptResponseDto;
import com.Prompt_lib.demo.Entity.PromptEntity;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class PromptMapper {

    private final ModelMapper modelMapper;

    public PromptResponseDto promptEntityToResponseDto(PromptEntity searchprompt){
        PromptResponseDto promptResponseDto = this.modelMapper.map(searchprompt, PromptResponseDto.class);
        return promptResponseDto;
    }

    public PromptEntity promptRequestToEntity(PromptRequestDto promptRequestDto){
        PromptEntity promptEntity = this.modelMapper.map(promptRequestDto, PromptEntity.class);
        return promptEntity;
    }

    



}
