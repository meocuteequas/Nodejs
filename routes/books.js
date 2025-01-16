const express = require("express");
const router = express.Router();

const books = require("../utils/data");

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - finished
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the book
 *         title:
 *           type: string
 *           description: The title of your book
 *         author:
 *           type: string
 *           description: The book author
 *         finished:
 *           type: boolean
 *           description: Whether you have finished reading the book
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the book was added
 *       example:
 *         id: d5fE_asz
 *         title: The New Turing Omnibus
 *         author: Alexander K. Dewdney
 *         finished: false
 *         createdAt: 2020-03-10T04:05:06.157Z
 */

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: The books managing API
 * /books:
 *   get:
 *     summary: Lists all the books
 *     tags: [Books]
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         schema:
 *           type: string
 *         required: true
 *         description: API key for authorization
 *     responses:
 *       200:
 *         description: The list of the books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         schema:
 *           type: string
 *         required: true
 *         description: API key for authorization
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: The created book.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: Some server error
 *         content:
 *           application/json:
 *             example:
 *               reason: "INTERNAL_SERVER_ERROR:Some server error"
 *               status: 500
 * /books/{id}:
 *   get:
 *     summary: Get the book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *       - in: header
 *         name: x-api-key
 *         schema:
 *           type: string
 *         required: true
 *         description: API key for authorization
 *     responses:
 *       200:
 *         description: The book response by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: The book was not found
 *         content:
 *           application/json:
 *             example:
 *               reason: "BOOK_NOT_FOUND:The book was not found"
 *               status: 404
 *   put:
 *    summary: Update the book by the id
 *    tags: [Books]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The book id
 *      - in: header
 *        name: x-api-key
 *        schema:
 *          type: string
 *        required: true
 *        description: API key for authorization
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Book'
 *    responses:
 *      200:
 *        description: The book was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Book'
 *      404:
 *        description: The book was not found
 *        content:
 *          application/json:
 *            example:
 *              reason: "BOOK_NOT_FOUND:The book was not found"
 *              status: 404
 *      500:
 *        description: Some error happened
 *        content:
 *          application/json:
 *            example:
 *              reason: "INTERNAL_SERVER_ERROR:Some error happened"
 *              status: 500
 *   delete:
 *     summary: Remove the book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The book id
 *       - in: header
 *         name: x-api-key
 *         schema:
 *           type: string
 *         required: true
 *         description: API key for authorization
 *     responses:
 *       200:
 *         description: The book was deleted
 *       404:
 *         description: The book was not found
 *         content:
 *           application/json:
 *             example:
 *               reason: "BOOK_NOT_FOUND:The book was not found"
 *               status: 404
 *       500:
 *         description: Some error happened
 *         content:
 *           application/json:
 *             example:
 *               reason: "INTERNAL_SERVER_ERROR:Some error happened"
 *               status: 500
 */

router.get("/", function (req, res) {
  res.status(200).json(books);
});

router.get("/:id", function (req, res) {
  let book = books.find(function (item) {
    return item.id == req.params.id;
  });

  book ? res.status(200).json(book) : res.status(404).json({ reason: "BOOK_NOT_FOUND:The book was not found", status: 404 });
});

router.post("/", function (req, res) {
  const { title, author, finished } = req.body;

  let book = {
    id: books.length + 1,
    title: title,
    author: author,
    finished: finished !== undefined ? finished : false,
    createdAt: new Date(),
  };

  books.push(book);

  res.status(201).json(book);
});

router.put("/:id", function (req, res) {
  let book = books.find(function (item) {
    return item.id == req.params.id;
  });

  if (book) {
    const { title, author, finished } = req.body;

    let updated = {
      id: book.id,
      title: title !== undefined ? title : book.title,
      author: author !== undefined ? author : book.author,
      finished: finished !== undefined ? finished : book.finished,
      createdAt: book.createdAt,
    };

    books.splice(books.indexOf(book), 1, updated);

    res.sendStatus(204);
  } else {
    res.status(404).json({ reason: "BOOK_NOT_FOUND:The book was not found", status: 404 });
  }
});

router.delete("/:id", function (req, res) {
  let book = books.find(function (item) {
    return item.id == req.params.id;
  });

  if (book) {
    books.splice(books.indexOf(book), 1);
  } else {
    return res.status(404).json({ reason: "BOOK_NOT_FOUND:The book was not found", status: 404 });
  }

  res.sendStatus(204);
});

module.exports = router;