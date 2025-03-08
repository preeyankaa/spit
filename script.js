document.addEventListener('DOMContentLoaded', () => {
    // Conditional Socket.io connection
    let socket;
    try {
        // Try to connect to socket.io
        socket = io('http://localhost:3000');
    } catch (error) {
        console.log('Socket.io not available, running in local mode');
        // Create a mock socket object for local testing
        socket = {
            on: function() {},
            emit: function(event, data) {
                console.log('Mock emit:', event, data);
                if (event === 'send-message' && currentChatFriend) {
                    // Simulate receiving the message back
                    setTimeout(() => {
                        addMessageToChat(data);
                    }, 500);
                }
            }
        };
    }

    // Tab switching functionality
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Chat window functionality
    const chatWindow = document.getElementById('chatWindow');
    const chatMessages = chatWindow.querySelector('.chat-messages');
    const chatFriendName = document.getElementById('chatFriendName');
    const chatFriendPic = document.getElementById('chatFriendPic');
    const messageInput = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessage');
    const closeChat = document.querySelector('.close-chat');
    let currentChatFriend = null;

    // Store messages per friend
    const friendMessages = {};

    // Message buttons functionality
    const messageButtons = document.querySelectorAll('.message-buttons button');
    const messagesList = document.querySelector('.messages-list');

    // Load previous messages
    socket.on('previous-messages', (messages) => {
        if (!messages) return; // Guard against undefined
        
        messages.forEach(message => {
            if (message.to) {
                if (!friendMessages[message.to]) {
                    friendMessages[message.to] = [];
                }
                friendMessages[message.to].push(message);
            }
            if (currentChatFriend === message.to || currentChatFriend === message.sender) {
                addMessageToChat(message);
            }
        });
    });

    // Handle new messages
    socket.on('new-message', (message) => {
        if (message.to) {
            if (!friendMessages[message.to]) {
                friendMessages[message.to] = [];
            }
            friendMessages[message.to].push(message);
        }
        if (currentChatFriend === message.to || currentChatFriend === message.sender) {
            addMessageToChat(message);
        }
    });

    // Open chat window
    document.querySelectorAll('.message-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const friendName = btn.getAttribute('data-friend');
            const friendPic = btn.getAttribute('data-pic');
            openChat(friendName, friendPic);
        });
    });

    // Close chat window
    closeChat.addEventListener('click', () => {
        chatWindow.classList.remove('active');
        currentChatFriend = null;
    });

    // Send message functionality
    sendMessageBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const text = messageInput.value.trim();
        if (text && currentChatFriend) {
            const message = {
                text,
                sender: 'CoderKid123',
                to: currentChatFriend,
                type: 'sent',
                timestamp: new Date().toISOString()
            };
            socket.emit('send-message', message);
            addMessageToChat(message); // Add message to chat immediately
            messageInput.value = '';
        }
    }

    function openChat(friendName, friendPic) {
        currentChatFriend = friendName;
        chatFriendName.textContent = friendName;
        chatFriendPic.src = friendPic;
        chatWindow.classList.add('active');
        chatMessages.innerHTML = '';
        
        // Load existing messages for this friend
        if (friendMessages[friendName]) {
            friendMessages[friendName].forEach(message => addMessageToChat(message));
        }
        
        messageInput.focus();
    }

    function addMessageToChat(message) {
        const messageHTML = `
            <div class="message ${message.type}">
                ${message.type === 'received' ? `
                    <img src="${chatFriendPic.src}" alt="Friend" class="message-pic">
                ` : ''}
                <div class="message-content">
                    <p>${message.text}</p>
                    <span class="timestamp">${new Date(message.timestamp).toLocaleTimeString()}</span>
                </div>
            </div>
        `;
        chatMessages.insertAdjacentHTML('beforeend', messageHTML);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Quick messages in chat
    messageButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (currentChatFriend) {
                const message = {
                    text: button.textContent,
                    sender: 'CoderKid123',
                    to: currentChatFriend,
                    type: 'sent',
                    timestamp: new Date().toISOString()
                };
                socket.emit('send-message', message);
                addMessageToChat(message); // Add message to chat immediately
            } else {
                alert('Please open a chat first! 💬');
            }
        });
    });

    // Add friend functionality
    const addFriendBtn = document.querySelector('.add-friend');
    const searchInput = document.querySelector('.search-bar input');

    addFriendBtn.addEventListener('click', () => {
        const username = searchInput.value.trim();
        if (username) {
            alert(`Friend request sent to ${username}! 🎮`);
            searchInput.value = '';
        } else {
            alert('Please enter a username! 👾');
        }
    });

    // Join challenge functionality
    const joinButtons = document.querySelectorAll('.join-btn');

    joinButtons.forEach(button => {
        button.addEventListener('click', () => {
            const challengeName = button.closest('.challenge-card').querySelector('h3').textContent;
            alert(`Joined challenge: ${challengeName} 🚀`);
        });
    });

    // Challenge friend functionality
    const challengeButtons = document.querySelectorAll('.challenge-btn');

    challengeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const friendName = button.closest('.friend-card').querySelector('h3').textContent;
            alert(`Challenge sent to ${friendName}! 🎮`);
        });
    });
});