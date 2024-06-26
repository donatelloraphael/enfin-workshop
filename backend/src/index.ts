import express from 'express';
import dotenv from 'dotenv';
import Joi from 'joi';
dotenv.config();
import { Book, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

const bookSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  publishDate: Joi.date().iso().required(),
  price: Joi.number().positive().required(),
});

app.post('/books', async (req, res) => {
  const { error, value } = bookSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { name, description, publishDate, price } = req.body;
  try {
    const newBook = await prisma.book.create({
      data: {
        name,
        description,
        publishDate: new Date(publishDate),
        price,
      },
    });
    res.json(newBook);
  } catch (error: any) {
    res.status(400).json({ error: `Failed to create a new book: ${error.message}` });
  }
});

app.get('/books', async (req, res) => {
  try {
    const books = await prisma.book.findMany();
    res.json(books);
  } catch (error: any) {
    res.status(400).json({ error: `Failed to fetch books: ${error.message}` });
  }
});

app.get('/books/:id', async (req, res) => {
  const { id } = req.params;
  
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: 'Invalid book ID' });
  }
  
  try {
    const book = await prisma.book.findUnique({
      where: { id: Number(id) },
    });
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error: any) {
    res.status(400).json({ error: `Failed to fetch the book: ${error.message}` });
  }
});

const bookUpdateSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  publishDate: Joi.date().iso().optional(),
  price: Joi.number().positive().optional(),
}).min(1);

app.put('/books/:id', async (req, res) => {
  const { error, value } = bookUpdateSchema.validate(req.body, { allowUnknown: true, stripUnknown: true });

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: 'Invalid book ID' });
  }

  const updateData: Partial<Book> = {};

  if (value.name !== undefined) updateData.name = value.name;
  if (value.description !== undefined) updateData.description = value.description;
  if (value.publishDate !== undefined) updateData.publishDate = new Date(value.publishDate);
  if (value.price !== undefined) updateData.price = value.price;

  try {
    const updatedBook = await prisma.book.update({
      where: { id: Number(id) },
      data: updateData,
    });

    res.json(updatedBook);
  } catch (error: any) {
    res.status(400).json({ error: `Failed to update the book: ${error.message}` });
  }
});

app.delete('/books/:id', async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: 'Invalid book ID' });
  }
  
  try {
    await prisma.book.delete({
      where: { id: Number(id) },
    });
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: `Failed to delete the book: ${error.message}` });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
