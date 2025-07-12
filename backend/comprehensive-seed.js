const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const USERS_FILE = path.join(__dirname, 'users.json');
const REQUESTS_FILE = path.join(__dirname, 'swap-requests.json');

const sampleUsers = [
  {
    name: "Sarah Johnson",
    email: "sarah@example.com",
    password: "password123",
    location: "San Francisco, CA",
    bio: "Full-stack developer with 5 years experience. Love teaching coding and building web applications!",
    availability: "Weekends",
    skillsOffered: ["Web Development", "React", "JavaScript", "Node.js"],
    skillsWanted: ["Graphic Design", "Photography", "Video Editing"],
    rating: 4.9,
    swapsCompleted: 5
  },
  {
    name: "Mike Chen",
    email: "mike@example.com",
    password: "password123",
    location: "New York, NY",
    bio: "Professional photographer specializing in portraits, events, and street photography.",
    availability: "Evenings",
    skillsOffered: ["Photography", "Photo Editing", "Lightroom", "Photoshop"],
    skillsWanted: ["Web Development", "Marketing", "Social Media"],
    rating: 4.8,
    swapsCompleted: 3
  },
  {
    name: "Emily Rodriguez",
    email: "emily@example.com",
    password: "password123",
    location: "Austin, TX",
    bio: "Creative designer with passion for user experience and visual storytelling. Love creating beautiful interfaces!",
    availability: "Flexible",
    skillsOffered: ["Graphic Design", "UI/UX", "Figma", "Illustration"],
    skillsWanted: ["Spanish Language", "Cooking", "Yoga"],
    rating: 5.0,
    swapsCompleted: 7
  },
  {
    name: "David Kim",
    email: "david@example.com",
    password: "password123",
    location: "Seattle, WA",
    bio: "Music teacher and performer with 10+ years of teaching experience. Passionate about sharing music!",
    availability: "Weekdays",
    skillsOffered: ["Piano", "Music Theory", "Guitar", "Composition"],
    skillsWanted: ["Programming", "Data Analysis", "Machine Learning"],
    rating: 4.7,
    swapsCompleted: 4
  },
  {
    name: "Lisa Thompson",
    email: "lisa@example.com",
    password: "password123",
    location: "Denver, CO",
    bio: "Certified yoga instructor helping people find balance and wellness through mindful movement.",
    availability: "Mornings",
    skillsOffered: ["Yoga", "Meditation", "Wellness Coaching", "Pilates"],
    skillsWanted: ["Business Strategy", "Marketing", "Public Speaking"],
    rating: 4.9,
    swapsCompleted: 6
  },
  {
    name: "Alex Parker",
    email: "alex@example.com",
    password: "password123",
    location: "Portland, OR",
    bio: "Chef and nutritionist passionate about healthy, delicious food and sustainable cooking.",
    availability: "Weekends",
    skillsOffered: ["Cooking", "Baking", "Nutrition", "Meal Planning"],
    skillsWanted: ["Photography", "Video Editing", "Social Media"],
    rating: 4.6,
    swapsCompleted: 2
  },
  {
    name: "Maria Garcia",
    email: "maria@example.com",
    password: "password123",
    location: "Miami, FL",
    bio: "Spanish language teacher and cultural exchange enthusiast. Love connecting people through language!",
    availability: "Evenings",
    skillsOffered: ["Spanish Language", "Translation", "Cultural Exchange", "ESL Teaching"],
    skillsWanted: ["Web Development", "Digital Marketing", "Content Writing"],
    rating: 4.8,
    swapsCompleted: 8
  },
  {
    name: "James Wilson",
    email: "james@example.com",
    password: "password123",
    location: "Chicago, IL",
    bio: "Data scientist and machine learning engineer. Excited to share knowledge about AI and analytics!",
    availability: "Weekends",
    skillsOffered: ["Data Analysis", "Machine Learning", "Python", "Statistics"],
    skillsWanted: ["Guitar", "Music Production", "Creative Writing"],
    rating: 4.9,
    swapsCompleted: 4
  },
  {
    name: "Sophie Anderson",
    email: "sophie@example.com",
    password: "password123",
    location: "Boston, MA",
    bio: "Professional writer and content creator. Passionate about storytelling and communication.",
    availability: "Flexible",
    skillsOffered: ["Creative Writing", "Content Creation", "Editing", "Copywriting"],
    skillsWanted: ["Web Development", "Graphic Design", "Photography"],
    rating: 4.7,
    swapsCompleted: 5
  },
  {
    name: "Ryan Martinez",
    email: "ryan@example.com",
    password: "password123",
    location: "Los Angeles, CA",
    bio: "Video editor and filmmaker. Love creating compelling visual stories and helping others learn!",
    availability: "Weekdays",
    skillsOffered: ["Video Editing", "Filmmaking", "Adobe Premiere", "Motion Graphics"],
    skillsWanted: ["Web Development", "Marketing", "Business Strategy"],
    rating: 4.8,
    swapsCompleted: 6
  },
  {
    name: "Nina Patel",
    email: "nina@example.com",
    password: "password123",
    location: "Phoenix, AZ",
    bio: "Marketing specialist and social media expert. Helping businesses grow their online presence!",
    availability: "Evenings",
    skillsOffered: ["Digital Marketing", "Social Media", "Brand Strategy", "Analytics"],
    skillsWanted: ["Web Development", "Graphic Design", "Video Editing"],
    rating: 4.9,
    swapsCompleted: 7
  },
  {
    name: "Tom O'Connor",
    email: "tom@example.com",
    password: "password123",
    location: "Dallas, TX",
    bio: "Business consultant and public speaker. Passionate about helping entrepreneurs succeed!",
    availability: "Weekends",
    skillsOffered: ["Business Strategy", "Public Speaking", "Consulting", "Leadership"],
    skillsWanted: ["Web Development", "Data Analysis", "Content Creation"],
    rating: 4.8,
    swapsCompleted: 9
  }
];

