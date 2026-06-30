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
import com.Prompt_lib.demo.Entity.UserEntity;
import com.Prompt_lib.demo.Exception.PromptNotFoundException;
import com.Prompt_lib.demo.Mapper.PromptMapper;
import com.Prompt_lib.demo.Repository.PromptRepo;
import com.Prompt_lib.demo.Repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor

public class PromptService {

    private final PromptRepo promptRepo;
    private final PromptMapper promptMapper;
    private final UserRepository userRepository;

    public PromptResponseDto createPrompt(PromptRequestDto promptRequestDto) {
        // Get currently logged-in user's username
        String username = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getName();

        UserEntity currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new org.springframework.security.core.userdetails.UsernameNotFoundException(
                        "User not found"));

        PromptEntity prompt = promptMapper.promptRequestToEntity(promptRequestDto);
        
        prompt.setPubliclyShared(promptRequestDto.isPubliclyShared());
        prompt.setUserEntity(currentUser);

        PromptEntity savedPrompt = promptRepo.save(prompt);

        PromptResponseDto EntityToDto = promptMapper.promptEntityToResponseDto(savedPrompt);
        return EntityToDto;
    }

    public Page<PromptResponseDto> getAllPrompts(int pgNo, int pageSize, String sortBy, String sortDir) {

        String username = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getName();
        UserEntity currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new org.springframework.security.core.userdetails.UsernameNotFoundException(
                        "User not found"));

        Sort sort = Sort.by(sortBy).ascending();
        if (sortDir != null && sortDir.equalsIgnoreCase("desc")) {
            sort = Sort.by(sortBy).descending();
        }
        PageRequest page = PageRequest.of(pgNo, pageSize, sort);
        Page<PromptEntity> listofprompts = promptRepo.findByUserEntity(currentUser, page);
        Page<PromptResponseDto> responseDto = listofprompts.map(promptMapper::promptEntityToResponseDto);
        return responseDto;
    }

    public PromptResponseDto updatePromptById(Long id, PromptRequestDto updatePrompt) {
        PromptEntity checkPrompt = promptRepo.findById(id)
                .orElseThrow(() -> new PromptNotFoundException("Resource with id :" + id + " does not exist"));
        PromptEntity existingpPrompt = checkPrompt;
        existingpPrompt.setContent(updatePrompt.getContent());
        existingpPrompt.setLlmModel(updatePrompt.getLlmModel());
        existingpPrompt.setTitle(updatePrompt.getTitle());
        existingpPrompt.setPubliclyShared(updatePrompt.isPubliclyShared());
        promptRepo.save(existingpPrompt);
        PromptResponseDto responseDto = promptMapper.promptEntityToResponseDto(existingpPrompt);
        return responseDto;

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

        String username = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getName();
        UserEntity currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new org.springframework.security.core.userdetails.UsernameNotFoundException(
                        "User not found"));

        if (title != null && model == null) {
            List<PromptEntity> searchPromptEntities = promptRepo
                    .findByUserEntityAndTitleContainingIgnoreCase(currentUser, title);
            for (PromptEntity prompt : searchPromptEntities) {
                listofResponseDtos.add(promptMapper.promptEntityToResponseDto(prompt));
            }
            return listofResponseDtos;
        } else if (title == null && model != null) {
            List<PromptEntity> promptEntities = promptRepo.findByUserEntityAndLlmModelContainingIgnoreCase(currentUser,
                    model);
            for (PromptEntity prompt : promptEntities) {
                listofResponseDtos.add(promptMapper.promptEntityToResponseDto(prompt));
            }
            return listofResponseDtos;
        }

        else if (title != null && model != null) {
            List<PromptEntity> prompts = promptRepo
                    .findByUserEntityAndTitleContainingIgnoreCaseAndLlmModelContainingIgnoreCase(currentUser, title,
                            model);
            for (PromptEntity promptss : prompts) {
                listofResponseDtos.add(promptMapper.promptEntityToResponseDto(promptss));
            }
            return listofResponseDtos;
        }

        return getAllPrompts(0, 5, "id", "asc").getContent();
    }



    public Page<PromptResponseDto> getCommunityPrompts(int pgNo, int pageSize, String sortBy, String sortDir) {
        Sort sort = Sort.by(sortBy).ascending();
        if (sortDir != null && sortDir.equalsIgnoreCase("desc")) {
            sort = Sort.by(sortBy).descending();
        }
        PageRequest page = PageRequest.of(pgNo, pageSize, sort);
        Page<PromptEntity> listofprompts = promptRepo.findByPubliclySharedTrue(page);
        Page<PromptResponseDto> responseDto = listofprompts.map(promptMapper::promptEntityToResponseDto);
        return responseDto;
    }



    // Community Prompts Search 
    public List<PromptResponseDto> searchCommunityPrompts(String title, String model) {
        List<PromptResponseDto> listofResponseDtos = new ArrayList<>();

        if (title != null && model == null) {
            List<PromptEntity> searchPromptEntities = promptRepo.findByPubliclySharedTrueAndTitleContainingIgnoreCase(title);
            for (PromptEntity prompt : searchPromptEntities) {
                listofResponseDtos.add(promptMapper.promptEntityToResponseDto(prompt));
            }
            return listofResponseDtos;
        } else if (title == null && model != null) {
            List<PromptEntity> promptEntities = promptRepo.findByPubliclySharedTrueAndLlmModelContainingIgnoreCase(model);
            for (PromptEntity prompt : promptEntities) {
                listofResponseDtos.add(promptMapper.promptEntityToResponseDto(prompt));
            }
            return listofResponseDtos;
        } else if (title != null && model != null) {
            List<PromptEntity> prompts = promptRepo
                    .findByPubliclySharedTrueAndTitleContainingIgnoreCaseAndLlmModelContainingIgnoreCase(title, model);
            for (PromptEntity promptss : prompts) {
                listofResponseDtos.add(promptMapper.promptEntityToResponseDto(promptss));
            }
            return listofResponseDtos;
        }
        return getCommunityPrompts(0, 5, "id", "asc").getContent();
    }

}
