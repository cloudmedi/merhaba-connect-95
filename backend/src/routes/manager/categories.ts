import express from 'express';
import { CategoryService } from '../../services/admin/CategoryService';
import { authMiddleware } from '../../middleware/auth.middleware';
import { managerMiddleware } from '../../middleware/manager.middleware';
import { Request, Response } from 'express';

const router = express.Router();
const categoryService = new CategoryService();

// Get all public categories for manager
router.get('/', authMiddleware, managerMiddleware, async (_req: Request, res: Response) => {
  try {
    const categories = await categoryService.getAllCategories();
    // Sadece public kategorileri filtrele
    const publicCategories = categories.filter(category => category.isPublic);
    return res.json(publicCategories);
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch categories',
      details: error.message 
    });
  }
});

export default router;