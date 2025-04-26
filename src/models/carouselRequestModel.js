const carouselRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  id: {
    type: String,
    default: () => uuidv4(),
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  carouselType: {
    type: String,
    enum: ['professional', 'creative', 'minimalist', 'custom'],
    default: 'professional'
  },
  content: {
    type: String
  },
  videoId: {
    type: String
  },
  videoTitle: {
    type: String
  },
  youtubeUrl: {
    type: String
  },
  files: [{
    url: String,
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number
  }],
  completedFiles: [{
    url: String,
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number
  }],
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'rejected'],
    default: 'pending'
  },
  adminNotes: {
    type: String
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  completedCarouselId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Carousel'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}); 