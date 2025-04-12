# Twitter Integration Guide

This document explains how to use the Twitter integration in this application.

## Overview

The Twitter integration allows users to:

1. Search for Twitter usernames or profiles
2. View tweets, threads, and media
3. Filter by content type (regular tweets, threads, long tweets)
4. Select content to save
5. View and manage saved content

## Setup

1. Copy `.env.example` to `.env.local`
2. Get a RapidAPI key:
   - Sign up at [RapidAPI](https://rapidapi.com/)
   - Subscribe to a Twitter API service like [Twitter API by RapidAPI](https://rapidapi.com/omarmhaimdat/api/twitter154/)
   - Copy your API key
3. Add your API key to `.env.local`:
   ```
   RAPID_API_KEY=your_rapidapi_key_here
   ```

## Components

The integration consists of several components:

- `TwitterSearch`: Handles searching by username/URL
- `TwitterCategories`: Filters content by type
- `TweetCard`: Displays individual tweets
- `TweetThread`: Displays thread of connected tweets
- `TwitterPagination`: Handles pagination
- `TwitterContent`: Main component that integrates all others

## Usage

### Basic Usage

```jsx
import { TwitterContent } from '@/components/twitter';

export default function MyPage() {
  return (
    <div>
      <h1>Twitter Explorer</h1>
      <TwitterContent />
    </div>
  );
}
```

### With Custom Save Handler

```jsx
import { TwitterContent } from '@/components/twitter';
import { Tweet, Thread } from '@/utils/types';

export default function MyPage() {
  const handleSave = (items: (Tweet | Thread)[]) => {
    console.log('Saving items:', items);
    // Custom save logic
  };
  
  return (
    <div>
      <h1>Twitter Explorer</h1>
      <TwitterContent 
        onSaveSelected={handleSave}
        allowMultiSelect={true}
      />
    </div>
  );
}
```

## API Endpoints

The integration includes several API endpoints:

- `GET /api/twitter/user/[username]` - Fetch tweets for a user
- `POST /api/twitter/save` - Save selected tweets/threads
- `GET /api/twitter/saved` - Get saved tweets/threads

## Scraping Mechanism

The Twitter scraping is done through RapidAPI's Twitter services. If the API key is not configured, the app will use mock data.

To customize the scraping, you can modify the `twitterScraper.ts` file.

## Styling

All components use TailwindCSS for styling. You can customize the appearance by modifying the component classes.

## Troubleshooting

1. **No tweets appear**: Check your API key is correctly configured in `.env.local`
2. **API errors**: Ensure your RapidAPI subscription is active and has available credits
3. **Type errors**: Make sure you've installed all dependencies and types

## Dependencies

- Next.js
- React
- TailwindCSS
- date-fns (for date formatting)
- lucide-react (for icons)

## File Structure

```
src/
├── components/
│   └── twitter/
│       ├── index.ts
│       ├── TwitterContent.tsx
│       ├── TwitterSearch.tsx
│       ├── TwitterCategories.tsx
│       ├── TweetCard.tsx
│       ├── TweetThread.tsx
│       └── TwitterPagination.tsx
├── pages/
│   ├── twitter.tsx
│   └── api/
│       └── twitter/
│           ├── user/
│           │   └── [username].ts
│           └── save.ts
├── services/
│   └── twitterApi.ts
└── utils/
    ├── types.ts
    └── twitterScraper.ts
``` 