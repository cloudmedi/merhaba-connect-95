import express from 'express';
import { CategoryService } from '../../services/admin/CategoryService';
import { authMiddleware, adminMiddleware } from '../../middleware/auth.middleware';
import { Request, Response } from 'express';
import { IUser } from '../../types/user';

interface AuthRequest extends Request {
  user?: IUser;
}

const router = express.Router();
const categoryService = new CategoryService();

// Get all categories with search
router.get('/', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const searchQuery = req.query.search as string;
    const categories = await categoryService.getAllCategories();
    
    if (searchQuery) {
      const filteredCategories = categories.filter(category => 
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      return res.json(filteredCategories);
    }
    
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
router.post('/', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
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
router.put('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
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
router.delete('/:id', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
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