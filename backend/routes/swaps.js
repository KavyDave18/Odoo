const express = require('express');
const SwapRequest = require('../models/SwapRequest');
const UserProfile = require('../models/UserProfile');
const User = require('../models/User');

const router = express.Router();

// Create a new swap request
router.post('/request', async (req, res) => {
  try {
    const { fromUserId, toUserId, skillOffered, skillWanted, message } = req.body;

    // Check if users exist
    const fromUser = await User.findById(fromUserId);
    const toUser = await User.findById(toUserId);
    
    if (!fromUser || !toUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if there's already a pending request between these users
    const existingRequest = await SwapRequest.findOne({
      fromUser: fromUserId,
      toUser: toUserId,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending request with this user' });
    }

    const swapRequest = new SwapRequest({
      fromUser: fromUserId,
      toUser: toUserId,
      skillOffered,
      skillWanted,
      message
    });

    await swapRequest.save();

    res.status(201).json({
      message: 'Swap request sent successfully',
      request: swapRequest
    });
  } catch (error) {
    console.error('Create swap request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get incoming requests for a user
router.get('/incoming/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const requests = await SwapRequest.find({ 
      toUser: userId, 
      status: 'pending' 
    }).populate('fromUser', 'name email');

    const requestsWithProfiles = await Promise.all(
      requests.map(async (request) => {
        const profile = await UserProfile.findOne({ userId: request.fromUser._id });
        return {
          id: request._id,
          fromUser: {
            name: request.fromUser.name,
            email: request.fromUser.email,
            avatar: profile?.avatar || '/placeholder-avatar.jpg',
            rating: profile?.rating || 0
          },
          skillOffered: request.skillOffered,
          skillWanted: request.skillWanted,
          message: request.message,
          date: request.createdAt,
          status: request.status
        };
      })
    );

    res.json(requestsWithProfiles);
  } catch (error) {
    console.error('Get incoming requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get outgoing requests for a user
router.get('/outgoing/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const requests = await SwapRequest.find({ 
      fromUser: userId 
    }).populate('toUser', 'name email');

    const requestsWithProfiles = await Promise.all(
      requests.map(async (request) => {
        const profile = await UserProfile.findOne({ userId: request.toUser._id });
        return {
          id: request._id,
          toUser: {
            name: request.toUser.name,
            email: request.toUser.email,
            avatar: profile?.avatar || '/placeholder-avatar.jpg',
            rating: profile?.rating || 0
          },
          skillOffered: request.skillOffered,
          skillWanted: request.skillWanted,
          message: request.message,
          date: request.createdAt,
          status: request.status
        };
      })
    );

    res.json(requestsWithProfiles);
  } catch (error) {
    console.error('Get outgoing requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept a swap request
router.put('/accept/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    
    const request = await SwapRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = 'accepted';
    await request.save();

    res.json({ message: 'Request accepted successfully' });
  } catch (error) {
    console.error('Accept request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reject a swap request
router.put('/reject/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    
    const request = await SwapRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = 'rejected';
    await request.save();

    res.json({ message: 'Request rejected successfully' });
  } catch (error) {
    console.error('Reject request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Complete a swap
router.put('/complete/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    
    const request = await SwapRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = 'completed';
    request.completedAt = new Date();
    await request.save();

    // Update user profiles with completed swaps
    await UserProfile.findOneAndUpdate(
      { userId: request.fromUser },
      { $inc: { swapsCompleted: 1 } }
    );
    await UserProfile.findOneAndUpdate(
      { userId: request.toUser },
      { $inc: { swapsCompleted: 1 } }
    );

    res.json({ message: 'Swap completed successfully' });
  } catch (error) {
    console.error('Complete swap error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Rate a completed swap
router.post('/rate/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    const { userId, rating, feedback } = req.body;
    
    const request = await SwapRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'completed') {
      return res.status(400).json({ message: 'Can only rate completed swaps' });
    }

    // Determine which user is rating
    const isFromUser = request.fromUser.toString() === userId;
    const ratingField = isFromUser ? 'fromUser' : 'toUser';

    request.rating[ratingField] = {
      rating,
      feedback,
      ratedAt: new Date()
    };

    await request.save();

    // Update user's average rating
    const userProfile = await UserProfile.findOne({ userId });
    if (userProfile) {
      const allRatings = await SwapRequest.find({
        $or: [
          { fromUser: userId, 'rating.fromUser.rating': { $exists: true } },
          { toUser: userId, 'rating.toUser.rating': { $exists: true } }
        ]
      });

      const ratings = allRatings.map(req => {
        if (req.fromUser.toString() === userId) return req.rating.fromUser?.rating;
        if (req.toUser.toString() === userId) return req.rating.toUser?.rating;
        return null;
      }).filter(r => r !== null && r !== undefined);

      if (ratings.length > 0) {
        const averageRating = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
        userProfile.rating = Math.round(averageRating * 10) / 10;
        userProfile.totalRatings = ratings.length;
        await userProfile.save();
      }
    }

    res.json({ message: 'Rating submitted successfully' });
  } catch (error) {
    console.error('Rate swap error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users for browsing
router.get('/users', async (req, res) => {
  try {
    // Try MongoDB first
    try {
      const profiles = await UserProfile.find({ isPublic: true });
      
      const users = profiles.map(profile => ({
        id: profile.userId,
        name: profile.name,
        email: profile.email,
        avatar: profile.avatar,
        location: profile.location,
        rating: profile.rating,
        skillsOffered: profile.skillsOffered,
        skillsWanted: profile.skillsWanted,
        availability: profile.availability,
        bio: profile.bio,
        swapsCompleted: profile.swapsCompleted
      }));

      res.json(users);
    } catch (mongoError) {
      // Fallback to local JSON database
      const { readDB } = require('../simple-db');
      const db = readDB();
      
      const users = db.users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || "/placeholder-avatar.jpg",
        location: user.location || "",
        rating: user.rating || 0,
        skillsOffered: user.skillsOffered || [],
        skillsWanted: user.skillsWanted || [],
        availability: user.availability || "Flexible",
        bio: user.bio || "",
        swapsCompleted: user.swapsCompleted || 0
      }));

      res.json(users);
    }
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 