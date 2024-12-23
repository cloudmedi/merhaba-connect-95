import express, { Response } from 'express';
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
router.get('/', authMiddleware, adminMiddleware, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
    return;
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ 
      error: 'Failed to fetch categories',
      details: error.message 
    });
    return;
  }
});

// Create category
router.post('/', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const category = await categoryService.createCategory({
      ...req.body,
      createdBy: req.user?.id
    });
    res.status(201).json(category);
    return;
  } catch (error: any) {
    console.error('Error creating category:', error);
    res.status(500).json({ 
      error: 'Failed to create category',
      details: error.message 
    });
    return;
  }
});

// Update category
router.put('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'Category ID is required' });
      return;
    }

    const category = await categoryService.updateCategory(id, req.body);
    res.json(category);
    return;
  } catch (error: any) {
    console.error('Error updating category:', error);
    res.status(500).json({ 
      error: 'Failed to update category',
      details: error.message 
    });
    return;
  }
});

// Delete category
router.delete('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.status(204).send();
    return;
  } catch (error: any) {
    console.error('Error deleting category:', error);
    res.status(500).json({ 
      error: 'Failed to delete category',
      details: error.message 
    });
    return;
  }
});

export default router;