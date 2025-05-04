package com.pfa.pfaproject.dto.Admin;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import org.hibernate.validator.constraints.Length;

public record RegisterDTO(
        @NotEmpty @NotBlank
        String firstName,
        @NotEmpty @NotBlank
        String lastName,
        @NotEmpty @NotBlank
        String username,
        @NotEmpty @NotBlank @Email
        String email,
        @NotEmpty @NotBlank @Length(min=8, max=20)
        String password
) {
}
