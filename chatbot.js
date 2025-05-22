const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

const responses = {
  "how to borrow a book": "Go to 'Borrow Book' in the system and fill in the form.",
  "how to return a book": "Click on 'Return Book' and select the borrowed item.",
  "library timing": "The library is open from 9 AM to 5 PM on weekdays.",
  "how to login": "Use your registered email and password on the Login page.",
  "how to register": "Click on Sign Up and fill in your details.",
  "can i borrow a book without reserving it": "No, you must reserve the book first before borrowing.",
  "how to reserve a book": "Click on the 'Reserve' button next to an available book, then fill out your details.",
  "how to search for a book": "Use the search bar in the 'View Books' section to find books by title or author.",
  "what happens if i return a book late": "A fine of $2 per day is applied after the due date.",
  "can i cancel my reservation": "Please contact the librarian or admin to cancel a reservation.",
  "how many books can i reserve": "You can reserve up to 3 books at a time.",
  "can i see my borrowed books": "Currently, only admins can view all borrow records. Contact them for details.",
  "can i write a book review": "Yes, go to the 'Reviews' section for any book and submit your feedback.",
  "what is the fine per day": "The fine is $2 per day for overdue books.",
  "can i update my return date": "Return dates cannot be updated directly. Please contact the admin.",
  "how do i know if a book is available": "In the 'View Books' section, check the status column — it will show 'Available', 'Reserved', or 'Borrowed'.",
  "how to contact the librarian": "Please visit the Contact Us page or speak to the admin during working hours.",
  "how to log out": "Click on your username in the top-right corner and select 'Log out'.",
  "is there a limit on borrowing time": "Yes, each book can be borrowed for up to 15 days.",
  "what happens if i damage a book": "Damaged books must be reported to the librarian. Fines or replacements may apply.",
  "can i renew a borrowed book": "Renewals are not yet supported. You must return and re-borrow if the book is available.",
  "what if the system shows an error": "Try refreshing the page or logging in again. If the issue persists, contact the admin.",
  "do i need to reserve books on weekends": "You can reserve books anytime online, even on weekends.",
  "how long does a reservation last": "Reservations are valid until the book is borrowed or canceled by an admin.",
  "can i see book reviews before borrowing": "Yes, click the 'Reviews' button next to any book to read feedback.",
  "can i view all books in the library": "Yes, go to the 'View Books' section to see all available, reserved, and borrowed books.",
  "can i see who reserved or borrowed a book": "You can view who reserved or borrowed a book in the 'View Books' table under the respective columns.",
  "can i change my reservation details": "No, reservation details cannot be changed after submission. Please cancel and re-reserve if needed.",
  "can i reserve a book that is already reserved": "No, books already reserved or borrowed are not available for reservation.",
  "how can admins borrow a book for a user": "Admins can go to the 'Borrow Book' page, select a reserved book, and fill in the borrower's details.",
  "what if i forget to return a book": "Late returns will incur a fine of $2 per day. Return the book as soon as possible.",
  "can i return a book before the due date": "Yes, you can return a book at any time before the due date without penalty.",
  "can i review a book after returning it": "Yes, you can write a review for any book regardless of whether you have returned it.",
  "what format should the return date be in": "Please enter the return date using the calendar picker (in YYYY-MM-DD format).",
  "where can i see the fine for my borrowed book": "Fines are shown in the 'View Books' section under the 'Fine' column if the book is overdue.",
  "who can add or remove books": "Only admins have access to add, edit, or delete books from the library system.",
  "what happens after i reserve a book": "The admin will borrow the book on your behalf once your reservation is approved.",
  "can i chat with the admin": "This system currently supports basic chatbot interaction. For admin help, contact them directly.",
  "how often is the book list updated": "Book availability updates in real-time when books are reserved, borrowed, or returned.",
  "how to search books by genre or year": "Use the filter options in 'View Books' to search by genre or publication year.",
  "can i borrow a book that someone else reserved": "No, only the user who reserved the book can borrow it. Please wait until it's returned or becomes available.",
  "how do i know if my reservation was successful": "Once you reserve a book, you'll see your name in the 'Reserved By' column in the book list.",
  "how do admins know which books need to be borrowed": "Admins should regularly check for reserved books in the system and process them via the 'Borrow Book' page.",
  "can i reserve multiple books and choose one later": "Yes, but please be mindful that only reserved books can be borrowed. You may cancel unused reservations if needed.",
  "is it possible to reserve and borrow on the same day": "Yes, but only an admin can borrow a book after it's reserved by a user.",
  "what's the difference between reserved and borrowed": "Reserved means the book is set aside for you. Borrowed means it's officially checked out and the due date starts counting.",
  "will i be notified when a reserved book is borrowed": "Currently, the system doesn't send notifications. You can check your reservation status in the book list.",
  "how do i avoid paying a fine": "Return the book on or before the due date shown during reservation to avoid late fees.",
  "what if i reserved a book but someone else borrowed it": "Only an admin can borrow, and they can only borrow a book if it was reserved. If this happens, contact the admin.",
  "how is the fine calculated": "A fine of $2 per day is calculated for each day the book is overdue after the 15-day borrow period.",
  "can i reserve a book again after returning it": "Yes, once a returned book is marked as available, any user can reserve it again.",
  "how does the system prevent duplicate reservations": "The system disables the reserve button for books that are already reserved or borrowed.",
  "can admins override reservations": "Admins can manually update or clear reservations by editing the book record in the backend.",
  "how does the system know if i returned a book late": "The system compares the current date with the borrow date and allowed period. Fines apply automatically if overdue.",
  "can i suggest new books to be added": "Suggestions aren't supported through the app yet. Contact the admin directly to recommend books.",
};

function getResponse(input) {
  const inputTokens = tokenizer.tokenize(input.toLowerCase());
  let bestMatch = "";
  let bestScore = 0;

  for (let question in responses) {
    const questionTokens = tokenizer.tokenize(question.toLowerCase());
    const score = natural.JaroWinklerDistance(inputTokens.join(' '), questionTokens.join(' '));
    if (score > bestScore) {
      bestScore = score;
      bestMatch = question;
    }
  }

  return bestScore > 0.7 ? responses[bestMatch] : "Sorry, I didn't understand that. Please try again.";
}

module.exports = getResponse;