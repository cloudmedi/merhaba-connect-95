import express, { Request, Response, NextFunction } from 'express';
import { authMiddleware, adminMiddleware } from '../../middleware/auth.middleware';
import { CategoryService } from '../../services/admin/CategoryService';
import { RequestHandler } from 'express';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

const router = express.Router();
const categoryService = new CategoryService();

// Get all categories
const getAllCategories: RequestHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ 
      error: 'Failed to fetch categories',
      details: error.message 
    });
  }
};

// Create category
const createCategory: RequestHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const category = await categoryService.createCategory({
      ...req.body,
      createdBy: req.user?.id
    });
    res.status(201).json(category);
  } catch (error: any) {
    console.error('Error creating category:', error);
    res.status(500).json({ 
      error: 'Failed to create category',
      details: error.message 
    });
  }
};

// Update category
const updateCategory: RequestHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: 'Category ID is required' });
      return;
    }

    const category = await categoryService.updateCategory(id, req.body);
    res.json(category);
  } catch (error: any) {
    console.error('Error updating category:', error);
    res.status(500).json({ 
      error: 'Failed to update category',
      details: error.message 
    });
  }
};

// Delete category
const deleteCategory: RequestHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting category:', error);
    res.status(500).json({ 
      error: 'Failed to delete category',
      details: error.message 
    });
  }
};

// Route handlers
router.get('/', authMiddleware, adminMiddleware, getAllCategories);
router.post('/', authMiddleware, adminMiddleware, createCategory);
router.put('/:id', authMiddleware, adminMiddleware, updateCategory);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCategory);

export default router;