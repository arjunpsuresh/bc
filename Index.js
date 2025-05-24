const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const getResponse = require('./chatbot');
require('./Connection');
const userModel = require('./Model/User');
const bookModel = require('./Model/book');
const reviewModel = require('./Model/review'); // ✅ REQUIRED
const bookRoutes = require('./routes/bookRoutes');
// initialize
const app = express();

// middleware 
app.use(express.json());
app.use(cors());
app.use('/api/books', require('./routes/books'));
app.use('/api/books', bookRoutes);


// Predefined admin credentials
const admins = [
  { username: 'allenjoshy', password: 'allenjoshy@14' },
  { username: 'anvarshas', password: 'anvarshas@24' },
  { username: 'arjunpsuresh', password: 'arjunpsuresh@26' },
  { username: 'ayanshaji', password: 'ayanshaji@32' }
];

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // Replace with your email
    pass: 'your-email-password'    // Replace with your email password
  }
});

// 1. Register API (Sign-in)
app.post('/sign', async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await userModel.findOne({ username });
        if (existingUser) {
            return res.status(400).send({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({
            username,
            password: hashedPassword,
        });

        await newUser.save();
        res.send({ message: 'User registered successfully' });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Server error during registration' });
    }
});

// 2. Login API
app.post('/login', async (req, res) => {
    try {
        const { username, password, role } = req.body;

        if (role === 'admin') {
            const admin = admins.find((admin) => admin.username === username && admin.password === password);
            if (admin) {
                return res.send({ message: 'Admin login successful', username });
            } else {
                return res.status(400).send({ message: 'Invalid admin credentials' });
            }
        }

        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(400).send({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send({ message: 'Invalid password' });
        }

        res.send({ message: 'Login successful', username: user.username });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Server error during login' });
    }
});

// 📚 Get all books
app.get('/books', async (req, res) => {
    try {
        const books = await bookModel.find();
        res.json(books);
    } catch (err) {
        res.status(500).send({ message: 'Error fetching books' });
    }
});

// 📚 Borrow a book
app.post('/borrow', async (req, res) => {
    try {
        const { bookId, borrower } = req.body;
        const now = new Date().toLocaleDateString();

        const book = await bookModel.findById(bookId);
        if (!book) {
            return res.status(404).send({ message: 'Book not found' });
        }

        if (book.borrowed) {
            return res.status(400).send({ message: 'Book already borrowed' });
        }

        book.borrowed = true;
        book.borrowedBy = borrower;
        book.borrowDate = now;
        await book.save();

        res.send({ message: 'Book borrowed successfully' });
    } catch (err) {
        res.status(500).send({ message: 'Error borrowing book' });
    }
});

// 📚 Return a book
app.post('/return', async (req, res) => {
    try {
        const { bookId } = req.body;

        const book = await bookModel.findById(bookId);
        if (!book) {
            return res.status(404).send({ message: 'Book not found' });
        }

        book.borrowed = false;
        book.borrowedBy = '';
        book.borrowDate = '';
        await book.save();

        res.send({ message: 'Book returned successfully' });
    } catch (err) {
        res.status(500).send({ message: 'Error returning book' });
    }
});

// 💬 Chatbot API
app.post('/chatbot', (req, res) => {
    const { message } = req.body;
    const reply = getResponse(message);
    res.json({ reply });
});

// Review API
app.get('/reviews/:bookId', async (req, res) => {
    try {
      const reviews = await reviewModel.find({ bookId: req.params.bookId });
      res.json(reviews);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch reviews' });
    }
});

app.post('/reviews', async (req, res) => {
    const { bookId, reviewer, rating, comment } = req.body;
  
    if (!bookId || !reviewer || !rating || !comment) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    try {
      const newReview = new reviewModel({ bookId, reviewer, rating, comment });
      await newReview.save();
      res.status(201).json({ message: 'Review added successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Failed to add review' });
    }
});

// Forgot Password API
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).send({ message: 'User not found' });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetToken = resetToken;
        user.resetTokenExpiration = Date.now() + 3600000; // Token expires in 1 hour
        await user.save();

        const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

        // Send the reset email
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Password Reset Request',
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                return res.status(500).send({ message: 'Error sending email' });
            }
            res.json({ message: 'Password reset email sent' });
        });
    } catch (err) {
        res.status(500).send({ message: 'Error processing request' });
    }
});

// Reset Password API
app.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const user = await userModel.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).send({ message: 'Invalid or expired token' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();

        res.json({ message: 'Password reset successful' });
    } catch (err) {
        res.status(500).send({ message: 'Error resetting password' });
    }
});

const calculateFine = (reservedDate) => {
  const gracePeriod = 7; // 7 days allowed
  const finePerDay = 5;  // ₹5 per extra day

  const now = new Date();
  const reservedTime = new Date(reservedDate);
  const daysLate = Math.floor((now - reservedTime) / (1000 * 60 * 60 * 24)) - gracePeriod;

  return daysLate > 0 ? daysLate * finePerDay : 0;
};

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    const updatedBooks = books.map(book => {
      let fine = 0;
      if (book.reserved && book.reservedDate) {
        fine = calculateFine(book.reservedDate);
      }

      return {
        ...book.toObject(),
        fine,
      };
    });

    res.status(200).json(updatedBooks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};
// Health Check
app.get('/', (req, res) => {
    res.send('Server is running...');
});

// port setting
app.listen(3004, () => {
    console.log('Port is running on 3004');
});
