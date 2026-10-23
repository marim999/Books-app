import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { 
  BookOpen, User, Tag, Mail, Send, CheckCircle, 
  Loader2, PlusCircle, Library, Trash2, Bookmark, 
  Edit, Eye, ArrowLeft 
} from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentBook, setCurrentBook] = useState(null);
  
  const [books, setBooks] = useState([
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Fiction', status: 'Read', description: 'A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.' },
    { id: 2, title: 'Atomic Habits', author: 'James Clear', category: 'Self-Help', status: 'Reading', description: 'An easy and proven way to build good habits and break bad ones.' },
    { id: 3, title: 'Clean Code', author: 'Robert C. Martin', category: 'Programming', status: 'To Read', description: 'A Handbook of Agile Software Craftsmanship.' }
  ]);

  const [newBook, setNewBook] = useState({ title: '', author: '', category: '', status: 'To Read', description: '' });
  
  const form = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleAddBook = (e) => {
    e.preventDefault();
    setBooks([{ id: Date.now(), ...newBook }, ...books]);
    setNewBook({ title: '', author: '', category: '', status: 'To Read', description: '' });
    setActiveTab('dashboard');
  };

  const handleDeleteBook = (id) => {
    setBooks(books.filter(book => book.id !== id));
  };

  const handleUpdateBook = (e) => {
    e.preventDefault();
    setBooks(books.map(book => book.id === currentBook.id ? currentBook : book));
    setActiveTab('dashboard');
    setCurrentBook(null);
  };

  const viewBookDetails = (book) => {
    setCurrentBook(book);
    setActiveTab('show');
  };

  const openEditBook = (book) => {
    setCurrentBook(book);
    setActiveTab('edit');
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // استبدلي هذه القيم ببيانات حسابك من EmailJS
    emailjs.sendForm('service_rmt78ca', 'Ytemplate_tdmtr5r', form.current, 'P3e_9KhyPwRC6ZmoY')
      .then((result) => {
          setIsSubmitting(false);
          setSubmitSuccess(true);
          e.target.reset();
          setTimeout(() => setSubmitSuccess(false), 3000);
      }, (error) => {
          console.log(error.text);
          setIsSubmitting(false);
          alert('Failed to send email. Please check your EmailJS configuration.');
      });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <Library className="h-6 w-6 text-indigo-400" />
              <span className="font-bold text-xl tracking-wide">BookBase</span>
            </div>
            <div className="flex items-center gap-6">
              <button onClick={() => setActiveTab('dashboard')} className={`transition-colors ${activeTab === 'dashboard' ? 'text-indigo-400 font-semibold' : 'text-slate-300 hover:text-white'}`}>Library</button>
              <button onClick={() => setActiveTab('create')} className={`transition-colors ${activeTab === 'create' ? 'text-indigo-400 font-semibold' : 'text-slate-300 hover:text-white'}`}>Add Book</button>
              <button onClick={() => setActiveTab('contact')} className={`transition-colors ${activeTab === 'contact' ? 'text-indigo-400 font-semibold' : 'text-slate-300 hover:text-white'}`}>Contact</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Dashboard / Book Cards */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Bookmark className="h-6 w-6 text-indigo-500" /> My Books
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
                <div key={book.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all flex flex-col">
                  <div className="p-6 flex-grow">
                    <h3 className="text-xl font-bold text-slate-800 truncate mb-2">{book.title}</h3>
                    <div className="space-y-2 text-sm text-slate-600 mb-4">
                      <p className="flex items-center gap-2"><User className="h-4 w-4" /> {book.author}</p>
                      <p className="flex items-center gap-2"><Tag className="h-4 w-4" /> {book.category}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block
                      ${book.status === 'Read' ? 'bg-emerald-100 text-emerald-700' : 
                        book.status === 'Reading' ? 'bg-amber-100 text-amber-700' : 
                        'bg-slate-200 text-slate-700'}`}>
                      {book.status}
                    </span>
                  </div>
                  <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
                    <button onClick={() => viewBookDetails(book)} className="text-indigo-600 hover:text-indigo-800 transition-colors p-2 rounded-full hover:bg-indigo-50" title="View Details">
                      <Eye className="h-5 w-5" />
                    </button>
                    <button onClick={() => openEditBook(book)} className="text-amber-500 hover:text-amber-700 transition-colors p-2 rounded-full hover:bg-amber-50" title="Edit Book">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDeleteBook(book.id)} className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50" title="Delete Book">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Show Details Tab */}
        {activeTab === 'show' && currentBook && (
          <div className="max-w-3xl mx-auto animate-fade-in">
            <button onClick={() => setActiveTab('dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-6">
              <ArrowLeft className="h-5 w-5" /> Back to Library
            </button>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-3xl font-bold text-slate-900">{currentBook.title}</h1>
                <span className={`px-4 py-2 rounded-full text-sm font-medium 
                      ${currentBook.status === 'Read' ? 'bg-emerald-100 text-emerald-700' : 
                        currentBook.status === 'Reading' ? 'bg-amber-100 text-amber-700' : 
                        'bg-slate-200 text-slate-700'}`}>
                      {currentBook.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-6 mb-8 text-slate-700">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-50 p-3 rounded-full text-indigo-600"><User className="h-6 w-6" /></div>
                  <div><p className="text-sm text-slate-400">Author</p><p className="font-semibold">{currentBook.author}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-50 p-3 rounded-full text-indigo-600"><Tag className="h-6 w-6" /></div>
                  <div><p className="text-sm text-slate-400">Category</p><p className="font-semibold">{currentBook.category}</p></div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Description</h3>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100 min-h-[100px]">
                  {currentBook.description || 'No description available for this book.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Create Book Tab */}
        {activeTab === 'create' && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="text-center mb-8">
                <PlusCircle className="h-12 w-12 text-indigo-600 mx-auto mb-3" />
                <h2 className="text-2xl font-bold text-slate-800">Add New Book</h2>
              </div>
              <form onSubmit={handleAddBook} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Book Title</label>
                  <input type="text" required value={newBook.title} onChange={(e) => setNewBook({...newBook, title: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g., Atomic Habits" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Author</label>
                  <input type="text" required value={newBook.author} onChange={(e) => setNewBook({...newBook, author: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g., James Clear" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <input type="text" required value={newBook.category} onChange={(e) => setNewBook({...newBook, category: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g., Self-Help" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                    <select value={newBook.status} onChange={(e) => setNewBook({...newBook, status: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none">
                      <option value="To Read">To Read</option>
                      <option value="Reading">Reading</option>
                      <option value="Read">Read</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea rows="3" value={newBook.description} onChange={(e) => setNewBook({...newBook, description: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none" placeholder="Short summary..."></textarea>
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors">Add to Library</button>
              </form>
            </div>
          </div>
        )}

        {/* Edit Book Tab */}
        {activeTab === 'edit' && currentBook && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <button onClick={() => setActiveTab('dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-6">
              <ArrowLeft className="h-5 w-5" /> Cancel Edit
            </button>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="text-center mb-8">
                <Edit className="h-12 w-12 text-amber-500 mx-auto mb-3" />
                <h2 className="text-2xl font-bold text-slate-800">Edit Book</h2>
              </div>
              <form onSubmit={handleUpdateBook} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Book Title</label>
                  <input type="text" required value={currentBook.title} onChange={(e) => setCurrentBook({...currentBook, title: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Author</label>
                  <input type="text" required value={currentBook.author} onChange={(e) => setCurrentBook({...currentBook, author: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <input type="text" required value={currentBook.category} onChange={(e) => setCurrentBook({...currentBook, category: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                    <select value={currentBook.status} onChange={(e) => setCurrentBook({...currentBook, status: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none">
                      <option value="To Read">To Read</option>
                      <option value="Reading">Reading</option>
                      <option value="Read">Read</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <textarea rows="3" value={currentBook.description} onChange={(e) => setCurrentBook({...currentBook, description: e.target.value})} className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none resize-none"></textarea>
                </div>
                <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 rounded-lg transition-colors">Save Changes</button>
              </form>
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row">
              <div className="bg-slate-900 text-white p-10 md:w-2/5 flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-4">Get in Touch</h3>
                <p className="text-slate-300 mb-8 leading-relaxed">Have a question or want to report a bug? Send us a message directly to our inbox.</p>
                <div className="space-y-4 text-slate-300">
                  <div className="flex items-center gap-3"><Mail className="h-5 w-5 text-indigo-400" /> contact@bookbase.com</div>
                </div>
              </div>
              <div className="p-10 md:w-3/5">
                {submitSuccess ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2"><CheckCircle className="h-8 w-8" /></div>
                    <h3 className="text-2xl font-bold text-slate-800">Email Sent!</h3>
                    <p className="text-slate-500">Thank you for your message. We will get back to you soon.</p>
                    <button onClick={() => setSubmitSuccess(false)} className="mt-4 text-indigo-600 font-medium hover:underline">Send another message</button>
                  </div>
                ) : (
                  <form ref={form} onSubmit={handleContactSubmit} className="space-y-5">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Send Message</h2>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                      <input type="text" name="user_name" required className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                      <input type="email" name="user_email" required className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                      <textarea name="message" required rows="4" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"></textarea>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-70">
                      {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Send className="h-5 w-5" /> Send Email</>}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;