import { NextApiRequest, NextApiResponse } from 'next';
import { Tweet, Thread } from '@/utils/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { items } = req.body as { items: (Tweet | Thread)[] };
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No items provided to save' });
    }

    // In a real implementation, you would save these items to your database
    // For now, we'll simulate a successful save
    console.log(`Saving ${items.length} Twitter items`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    res.status(200).json({ success: true, count: items.length });
  } catch (error: any) {
    console.error('Error saving Twitter data:', error);
    res.status(500).json({ message: error.message || 'Failed to save Twitter data' });
  }
} 