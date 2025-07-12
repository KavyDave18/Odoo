const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const UserProfile = require('./models/UserProfile');
require('dotenv').config();

const sampleUsers = [
  {
    name: "Sarah Johnson",
    email: "sarah@example.com",
    password: "password123",
    profile: {
      location: "San Francisco, CA",
      bio: "Full-stack developer with 5 years experience. Love teaching coding!",
      availability: "Weekends",
      skillsOffered: ["Web Development", "React", "JavaScript"],
      skillsWanted: ["Graphic Design", "Photography"]
    }
  },
  {
    name: "Mike Chen",
    email: "mike@example.com",
    password: "password123",
    profile: {
      location: "New York, NY",
      bio: "Professional photographer specializing in portraits and events.",
      availability: "Evenings",
      skillsOffered: ["Photography", "Photo Editing", "Lightroom"],
      skillsWanted: ["Web Development", "Marketing"]
    }
  },
  {
    name: "Emily Rodriguez",
    email: "emily@example.com",
    password: "password123",
    profile: {
      location: "Austin, TX",
      bio: "Creative designer with passion for user experience and visual storytelling.",
      availability: "Flexible",
      skillsOffered: ["Graphic Design", "UI/UX", "Figma"],
      skillsWanted: ["Spanish Language", "Cooking"]
    }
  },
  {
    name: "David Kim",
    email: "david@example.com",
    password: "password123",
    profile: {
      location: "Seattle, WA",
      bio: "Music teacher and performer. 10+ years of teaching experience.",
      availability: "Weekdays",
      skillsOffered: ["Piano", "Music Theory", "Guitar"],
      skillsWanted: ["Programming", "Data Analysis"]
    }
  },
  {
    name: "Lisa Thompson",
    email: "lisa@example.com",
    password: "password123",
    profile: {
      location: "Denver, CO",
      bio: "Certified yoga instructor helping people find balance and wellness.",
      availability: "Mornings",
      skillsOffered: ["Yoga", "Meditation", "Wellness Coaching"],
      skillsWanted: ["Business Strategy", "Marketing"]
    }
  },
  {
    name: "Alex Parker",
    email: "alex@example.com",
    password: "password123",
    profile: {
      location: "Portland, OR",
      bio: "Chef and nutritionist passionate about healthy, delicious food.",
      availability: "Weekends",
      skillsOffered: ["Cooking", "Baking", "Nutrition"],
      skillsWanted: ["Photography", "Video Editing"]
    }
  }
];

async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    await UserProfile.deleteMany({});

    console.log('Cleared existing users');

    // Create users
    for (const userData of sampleUsers) {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Create user
      const user = new User({
        name: userData.name,
        email: userData.email,
        password: hashedPassword
      });

      await user.save();

      // Create user profile
      const userProfile = new UserProfile({
        userId: user._id,
        name: userData.name,
        email: userData.email,
        ...userData.profile
      });

      await userProfile.save();

      console.log(`Created user: ${userData.name}`);
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedUsers(); 