const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_FILE = path.join(__dirname, 'users.json');

const sampleUsers = [
  {
    name: "Sarah Johnson",
    email: "sarah@example.com",
    password: "password123",
    location: "San Francisco, CA",
    bio: "Full-stack developer with 5 years experience. Love teaching coding!",
    availability: "Weekends",
    skillsOffered: ["Web Development", "React", "JavaScript"],
    skillsWanted: ["Graphic Design", "Photography"],
    rating: 4.9,
    swapsCompleted: 5
  },
  {
    name: "Mike Chen",
    email: "mike@example.com",
    password: "password123",
    location: "New York, NY",
    bio: "Professional photographer specializing in portraits and events.",
    availability: "Evenings",
    skillsOffered: ["Photography", "Photo Editing", "Lightroom"],
    skillsWanted: ["Web Development", "Marketing"],
    rating: 4.8,
    swapsCompleted: 3
  },
  {
    name: "Emily Rodriguez",
    email: "emily@example.com",
    password: "password123",
    location: "Austin, TX",
    bio: "Creative designer with passion for user experience and visual storytelling.",
    availability: "Flexible",
    skillsOffered: ["Graphic Design", "UI/UX", "Figma"],
    skillsWanted: ["Spanish Language", "Cooking"],
    rating: 5.0,
    swapsCompleted: 7
  },
  {
    name: "David Kim",
    email: "david@example.com",
    password: "password123",
    location: "Seattle, WA",
    bio: "Music teacher and performer. 10+ years of teaching experience.",
    availability: "Weekdays",
    skillsOffered: ["Piano", "Music Theory", "Guitar"],
    skillsWanted: ["Programming", "Data Analysis"],
    rating: 4.7,
    swapsCompleted: 4
  },
  {
    name: "Lisa Thompson",
    email: "lisa@example.com",
    password: "password123",
    location: "Denver, CO",
    bio: "Certified yoga instructor helping people find balance and wellness.",
    availability: "Mornings",
    skillsOffered: ["Yoga", "Meditation", "Wellness Coaching"],
    skillsWanted: ["Business Strategy", "Marketing"],
    rating: 4.9,
    swapsCompleted: 6
  },
  {
    name: "Alex Parker",
    email: "alex@example.com",
    password: "password123",
    location: "Portland, OR",
    bio: "Chef and nutritionist passionate about healthy, delicious food.",
    availability: "Weekends",
    skillsOffered: ["Cooking", "Baking", "Nutrition"],
    skillsWanted: ["Photography", "Video Editing"],
    rating: 4.6,
    swapsCompleted: 2
  }
];

async function seedUsers() {
  try {
    console.log('Seeding users...');

    // Initialize database file
    const db = { users: [] };

    // Create users
    for (const userData of sampleUsers) {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Create user
      const user = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        location: userData.location,
        bio: userData.bio,
        availability: userData.availability,
        skillsOffered: userData.skillsOffered,
        skillsWanted: userData.skillsWanted,
        rating: userData.rating,
        swapsCompleted: userData.swapsCompleted,
        avatar: "/placeholder-avatar.jpg",
        createdAt: new Date().toISOString()
      };

      db.users.push(user);
      console.log(`Created user: ${userData.name}`);
    }

    // Write to file
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));

    console.log('Database seeded successfully!');
    console.log(`Users file created at: ${DB_FILE}`);
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seedUsers(); 