package com.skillverse.config;

import com.skillverse.model.Connection;
import com.skillverse.model.Message;
import com.skillverse.model.Review;
import com.skillverse.model.Skill;
import com.skillverse.model.User;
import com.skillverse.repository.ConnectionRepository;
import com.skillverse.repository.MessageRepository;
import com.skillverse.repository.ReviewRepository;
import com.skillverse.repository.SkillRepository;
import com.skillverse.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Seeds a realistic set of students the first time the database is empty.
 * Every seeded account is a real account: it can be logged into with the
 * password below and behaves exactly like a self-registered student.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);
    private static final String DEMO_PASSWORD = "password123";

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final ConnectionRepository connectionRepository;
    private final MessageRepository messageRepository;
    private final ReviewRepository reviewRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${skillverse.seed.enabled:true}")
    private boolean seedEnabled;

    public DataSeeder(UserRepository userRepository, SkillRepository skillRepository,
                      ConnectionRepository connectionRepository, MessageRepository messageRepository,
                      ReviewRepository reviewRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.connectionRepository = connectionRepository;
        this.messageRepository = messageRepository;
        this.reviewRepository = reviewRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!seedEnabled) return;
        seedSkills();
        if (userRepository.count() > 0) {
            log.info("Skill Verse: users already present, skipping student seed.");
            return;
        }
        seedStudents();
    }

    private void seedSkills() {
        if (skillRepository.count() > 0) return;
        List<Skill> catalogue = List.of(
                new Skill("Java", "Programming"),
                new Skill("Python", "Programming"),
                new Skill("C++", "Programming"),
                new Skill("JavaScript", "Programming"),
                new Skill("React", "Web Development"),
                new Skill("Node.js", "Web Development"),
                new Skill("HTML/CSS", "Web Development"),
                new Skill("Spring Boot", "Backend"),
                new Skill("MongoDB", "Database"),
                new Skill("MySQL", "Database"),
                new Skill("Data Structures", "Computer Science"),
                new Skill("Algorithms", "Computer Science"),
                new Skill("Machine Learning", "AI & Data"),
                new Skill("Data Science", "AI & Data"),
                new Skill("Cloud Computing", "Infrastructure"),
                new Skill("DevOps", "Infrastructure"),
                new Skill("Android Development", "Mobile"),
                new Skill("Flutter", "Mobile"),
                new Skill("UI/UX Design", "Design"),
                new Skill("Figma", "Design"),
                new Skill("Public Speaking", "Soft Skills"),
                new Skill("Technical Writing", "Soft Skills"),
                new Skill("Cybersecurity", "Security"),
                new Skill("Digital Marketing", "Business")
        );
        skillRepository.saveAll(catalogue);
        log.info("Skill Verse: seeded {} skills.", catalogue.size());
    }

    private void seedStudents() {
        User krish = student("Krish Patel", "krish@skillverse.com", "LNCT University", "Computer Science", "3rd Year",
                "CS student who loves backend development and mentoring juniors in DSA.", 250,
                List.of("Java", "C++", "Python", "Machine Learning"),
                List.of("React", "UI/UX Design", "Cloud Computing"));

        User aman = student("Aman Sharma", "aman@skillverse.com", "IIT Delhi", "Information Technology", "3rd Year",
                "Frontend developer building side projects with React and Tailwind.", 320,
                List.of("React", "JavaScript", "HTML/CSS", "UI/UX Design"),
                List.of("Java", "Machine Learning", "Spring Boot"));

        User priya = student("Priya Nair", "priya@skillverse.com", "NIT Trichy", "Computer Science", "4th Year",
                "Cloud enthusiast. AWS certified. Happy to explain deployment end to end.", 410,
                List.of("Cloud Computing", "DevOps", "Python", "MongoDB"),
                List.of("C++", "Machine Learning", "Public Speaking"));

        User rahul = student("Rahul Verma", "rahul@skillverse.com", "VIT Vellore", "Electronics", "2nd Year",
                "Second year student exploring app development and design.", 120,
                List.of("Android Development", "Flutter", "Figma"),
                List.of("Java", "Data Structures", "Python"));

        User sneha = student("Sneha Iyer", "sneha@skillverse.com", "BITS Pilani", "Computer Science", "3rd Year",
                "Design-first developer. I turn messy screens into clean interfaces.", 280,
                List.of("UI/UX Design", "Figma", "HTML/CSS", "Digital Marketing"),
                List.of("Python", "Machine Learning", "React"));

        User mohit = student("Mohit Gupta", "mohit@skillverse.com", "Delhi Technological University", "Computer Science", "4th Year",
                "Backend engineer intern. Spring Boot, databases and clean APIs.", 365,
                List.of("Spring Boot", "Java", "MySQL", "MongoDB"),
                List.of("Machine Learning", "Cloud Computing", "React"));

        User ananya = student("Ananya Rao", "ananya@skillverse.com", "Manipal Institute of Technology", "Data Science", "2nd Year",
                "Data science student who enjoys statistics and clear explanations.", 195,
                List.of("Data Science", "Python", "Technical Writing"),
                List.of("Java", "Algorithms", "Cloud Computing"));

        User kabir = student("Kabir Singh", "kabir@skillverse.com", "IIIT Hyderabad", "Computer Science", "3rd Year",
                "Competitive programmer. Codeforces regular. DSA mentor.", 430,
                List.of("Data Structures", "Algorithms", "C++"),
                List.of("React", "DevOps", "UI/UX Design"));

        User meera = student("Meera Joshi", "meera@skillverse.com", "Anna University", "Information Technology", "4th Year",
                "Security nerd. I run a small campus cybersecurity club.", 305,
                List.of("Cybersecurity", "Python", "Node.js"),
                List.of("Machine Learning", "Public Speaking", "Figma"));

        User arjun = student("Arjun Menon", "arjun@skillverse.com", "PES University", "Computer Science", "2nd Year",
                "Learning full stack development one project at a time.", 140,
                List.of("JavaScript", "Node.js", "Public Speaking"),
                List.of("Spring Boot", "MongoDB", "Data Structures"));

        List<User> saved = userRepository.saveAll(List.of(
                krish, aman, priya, rahul, sneha, mohit, ananya, kabir, meera, arjun));
        log.info("Skill Verse: seeded {} students (password: {}).", saved.size(), DEMO_PASSWORD);

        String krishId = saved.get(0).getId();
        String amanId = saved.get(1).getId();
        String priyaId = saved.get(2).getId();
        String rahulId = saved.get(3).getId();
        String snehaId = saved.get(4).getId();
        String mohitId = saved.get(5).getId();

        connectionRepository.saveAll(List.of(
                new Connection(krishId, amanId, Connection.Status.ACCEPTED),
                new Connection(krishId, priyaId, Connection.Status.ACCEPTED),
                new Connection(rahulId, krishId, Connection.Status.PENDING),
                new Connection(snehaId, krishId, Connection.Status.PENDING),
                new Connection(mohitId, amanId, Connection.Status.ACCEPTED)
        ));

        messageRepository.saveAll(List.of(
                new Message(amanId, krishId, "Hey! Saw you can teach Java — I'd love some help with Spring Boot."),
                new Message(krishId, amanId, "Sure! Can you help me with React hooks in return?"),
                new Message(amanId, krishId, "Deal. Free this weekend?"),
                new Message(priyaId, krishId, "I can walk you through deploying to the cloud whenever you're ready.")
        ));

        reviewRepository.saveAll(List.of(
                new Review(amanId, "Aman Sharma", krishId, 5, "Explained recursion better than any lecture. Very patient."),
                new Review(priyaId, "Priya Nair", krishId, 4, "Solid Java sessions, always well prepared."),
                new Review(krishId, "Krish Patel", amanId, 5, "Great React mentor, gave me a mini project to practise."),
                new Review(mohitId, "Mohit Gupta", priyaId, 5, "Cloud deployment finally makes sense. Thank you!")
        ));
    }

    private User student(String name, String email, String college, String branch, String year,
                         String bio, int points, List<String> teach, List<String> learn) {
        User u = new User();
        u.setName(name);
        u.setEmail(email);
        u.setPassword(passwordEncoder.encode(DEMO_PASSWORD));
        u.setCollege(college);
        u.setBranch(branch);
        u.setYear(year);
        u.setBio(bio);
        u.setSkillPoints(points);
        u.setTeachSkills(new java.util.ArrayList<>(teach));
        u.setLearnSkills(new java.util.ArrayList<>(learn));
        return u;
    }
}
