import express from 'express';
import { CategoryService } from '../../services/admin/CategoryService';
import { authMiddleware, adminMiddleware } from '../../middleware/auth.middleware';

const router = express.Router();
const categoryService = new CategoryService();

// Get all categories
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Create category
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const category = await categoryService.createCategory({
      ...req.body,
      createdBy: req.user.id
    });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Update category
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Delete category
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

export default router;