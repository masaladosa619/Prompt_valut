package com.Prompt_lib.demo.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.Prompt_lib.demo.Entity.PromptEntity;
import com.Prompt_lib.demo.Entity.UserEntity;

public interface PromptRepo extends JpaRepository<PromptEntity,Long>{
    
    List<PromptEntity> findByTitleContainingIgnoreCase(String title);

    List<PromptEntity> findByLlmModelContainingIgnoreCase(String llmodel);
    
    List<PromptEntity> findByTitleContainingIgnoreCaseAndLlmModelContainingIgnoreCase(String title,String llmModel);

    Page<PromptEntity> findByUserEntity(UserEntity userEntity,Pageable pageable);

    List<PromptEntity> findByUserEntityAndTitleContainingIgnoreCase(UserEntity userEntity,String title);

    List<PromptEntity> findByUserEntityAndLlmModelContainingIgnoreCase(UserEntity userEntity,String llmodel);

    List<PromptEntity> findByUserEntityAndTitleContainingIgnoreCaseAndLlmModelContainingIgnoreCase(UserEntity userEntity,String title,String llmModel);

    Page<PromptEntity> findByPubliclySharedTrue(Pageable pageable);

    List<PromptEntity> findByPubliclySharedTrueAndTitleContainingIgnoreCase(String title);

    List<PromptEntity> findByPubliclySharedTrueAndLlmModelContainingIgnoreCase(String llmodel);

    List<PromptEntity> findByPubliclySharedTrueAndTitleContainingIgnoreCaseAndLlmModelContainingIgnoreCase(String title,String llmModel);

}
