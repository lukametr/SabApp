import * as path from 'path';
import * as fs from 'fs';

export class FileStorageService {
  /**
   * Get user-specific upload path
   */
  static getUserUploadPath(userId: string): string {
    return path.join(process.cwd(), 'uploads', `user_${userId}`, 'documents');
  }

  /**
   * Get user-specific photos path
   */
  static getUserPhotosPath(userId: string): string {
    return path.join(process.cwd(), 'uploads', `user_${userId}`, 'documents', 'photos');
  }

  /**
   * Get user-specific reports path
   */
  static getUserReportsPath(userId: string): string {
    return path.join(process.cwd(), 'uploads', `user_${userId}`, 'documents', 'reports');
  }

  /**
   * Ensure user directory exists
   */
  static ensureUserDirectoryExists(userId: string): void {
    const userDir = path.join(process.cwd(), 'uploads', `user_${userId}`);
    const documentsDir = path.join(userDir, 'documents');
    const photosDir = path.join(documentsDir, 'photos');
    const reportsDir = path.join(documentsDir, 'reports');

    [userDir, documentsDir, photosDir, reportsDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Check if user has access to file path
   */
  static validateUserAccess(userId: string, filePath: string): boolean {
    const userDir = path.join(process.cwd(), 'uploads', `user_${userId}`);
    const resolvedPath = path.resolve(filePath);
    const resolvedUserDir = path.resolve(userDir);
    
    // Ensure the file is within the user's directory
    return resolvedPath.startsWith(resolvedUserDir);
  }
}
