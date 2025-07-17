import { Controller, Get, Req, Res, Param } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('auth')
export class NextAuthController {
  
  @Get('session')
  async getSession(@Res() res: Response) {
    // Proxy to NextAuth session endpoint
    try {
      // For static export, we'll handle session client-side
      res.json({ user: null });
    } catch (error) {
      res.status(500).json({ error: 'Session error' });
    }
  }

  @Get('providers')
  async getProviders(@Res() res: Response) {
    // Return providers configuration
    res.json({
      google: {
        id: 'google',
        name: 'Google',
        type: 'oauth',
        signinUrl: '/api/auth/signin/google',
      },
      credentials: {
        id: 'credentials',
        name: 'Email',
        type: 'credentials',
      }
    });
  }

  @Get('signin')
  @Get('signin/:provider')
  async signIn(@Param('provider') provider: string, @Res() res: Response) {
    if (provider === 'google') {
      // Redirect to our Google OAuth flow
      const redirectUrl = `${process.env.BACKEND_URL || 'http://localhost:10000'}/api/auth/google`;
      res.redirect(redirectUrl);
    } else {
      // Return signin page for email
      res.redirect('/?signin=true');
    }
  }

  @Get('signout')
  async signOut(@Res() res: Response) {
    // Handle signout
    res.redirect('/');
  }

  @Get('error')
  async error(@Req() req: Request, @Res() res: Response) {
    const error = req.query.error as string;
    console.log('NextAuth error:', error);
    
    // Redirect to frontend error page
    const errorUrl = `/?error=${encodeURIComponent(error || 'Authentication failed')}`;
    res.redirect(errorUrl);
  }

  @Get('callback/:provider')
  async callback(@Param('provider') provider: string, @Res() res: Response) {
    if (provider === 'google') {
      // This will be handled by our existing Google OAuth
      res.redirect('/api/auth/google/callback');
    } else {
      res.redirect('/?error=Unknown provider');
    }
  }
}