const sampleSwapRequests = [
  {
    id: "req_001",
    requesterId: "user_001",
    recipientId: "user_002",
    requesterSkill: "Web Development",
    recipientSkill: "Photography",
    message: "I'd love to learn photography! I can teach you web development in exchange.",
    status: "pending",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString() // 2 days ago
  },
  {
    id: "req_002",
    requesterId: "user_003",
    recipientId: "user_001",
    requesterSkill: "Graphic Design",
    recipientSkill: "React",
    message: "Looking to improve my design skills while helping you with React development!",
    status: "accepted",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString() // 5 days ago
  },
  {
    id: "req_003",
    requesterId: "user_004",
    recipientId: "user_005",
    requesterSkill: "Piano",
    recipientSkill: "Yoga",
    message: "Music and wellness - perfect combination! Let's swap skills.",
    status: "completed",
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString() // 10 days ago
  },
  {
    id: "req_004",
    requesterId: "user_006",
    recipientId: "user_007",
    requesterSkill: "Cooking",
    recipientSkill: "Spanish Language",
    message: "I can teach you cooking while learning Spanish!",
    status: "pending",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString() // 1 day ago
  },
  {
    id: "req_005",
    requesterId: "user_008",
    recipientId: "user_009",
    requesterSkill: "Data Analysis",
    recipientSkill: "Creative Writing",
    message: "Data meets creativity! Let's exchange skills.",
    status: "accepted",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString() // 3 days ago
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting comprehensive database seeding...');

    // Seed Users
    console.log('\n📝 Seeding users...');
    const users = [];
    
    for (let i = 0; i < sampleUsers.length; i++) {
      const userData = sampleUsers[i];
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      // Create user with unique ID
      const user = {
        id: `user_${String(i + 1).padStart(3, '0')}`,
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

      users.push(user);
      console.log(`✅ Created user: ${userData.name} (${user.id})`);
    }

    // Write users to file
    fs.writeFileSync(USERS_FILE, JSON.stringify({ users }, null, 2));
    console.log(`📁 Users saved to: ${USERS_FILE}`);

    // Seed Swap Requests
    console.log('\n🔄 Seeding swap requests...');
    
    // Update request IDs to use actual user IDs
    const updatedRequests = sampleSwapRequests.map((request, index) => ({
      ...request,
      id: `req_${String(index + 1).padStart(3, '0')}`,
      requesterId: users[parseInt(request.requesterId.split('_')[1]) - 1].id,
      recipientId: users[parseInt(request.recipientId.split('_')[1]) - 1].id
    }));

    // Write requests to file
    fs.writeFileSync(REQUESTS_FILE, JSON.stringify({ requests: updatedRequests }, null, 2));
    console.log(`📁 Swap requests saved to: ${REQUESTS_FILE}`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`📊 Created ${users.length} users and ${updatedRequests.length} swap requests`);
    console.log('\n🔗 You can now test the skill swap feature with this sample data!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

seedDatabase(); 