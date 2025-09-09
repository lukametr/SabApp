import { All, Controller, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

// ამ კონტროლერი უზრუნველყოფს SPA fallback-ს ისე, რომ არ შეეხოს API/Docs/Health მარშრუტებს
@Controller()
export class SpaController {
  @All('*')
  handleSpa(@Req() req: Request, @Res() res: Response) {
    const url = req.url || '/';

    // გამოტოვე backend მარშრუტები
    if (
      url.startsWith('/api') ||
      url.startsWith('/health') ||
      url.startsWith('/docs')
    ) {
      return res.status(404).json({ error: 'Endpoint არ მოიძებნა', path: url });
    }

    // სერვირება backend/public/index.html-იდან (Dockerfile აკოპირებს frontend out-ს აქ)
    const indexPath = join(__dirname, '..', 'public', 'index.html');

    if (existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }

    return res.status(404).json({
      error: 'გვერდი არ მოიძებნა',
      message: 'Frontend build არ არსებობს public დირექტორიაში',
      requestPath: url,
    });
  }
}
