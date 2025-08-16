import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { accessToken } = await getAccessToken(req, res, {
      scopes: ['openid', 'profile', 'email']
    });
    
    res.status(200).json({ accessToken });
  } catch (error) {
    console.error('Error getting access token:', error);
    res.status(500).json({ 
      error: 'Unable to get access token',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});
