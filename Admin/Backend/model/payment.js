const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  customer: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    default: 'credit',
    // required: true,

  },
  status: {
    type: String,
    enum: ['completed', 'pending'],
    default: 'completed',
  },
  notes: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Payment', paymentSchema);