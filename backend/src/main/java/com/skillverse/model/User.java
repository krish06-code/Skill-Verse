package com.skillverse.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String email;

    private String password;
    private String college;
    private String branch;
    private String year;
    private String bio = "";
    private String profileImage;
    private int skillPoints = 0;

    /** Skill names the student can teach. */
    private List<String> teachSkills = new ArrayList<>();

    /** Skill names the student wants to learn. */
    private List<String> learnSkills = new ArrayList<>();

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getProfileImage() { return profileImage; }
    public void setProfileImage(String profileImage) { this.profileImage = profileImage; }

    public int getSkillPoints() { return skillPoints; }
    public void setSkillPoints(int skillPoints) { this.skillPoints = skillPoints; }

    public List<String> getTeachSkills() { return teachSkills; }
    public void setTeachSkills(List<String> teachSkills) { this.teachSkills = teachSkills; }

    public List<String> getLearnSkills() { return learnSkills; }
    public void setLearnSkills(List<String> learnSkills) { this.learnSkills = learnSkills; }
}
