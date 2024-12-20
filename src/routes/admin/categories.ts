import express, { Response, NextFunction } from 'express';
import { CategoryService } from '../../services/admin/CategoryService';
import { authMiddleware, adminMiddleware } from '../../middleware/auth.middleware';
import { Request } from 'express';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

const router = express.Router();
const categoryService = new CategoryService();

// Get all categories
router.get('/', authMiddleware, adminMiddleware, async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const categories = await categoryService.getAllCategories();
    return res.json(categories);
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch categories',
      details: error.message 
    });
  }
});

// Create category
router.post('/', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const category = await categoryService.createCategory({
      ...req.body,
      createdBy: req.user?.id
    });
    return res.status(201).json(category);
  } catch (error: any) {
    console.error('Error creating category:', error);
    return res.status(500).json({ 
      error: 'Failed to create category',
      details: error.message 
    });
  }
});

// Update category
router.put('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Category ID is required' });
    }

    const category = await categoryService.updateCategory(id, req.body);
    return res.json(category);
  } catch (error: any) {
    console.error('Error updating category:', error);
    return res.status(500).json({ 
      error: 'Failed to update category',
      details: error.message 
    });
  }
});

// Delete category
router.delete('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    return res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return res.status(500).json({ 
      error: 'Failed to delete category',
      details: error.message 
    });
  }
});

export default router;