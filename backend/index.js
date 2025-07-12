const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// JSON Database files
const USERS_FILE = path.join(__dirname, 'users.json');
const REQUESTS_FILE = path.join(__dirname, 'swap-requests.json');

// Initialize database files if they don't exist
function initializeDatabase() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify({ users: [] }, null, 2));
  }
  if (!fs.existsSync(REQUESTS_FILE)) {
    fs.writeFileSync(REQUESTS_FILE, JSON.stringify({ requests: [] }, null, 2));
  }
}

// Helper functions for JSON database operations
function readUsers() {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data).users || [];
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
}

function writeUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify({ users }, null, 2));
  } catch (error) {
    console.error('Error writing users:', error);
  }
}

function readRequests() {
  try {
    const data = fs.readFileSync(REQUESTS_FILE, 'utf8');
    return JSON.parse(data).requests || [];
  } catch (error) {
    console.error('Error reading requests:', error);
    return [];
  }
}

function writeRequests(requests) {
  try {
    fs.writeFileSync(REQUESTS_FILE, JSON.stringify({ requests }, null, 2));
  } catch (error) {
    console.error('Error writing requests:', error);
  }
}

// Routes
app.use('/api/auth', authRoutes);

// Get all users (for browse skills page)
app.get('/api/users', (req, res) => {
  try {
    const users = readUsers();
    // Remove sensitive information
    const publicUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      location: user.location,
      bio: user.bio,
      availability: user.availability,
      skillsOffered: user.skillsOffered,
      skillsWanted: user.skillsWanted,
      rating: user.rating,
      swapsCompleted: user.swapsCompleted,
      avatar: user.avatar
    }));
    res.json(publicUsers);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create swap request
app.post('/api/swaps/request', (req, res) => {
  try {
    const { fromUserId, toUserId, skillOffered, skillWanted, message } = req.body;
    
    const users = readUsers();
    const fromUser = users.find(u => u.id === fromUserId);
    const toUser = users.find(u => u.id === toUserId);
    
    if (!fromUser || !toUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const requests = readRequests();
    
    // Check if there's already a pending request
    const existingRequest = requests.find(r => 
      r.requesterId === fromUserId && 
      r.recipientId === toUserId && 
      r.status === 'pending'
    );

    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending request with this user' });
    }

    const newRequest = {
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      requesterId: fromUserId,
      recipientId: toUserId,
      requesterSkill: skillOffered,
      recipientSkill: skillWanted,
      message: message,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    requests.push(newRequest);
    writeRequests(requests);

    res.status(201).json({
      message: 'Swap request sent successfully',
      request: newRequest
    });
  } catch (error) {
    console.error('Create swap request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get incoming requests
app.get('/api/swaps/incoming/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const requests = readRequests();
    const users = readUsers();
    
    const incomingRequests = requests
      .filter(r => r.recipientId === userId && r.status === 'pending')
      .map(request => {
        const requester = users.find(u => u.id === request.requesterId);
        return {
          id: request.id,
          fromUser: {
            name: requester?.name || 'Unknown User',
            email: requester?.email || '',
            avatar: requester?.avatar || '/placeholder-avatar.jpg',
            rating: requester?.rating || 0
          },
          skillOffered: request.requesterSkill,
          skillWanted: request.recipientSkill,
          message: request.message,
          date: request.createdAt,
          status: request.status
        };
      });

    res.json(incomingRequests);
  } catch (error) {
    console.error('Get incoming requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get outgoing requests
app.get('/api/swaps/outgoing/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const requests = readRequests();
    const users = readUsers();
    
    const outgoingRequests = requests
      .filter(r => r.requesterId === userId)
      .map(request => {
        const recipient = users.find(u => u.id === request.recipientId);
        return {
          id: request.id,
          toUser: {
            name: recipient?.name || 'Unknown User',
            email: recipient?.email || '',
            avatar: recipient?.avatar || '/placeholder-avatar.jpg',
            rating: recipient?.rating || 0
          },
          skillOffered: request.requesterSkill,
          skillWanted: request.recipientSkill,
          message: request.message,
          date: request.createdAt,
          status: request.status
        };
      });

    res.json(outgoingRequests);
  } catch (error) {
    console.error('Get outgoing requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept swap request
app.put('/api/swaps/accept/:requestId', (req, res) => {
  try {
    const { requestId } = req.params;
    const requests = readRequests();
    
    const request = requests.find(r => r.id === requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = 'accepted';
    writeRequests(requests);

    res.json({ message: 'Request accepted successfully' });
  } catch (error) {
    console.error('Accept request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reject swap request
app.put('/api/swaps/reject/:requestId', (req, res) => {
  try {
    const { requestId } = req.params;
    const requests = readRequests();
    
    const request = requests.find(r => r.id === requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = 'rejected';
    writeRequests(requests);

    res.json({ message: 'Request rejected successfully' });
  } catch (error) {
    console.error('Reject request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Complete swap
app.put('/api/swaps/complete/:requestId', (req, res) => {
  try {
    const { requestId } = req.params;
    const requests = readRequests();
    const users = readUsers();
    
    const request = requests.find(r => r.id === requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = 'completed';
    request.completedAt = new Date().toISOString();
    writeRequests(requests);

    // Update user swap counts
    const requesterIndex = users.findIndex(u => u.id === request.requesterId);
    const recipientIndex = users.findIndex(u => u.id === request.recipientId);
    
    if (requesterIndex !== -1) {
      users[requesterIndex].swapsCompleted = (users[requesterIndex].swapsCompleted || 0) + 1;
    }
    if (recipientIndex !== -1) {
      users[recipientIndex].swapsCompleted = (users[recipientIndex].swapsCompleted || 0) + 1;
    }
    
    writeUsers(users);

    res.json({ message: 'Swap completed successfully' });
  } catch (error) {
    console.error('Complete swap error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/', (req, res) => {
  res.send('Skill Swap API is running');
});

// Initialize database and start server
initializeDatabase();
app.listen(PORT, () => {
  console.log(`🚀 Skill Swap API running on port ${PORT}`);
  console.log(`📊 Using local JSON database`);
  console.log(`🔗 API endpoints available at http://localhost:${PORT}/api`);
}); 