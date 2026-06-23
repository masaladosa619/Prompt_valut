package com.Prompt_lib.demo.Service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import com.Prompt_lib.demo.Dto.PromptRequestDto;
import com.Prompt_lib.demo.Dto.PromptResponseDto;
import com.Prompt_lib.demo.Entity.PromptEntity;
import com.Prompt_lib.demo.Exception.PromptNotFoundException;
import com.Prompt_lib.demo.Mapper.PromptMapper;
import com.Prompt_lib.demo.Repository.PromptRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor

public class PromptService {

    private final PromptRepo promptRepo;
    private final PromptMapper promptMapper;

    public PromptResponseDto createPrompt(PromptRequestDto promptRequestDto) {
        PromptEntity prompt = promptMapper.promptRequestToEntity(promptRequestDto);
        PromptEntity savedPrompt = promptRepo.save(prompt);
        PromptResponseDto EntityToDto = promptMapper.promptEntityToResponseDto(savedPrompt);
        return EntityToDto;
    }

    public Page<PromptResponseDto> getAllPrompts(int pgNo, int pageSize, String sortBy, String sortDir) {

        Sort sort = Sort.by(sortBy).ascending();
        if (sortDir != null && sortDir.equalsIgnoreCase("desc")) {
            sort = Sort.by(sortBy).descending();
        }
        PageRequest page = PageRequest.of(pgNo, pageSize, sort);
        Page<PromptEntity> listofprompts = promptRepo.findAll(page);
        Page<PromptResponseDto> responseDto = listofprompts.map(promptMapper::promptEntityToResponseDto);
        return responseDto;
    }

    public boolean updatePromptById(Long id, PromptRequestDto updatePrompt) {
        PromptEntity checkPrompt = promptRepo.findById(id)
                .orElseThrow(() -> new PromptNotFoundException("Resource with id :" + id + " does not exist"));
        PromptEntity existingpPrompt = checkPrompt;
        existingpPrompt.setContent(updatePrompt.getContent());
        existingpPrompt.setLlmModel(updatePrompt.getLlmModel());
        existingpPrompt.setTitle(updatePrompt.getTitle());
        promptRepo.save(existingpPrompt);
        return true;

    }

    public PromptResponseDto getPromptById(Long id) {
        PromptEntity promptEntity = promptRepo.findById(id)
                .orElseThrow(() -> new PromptNotFoundException("Resource with id :" + id + " does not exist"));

        PromptResponseDto promptResponse = promptMapper.promptEntityToResponseDto(promptEntity);
        return promptResponse;

    }

    public void deletePromptById(Long id) {
        if (!promptRepo.existsById(id)) {
            throw new PromptNotFoundException("Resource with id :" + id + " does not exist");
        }
        promptRepo.deleteById(id);

    }
    
    public List<PromptResponseDto> searchPromptByLlmModelAndTitle(String title, String model) {
        List<PromptResponseDto> listofResponseDtos = new ArrayList<>();

        if (title != null && model == null) {
            List<PromptEntity> searchPromptEntities = promptRepo.findByTitleContainingIgnoreCase(title);
            for (PromptEntity prompt : searchPromptEntities) {
                listofResponseDtos.add(promptMapper.promptEntityToResponseDto(prompt));
            }
            return listofResponseDtos;
        } else if (title == null && model != null) {
            List<PromptEntity> promptEntities = promptRepo.findByLlmModelContainingIgnoreCase(model);
            for (PromptEntity prompt : promptEntities) {
                listofResponseDtos.add(promptMapper.promptEntityToResponseDto(prompt));
            }
            return listofResponseDtos;
        }

        else if (title != null && model != null) {
            List<PromptEntity> prompts = promptRepo
                    .findByTitleContainingIgnoreCaseAndLlmModelContainingIgnoreCase(title, model);
            for (PromptEntity promptss : prompts) {
                listofResponseDtos.add(promptMapper.promptEntityToResponseDto(promptss));
            }
            return listofResponseDtos;
        }

        return getAllPrompts(0, 5, "id", "asc").getContent();
    }
}
