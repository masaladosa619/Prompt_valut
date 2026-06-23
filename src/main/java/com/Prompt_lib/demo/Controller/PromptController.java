package com.Prompt_lib.demo.Controller;

import com.Prompt_lib.demo.Service.PromptService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Prompt_lib.demo.Dto.PromptRequestDto;
import com.Prompt_lib.demo.Dto.PromptResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/prompts")
public class PromptController {

    private final PromptService promptService;

    @PostMapping
    public ResponseEntity<?> createPrompt(@RequestBody @Valid PromptRequestDto createPrompt) {
        PromptResponseDto savedPrompt = promptService.createPrompt(createPrompt);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPrompt);
    }

    @GetMapping
    public ResponseEntity<?> getAllPrompts(@RequestParam(defaultValue = "2", required = false) int pageSize,
            @RequestParam(defaultValue = "0", required = false) int pageNo,
            @RequestParam(defaultValue = "id", required = false) String sortBy,
            @RequestParam(required = false,defaultValue = "asc") String sortDir) {
        Page<PromptResponseDto> prompts = promptService.getAllPrompts(pageNo, pageSize, sortBy, sortDir);
        return ResponseEntity.ok(prompts);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePromptById(@PathVariable Long id) {
        promptService.deletePromptById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPromptById(@PathVariable Long id) {
        PromptResponseDto getprompt = promptService.getPromptById(id);
        return ResponseEntity.ok(getprompt);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePromptById(@PathVariable Long id,
            @RequestBody @Valid PromptRequestDto updatePrompt) {
        promptService.updatePromptById(id, updatePrompt);
        return ResponseEntity.ok("Prompt has been updated Successfully");
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchPromptByTitleandModel(@RequestParam(required = false) String title,
            @RequestParam(required = false) String model) {
        List<PromptResponseDto> ResponseDtos = promptService.searchPromptByLlmModelAndTitle(title, model);
        return ResponseEntity.ok(ResponseDtos);
    }

}
