package com.pfa.pfaproject.dto.Admin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

public record LoginDTO(
        @NotEmpty(message = "email or username must not be empty")@NotBlank
        String usernameOrEmail,
        @NotEmpty(message = "password must not bbe empty")@NotBlank
        String password
) {
}
