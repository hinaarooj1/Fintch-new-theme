const mongoose = require("mongoose");

let userCoins = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true,
    unique: true,
  },
  btcBalance: {
    type: Number,
    default: 0,
  },
  btcTokenAddress: {
    type: String,
    default: "N/A",
  },

  ethBalance: {
    type: Number,
    default: 0,
  },
  ethTokenAddress: {
    type: String,
    default: "N/A",
  },

  usdtBalance: {
    type: Number,
    default: 0,
  },

  usdtTokenAddress: {
    type: String,
    default: "N/A",
  },
  transactions: [
    {
      withdraw: {
        type: String,
        required: true,
        enum: ["crypto", "bank"],
      },
      selectedPayment: {
        type: String,
      },
      trxName: { type: String },
      amount: {
        type: Number,
        required: true,
      },
      txId: {
        type: String,
        required: true,
      },
      fromAddress: {
        type: String,
      },
      status: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      note: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      isHidden: {
        type: Boolean,
        default: false,
      },
      by: {
        type: String,
        default: "admin",
      },
    },
  ],
});

let userModel = mongoose.model("userCoin", userCoins);

module.exports = userModel;
