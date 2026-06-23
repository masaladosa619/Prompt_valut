package com.Prompt_lib.demo.Dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class PromptRequestDto {


    @Size(max = 150,message = "Size cannot be greater than 150")
    @NotBlank(message = "Title cannot be blank")
    private String title;


    @NotBlank(message = "Content cannot be blank")
    private String content;

    @NotBlank(message = "LlmModel cannot be blank")
    private String llmModel;

    
}
