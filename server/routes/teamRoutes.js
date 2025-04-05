const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

// Protected routes (require authentication)
router.post('/', protect, teamController.createTeam);
router.get('/', protect, teamController.getUserTeams);
router.get('/:id', protect, teamController.getTeamById);
router.put('/:id', protect, teamController.updateTeam);
router.delete('/:id', protect, teamController.deleteTeam);

// Team member management
router.post('/:id/members', protect, teamController.addTeamMember);
router.delete('/:id/members/:userId', protect, teamController.removeTeamMember);
router.put('/:id/members/:userId/role', protect, teamController.updateMemberRole);

// Team invitations
router.post('/invitations', protect, teamController.createInvitation);
router.get('/invitations', protect, teamController.getUserInvitations);
router.post('/invitations/:id/accept', protect, teamController.acceptInvitation);
router.post('/invitations/:id/decline', protect, teamController.declineInvitation);

// Public invitation routes (no authentication required)
router.post('/invitations/verify-token', teamController.verifyInvitationToken);
router.post('/invitations/accept-by-token', teamController.acceptInvitationByToken);
router.post('/invitations/decline-by-token', teamController.declineInvitationByToken);

module.exports = router; 