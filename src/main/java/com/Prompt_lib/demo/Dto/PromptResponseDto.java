package com.Prompt_lib.demo.Dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PromptResponseDto {
    
    private Long id;
    private String title;
    private String content;
    private String llmModel;
    private boolean publiclyShared;
}
