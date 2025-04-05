const Team = require('../models/Team');
const TeamInvitation = require('../models/TeamInvitation');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// ... other controller functions ...

// @desc    Verify invitation token
// @route   POST /api/teams/invitations/verify-token
// @access  Public
const verifyInvitationToken = asyncHandler(async (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    res.status(400);
    throw new Error('Invitation token is required');
  }
  
  try {
    // Verify the token signature
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if invitation still exists in database
    const invitation = await TeamInvitation.findOne({ 
      _id: decoded.invitationId,
      status: 'pending'
    }).populate('teamId', 'name');
    
    if (!invitation) {
      res.status(404);
      throw new Error('Invitation not found or already processed');
    }
    
    // Return invitation details
    res.status(200).json({
      success: true,
      data: {
        id: invitation._id,
        teamId: invitation.teamId._id,
        teamName: invitation.teamId.name,
        email: invitation.email,
        role: invitation.role,
        createdAt: invitation.createdAt
      }
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      res.status(400);
      throw new Error('Invalid or expired invitation token');
    }
    
    throw error;
  }
});

// @desc    Accept invitation using token (for email links)
// @route   POST /api/teams/invitations/accept-by-token
// @access  Public
const acceptInvitationByToken = asyncHandler(async (req, res) => {
  const { token, email } = req.body;
  
  if (!token) {
    res.status(400);
    throw new Error('Invitation token is required');
  }
  
  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the invitation
    const invitation = await TeamInvitation.findOne({
      _id: decoded.invitationId,
      email: email,
      status: 'pending'
    }).populate('teamId');
    
    if (!invitation) {
      res.status(404);
      throw new Error('Invitation not found or already processed');
    }
    
    // Check if user is authenticated (using token in header)
    let userId;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        // Get token from header
        const authToken = req.headers.authorization.split(' ')[1];
        
        // Verify token
        const authDecoded = jwt.verify(authToken, process.env.JWT_SECRET);
        
        // Get user from the token
        userId = authDecoded.id;
      } catch (error) {
        // If token verification fails, user isn't authenticated
        userId = null;
      }
    }
    
    // If user is authenticated, add them to the team
    if (userId) {
      const user = await User.findById(userId);
      
      if (!user) {
        res.status(404);
        throw new Error('User not found');
      }
      
      // Check if user's email matches invitation email
      if (user.email !== invitation.email) {
        res.status(400);
        throw new Error('You must accept this invitation with the same account it was sent to');
      }
      
      // Add user to team
      const team = invitation.teamId;
      
      // Check if user is already a team member
      const isAlreadyMember = team.members.some(member => 
        member.user.toString() === userId.toString()
      );
      
      if (!isAlreadyMember) {
        team.members.push({
          user: userId,
          role: invitation.role,
          joinedAt: new Date()
        });
        
        await team.save();
      }
      
      // Update invitation status
      invitation.status = 'accepted';
      await invitation.save();
      
      res.status(200).json({
        success: true,
        data: {
          message: 'Invitation accepted successfully',
          teamId: team._id,
          teamName: team.name
        }
      });
    } else {
      // If user is not authenticated, just mark the invitation as accepted
      // They'll need to sign up/login to actually join the team
      invitation.status = 'accepted';
      await invitation.save();
      
      res.status(200).json({
        success: true,
        data: {
          message: 'Invitation accepted successfully, please sign in to access the team',
          requiresSignIn: true,
          teamName: invitation.teamId.name
        }
      });
    }
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      res.status(400);
      throw new Error('Invalid or expired invitation token');
    }
    
    throw error;
  }
});

// @desc    Decline invitation using token (for email links)
// @route   POST /api/teams/invitations/decline-by-token
// @access  Public
const declineInvitationByToken = asyncHandler(async (req, res) => {
  const { token, email } = req.body;
  
  if (!token) {
    res.status(400);
    throw new Error('Invitation token is required');
  }
  
  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the invitation
    const invitation = await TeamInvitation.findOne({
      _id: decoded.invitationId,
      email: email,
      status: 'pending'
    });
    
    if (!invitation) {
      res.status(404);
      throw new Error('Invitation not found or already processed');
    }
    
    // Update invitation status
    invitation.status = 'declined';
    await invitation.save();
    
    res.status(200).json({
      success: true,
      data: {
        message: 'Invitation declined successfully'
      }
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      res.status(400);
      throw new Error('Invalid or expired invitation token');
    }
    
    throw error;
  }
});

module.exports = {
  // ... other exports ...
  verifyInvitationToken,
  acceptInvitationByToken,
  declineInvitationByToken
}; 