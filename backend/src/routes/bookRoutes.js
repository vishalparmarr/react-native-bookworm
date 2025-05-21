import express from 'express';

import { books, createBook, deleteBook, recommendBooks } from '../controllers/bookController.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

//create a new book
router.post('/', protectRoute, createBook);

//get all books
router.get('/', protectRoute, books);

//delete a book
router.delete('/:id', protectRoute, deleteBook);

//get recommended books by the logged user
router.get('/user', protectRoute, recommendBooks);

export default router;