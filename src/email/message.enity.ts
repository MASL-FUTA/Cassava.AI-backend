import * as dotenv from 'dotenv';
dotenv.config();

export interface MessageEntity {
  senderAddress: string;
  content: {
    subject: string;
    plainText?: string;
    html?: string;
  };
  recipients: {
    to: any;
  };
}

export const message: MessageEntity = {
  senderAddress: process.env.senderAddress,
  content: {
    subject: "",
    plainText: '',
    html: ''
  },
  recipients: {
    to: [
      {
        address: ''
      }
    ]
  }
}