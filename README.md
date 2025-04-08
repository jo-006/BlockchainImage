# Blockchain Image Authentication

A decentralized web application for secure image storage and authentication using blockchain technology. This project ensures image integrity by storing cryptographic hashes of images on a blockchain, allowing for tamper detection and verification.


## 🔑 Key Features

- **Secure Image Upload**: Upload images to a blockchain-powered storage system
- **Image Authentication**: Verify image integrity using SHA-256 hashing
- **Tamper Detection**: Immediately detect if an image has been modified
- **Blockchain Mining**: Mine new blocks to secure the transaction chain
- **User-Friendly Interface**: Modern purple-themed UI for easy interaction

## 🛠️ Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Python, Flask
- **Blockchain**: Custom implementation with Proof of Work consensus
- **Cryptography**: SHA-256 hashing

## 📋 Prerequisites

- Python 3.6+
- Flask
- Requests library
- Werkzeug

## 🚀 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/blockchain-image-authentication.git
   cd blockchain-image-authentication
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the blockchain node (peer):
   ```bash
   python peer.py
   ```

4. In a new terminal, start the web application:
   ```bash
   python run_app.py
   ```

5. Access the application at `http://localhost:9000`

## 💻 How It Works

### Architecture Overview

The system consists of two main components:
1. **Blockchain Node** (port 8800): Manages the blockchain, validates transactions, and mines blocks
2. **Web Application** (port 9000): Provides user interface for image upload, download, and mining operations

### Process Flow

1. **Upload Image**: User uploads an image with their username
2. **Hash Generation**: System calculates SHA-256 hash of the image
3. **Transaction Creation**: Image details and hash are stored as a pending transaction
4. **Mining**: When a mining request is made, pending transactions are added to a new block
5. **Verification**: When an image is re-uploaded, its hash is compared to the original to detect tampering

### Blockchain Implementation

- **Block Structure**: Index, transactions, previous hash, and nonce
- **Proof of Work**: Mining mechanism with adjustable difficulty
- **Chain Validation**: Ensures integrity of the entire blockchain

## 📸 Using the Application

1. **Upload an Image**:
   - Enter your username
   - Select an image file (.png, .jpeg, .jpg, .gif)
   - Click "Upload"

2. **Mine New Blocks**:
   - Click "Request to Mine" in the navigation bar
   - Wait for the mining process to complete
   - New transactions will be permanently added to the blockchain

3. **View Uploaded Images**:
   - All uploaded images appear in the "Uploaded Images" section
   - Each entry shows the username and filename
   - Click "Download" to retrieve the image

## 🔒 Security Features

- **Image Integrity**: SHA-256 hash verification prevents undetected tampering
- **Blockchain Immutability**: Once mined, image records cannot be altered
- **Distributed Architecture**: Designed for multi-node operation (though currently running as single instance)

## 🧪 Future Enhancements

- Multi-node peer-to-peer network implementation
- User authentication and access control
- IPFS integration for decentralized storage
- Enhanced cryptographic security with digital signatures
- Mobile application support

## 👤 Author

Joshnitha - [joshi122006@gmail.com](mailto:joshi122006@gmail.com)

## 🙏 Acknowledgments

- Inspiration from blockchain technology and decentralized storage systems
- Special thanks to the Flask and Python communities
