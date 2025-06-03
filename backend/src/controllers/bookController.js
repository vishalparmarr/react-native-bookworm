import Book from "../models/Book.js";
import cloudinary from "../lib/cloudinary.js";

export const books = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const books = await Book.find()
            .populate("user", "username profileImage")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalBooks = await Book.countDocuments();

        res.status(200).json({
            books,
            currentPage: page,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit)
        });

    } catch (error) {
        console.log("Error in getting books", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const createBook = async (req, res) => {
    try {
        const { title, caption, image, rating } = req.body;

        if (!title || !caption || !image || !rating) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        // Check if book already exists
        const existingBook = await Book.findOne({ title });
        if (existingBook) {
            return res.status(400).json({ message: "Book already exists" });
        }

        //upload image to cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image);
        const imageUrl = uploadResponse.secure_url;

        const newBook = new Book({
            title,
            caption,
            image: imageUrl,
            ratings: rating,
            user: req.user._id,
        });

        await newBook.save();
        res.status(201).json({ message: "Book created successfully", book: newBook });

    } catch (error) {
        console.log("Error in creating book", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteBook = async (req, res) => {

    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: "Book not found" });

        //check if the user is the owner of the book
        if (book.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "You are not authorized to delete this book" });
        }

        //delete image from cloudinary
        if (book.image && book.image.includes("cloudinary")) {
            try {
                const publicId = book.image.split("/").pop().split(".")[0];
                cloudinary.uploader.destroy(publicId)
            } catch (error) {
                console.log("Error in deleting image from cloudinary", error);
                return res.status(500).json({ message: "Internal server error" });
            }
        }
        await book.deleteOne();
        res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        console.log("Error in deleting book", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const recommendBooks = async (req, res) => {

    try {
        const books = await Book.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(books);
    } catch (error) {
        console.log("Error in getting recommended books", error);
        res.status(500).json({ message: "Internal server error" });
    }
}