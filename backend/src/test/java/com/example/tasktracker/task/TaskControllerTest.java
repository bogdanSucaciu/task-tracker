package com.example.tasktracker.task;

import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class TaskControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void filtersTasksByStatusForCurrentUser() throws Exception {
        JsonNode auth = register("tasks@example.com");
        String token = auth.get("token").asText();
        long userId = auth.get("userId").asLong();

        createTask(token, userId, "Draft API", "TODO");
        createTask(token, userId, "Ship API", "DONE");

        mockMvc.perform(get("/api/tasks")
                        .param("status", "DONE")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title").value("Ship API"))
                .andExpect(jsonPath("$[0].status").value("DONE"));
    }

    @Test
    void defaultsPriorityToMediumWhenOmitted() throws Exception {
        JsonNode auth = register("priority-default@example.com");
        String token = auth.get("token").asText();
        long userId = auth.get("userId").asLong();

        mockMvc.perform(post("/api/tasks")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "No priority",
                                  "status": "TODO",
                                  "assignedUserId": %d
                                }
                                """.formatted(userId)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.priority").value("MEDIUM"));
    }

    @Test
    void roundTripsPriorityOnCreateAndUpdate() throws Exception {
        JsonNode auth = register("priority-roundtrip@example.com");
        String token = auth.get("token").asText();
        long userId = auth.get("userId").asLong();

        String created = mockMvc.perform(post("/api/tasks")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Fix login 500 error",
                                  "status": "TODO",
                                  "priority": "HIGH",
                                  "assignedUserId": %d
                                }
                                """.formatted(userId)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.priority").value("HIGH"))
                .andReturn().getResponse().getContentAsString();
        long taskId = objectMapper.readTree(created).get("id").asLong();

        mockMvc.perform(put("/api/tasks/" + taskId)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Fix login 500 error",
                                  "status": "IN_PROGRESS",
                                  "priority": "LOW",
                                  "assignedUserId": %d
                                }
                                """.formatted(userId)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.priority").value("LOW"));
    }

    @Test
    void rejectsInvalidPriorityWithBadRequest() throws Exception {
        JsonNode auth = register("priority-invalid@example.com");
        String token = auth.get("token").asText();
        long userId = auth.get("userId").asLong();

        mockMvc.perform(post("/api/tasks")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "Bad priority",
                                  "status": "TODO",
                                  "priority": "URGENT",
                                  "assignedUserId": %d
                                }
                                """.formatted(userId)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void filtersTasksByPriorityAndComposesWithStatus() throws Exception {
        JsonNode auth = register("priority-filter@example.com");
        String token = auth.get("token").asText();
        long userId = auth.get("userId").asLong();

        createTask(token, userId, "High todo", "TODO", "HIGH");
        createTask(token, userId, "Low todo", "TODO", "LOW");
        createTask(token, userId, "High done", "DONE", "HIGH");

        mockMvc.perform(get("/api/tasks")
                        .param("priority", "HIGH")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));

        mockMvc.perform(get("/api/tasks")
                        .param("status", "TODO")
                        .param("priority", "HIGH")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title").value("High todo"));
    }

    @Test
    void sortsTasksByPriorityHighToLow() throws Exception {
        JsonNode auth = register("priority-sort@example.com");
        String token = auth.get("token").asText();
        long userId = auth.get("userId").asLong();

        createTask(token, userId, "Low one", "TODO", "LOW");
        createTask(token, userId, "High one", "TODO", "HIGH");
        createTask(token, userId, "Medium one", "TODO", "MEDIUM");

        mockMvc.perform(get("/api/tasks")
                        .param("sort", "priority")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)))
                .andExpect(jsonPath("$[*].priority").value(contains("HIGH", "MEDIUM", "LOW")));
    }

    private JsonNode register(String email) throws Exception {
        String response = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "displayName": "Task Owner",
                                  "email": "%s",
                                  "password": "password123"
                                }
                                """.formatted(email)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString();

        return objectMapper.readTree(response);
    }

    private void createTask(String token, long assignedUserId, String title, String status) throws Exception {
        mockMvc.perform(post("/api/tasks")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "%s",
                                  "description": "Test task",
                                  "status": "%s",
                                  "assignedUserId": %d
                                }
                                """.formatted(title, status, assignedUserId)))
                .andExpect(status().isCreated());
    }

    private void createTask(String token, long assignedUserId, String title, String status, String priority)
            throws Exception {
        mockMvc.perform(post("/api/tasks")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "title": "%s",
                                  "description": "Test task",
                                  "status": "%s",
                                  "priority": "%s",
                                  "assignedUserId": %d
                                }
                                """.formatted(title, status, priority, assignedUserId)))
                .andExpect(status().isCreated());
    }
}
