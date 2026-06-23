package com.Prompt_lib.demo.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.Prompt_lib.demo.Entity.PromptEntity;

public interface PromptRepo extends JpaRepository<PromptEntity,Long>{
    
    List<PromptEntity> findByTitleContainingIgnoreCase(String title);

    List<PromptEntity> findByLlmModelContainingIgnoreCase(String llmodel);
    
    List<PromptEntity> findByTitleContainingIgnoreCaseAndLlmModelContainingIgnoreCase(
            String title,
            String llmModel);

}
