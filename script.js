// ============================================================
// MK CHAT - COMPLETE FRONTEND JS
// BACKEND + MONGODB + JWT + SOCKET.IO
// ============================================================

const BACKEND_URL ="https://mk-web-backend.onrender.com";

// ============================================================
// SOCKET.IO CONNECTION
// ============================================================
const socket =io(BACKEND_URL, {
        transports: ["polling", "websocket"]
    });

// ============================================================
// SOCKET CONNECTED
// ============================================================
socket.on("connect",function(){
 console.log("✅ Socket connected:",
        socket.id );
 // Login user ko personal room me join karvao
    joinUserRoom();
});

// ============================================================
// SOCKET ERROR
// ============================================================
socket.on("connect_error", function (error) {
console.error("❌ Socket connection error:",error);
   });

// ============================================================
// USER STATUS
// ============================================================
socket.on("user_status", function (data) {
 console.log("USER STATUS:",data);
   });

// ============================================================
// RECEIVE MESSAGE
// ============================================================
/*socket.on("receive_message", function (data) {
console.log(
        "📩 Receive Message:",
        data
    );

    // Message screen par dikhao
    showMessage(data);


    // Receiver backend ko batayega
    // ki message receive ho gaya
    socket.emit(
        "message_received",
        {
            messageId: data._id
        }
    );

});*/


// ============================================================
// MESSAGE DELIVERED
// ============================================================

socket.on("message_delivered", function (data) {

    console.log(
        "✅ Delivered:",
        data
    );


    const messageDiv =
        document.querySelector(
            `[data-message-id="${data.messageId}"]`
        );


    if (!messageDiv) {

        console.log(
            "Message div nahi mila:",
            data.messageId
        );

        return;

    }


    const status =
        messageDiv.querySelector(
            ".messageStatus"
        );


    if (status) {

        status.textContent =
            "✓✓";

        status.style.color =
            "";

    }

});


// ============================================================
// MESSAGE READ
// ============================================================

socket.on("messages_read", function (data) {

    console.log(
        "💙 Read:",
        data
    );


    document
        .querySelectorAll(
            ".myMessage .messageStatus"
        )
        .forEach(function (status) {

            status.textContent =
                "✓✓";

            status.style.color =
                "#2196F3";

        });
});

// ============================================================
// HTML ELEMENTS
// ============================================================

let newaccount =
    document.querySelector("#newaccount");

let newAccountScreen =
    document.querySelector("#newAccountScreen");

let close =
    document.querySelector("#close");

let homeScreen =
    document.querySelector("#homeScreen");

let screen1 =
    document.querySelector("#screen1");

let createBtn =
    document.querySelector("#createAccount");

let loginBtn =
    document.querySelector("#loginBtn");

let logout =
    document.querySelector("#logout");


// ============================================================
// CREATE ACCOUNT SCREEN
// ============================================================

newaccount.addEventListener(
    "click",
    function (event) {

        event.stopPropagation();

        newAccountScreen.style.display =
            "block";

    }
);


newAccountScreen.addEventListener(
    "click",
    function (event) {

        event.stopPropagation();

    }
);


document.addEventListener(
    "click",
    function () {

        newAccountScreen.style.display =
            "none";

    }
);


close.addEventListener(
    "click",
    function () {

        newAccountScreen.style.display =
            "none";

    }
);


// ============================================================
// CREATE ACCOUNT
// ============================================================

createBtn.addEventListener(
    "click",
    async function () {

        let username =
            document.querySelector(
                "#username"
            ).value.trim();


        let email =
            document.querySelector(
                "#email"
            ).value.trim();


        let password =
            document.querySelector(
                "#password"
            ).value;


        let confirmPassword =
            document.querySelector(
                "#confirmPassword"
            ).value;


        // Empty check
        if (
            !username ||
            !email ||
            !password ||
            !confirmPassword
        ) {

            alert(
                "Please fill all fields"
            );

            return;

        }


        // Password check
        if (
            password !==
            confirmPassword
        ) {

            alert(
                "Passwords do not match"
            );

            return;

        }


        try {

            let response =
                await fetch(
                    `${BACKEND_URL}/api/auth/register`,
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                username,
                                email,
                                password
                            })

                    }
                );


            let result =
                await response.json();


            if (
                result.success
            ) {

                alert(
                    "Account successfully ban gaya! Ab Login karein."
                );

                newAccountScreen.style.display =
                    "none";

            }

            else {

                alert(
                    result.error ||
                    "Account create nahi hua"
                );

            }


        }

        catch (error) {

            console.error(
                "Register Error:",
                error
            );

            alert(
                "Server se connect nahi ho paya!"
            );

        }

    }
);


// ============================================================
// LOGIN
// ============================================================

loginBtn.addEventListener(
    "click",
    async function () {

        let email =
            document.querySelector(
                "#loginEmail"
            ).value.trim();


        let password =
            document.querySelector(
                "#loginPassword"
            ).value;


        if (
            !email ||
            !password
        ) {

            alert(
                "Email aur Password enter karein"
            );

            return;

        }


        try {

            let response =
                await fetch(
                    `${BACKEND_URL}/api/auth/login`,
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                email,
                                password
                            })

                    }
                );


            let result =
                await response.json();


            if (
                result.success
            ) {

                // User save
                localStorage.setItem(
                    "currentUser",
                    JSON.stringify(
                        result.user
                    )
                );


                // JWT save
                localStorage.setItem(
                    "token",
                    result.token
                );


                // Username show
                document.querySelector(
                    "#userName"
                ).textContent =
                    result.user.username;


                // Screen change
                screen1.style.display =
                    "none";

                homeScreen.style.display =
                    "block";


                // Socket room join
                joinUserRoom();
                
loadChats();

                

            }

            else {

                alert(
                    result.error ||
                    "Galat Email ya Password!"
                );

            }


        }

        catch (error) {

            console.error(
                "Login Error:",
                error
            );

            alert(
                "Login Error! Internet check karein."
            );

        }

    }
);


// ============================================================
// AUTO LOGIN
// ============================================================

window.addEventListener(
    "load",
    function () {

        let savedUser =
            localStorage.getItem(
                "currentUser"
            );


        let savedToken =
            localStorage.getItem(
                "token"
            );


        if (
            savedUser &&
            savedToken
        ) {

            try {

                let user =
                    JSON.parse(
                        savedUser
                    );


                document.querySelector(
                    "#userName"
                ).textContent =
                    user.username;


                screen1.style.display =
                    "none";


                homeScreen.style.display =
                    "block";


                // Socket room
                joinUserRoom();
                
                loadChats();

            }

            catch (error) {

                console.error(
                    error
                );

            }

        }

        else {

            screen1.style.display =
                "block";

            homeScreen.style.display =
                "none";

        }

    }
);


// ============================================================
// LOGOUT
// ============================================================

logout.addEventListener(
    "click",
    function () {

        localStorage.removeItem(
            "currentUser"
        );


        localStorage.removeItem(
            "token"
        );


        localStorage.removeItem(
            "selectedUserId"
        );


        homeScreen.style.display =
            "none";


        screen1.style.display =
            "block";

    }
);

// SETTINGS
let setting=document.querySelector("#setting");
let h1 =document.querySelector("#h1");

h1.addEventListener("click",function (event) {
    event.stopPropagation();
 if (setting.style.display ==="block"){
  setting.style.display ="none";
  }else {
  setting.style.display ="block";
       }
   });

setting.addEventListener("click",function (event) {
   event.stopPropagation();
   });

document.addEventListener("click", function (){
  setting.style.display ="none";
});

// ChatSETTINGS
let chatsetting=document.querySelector("#chatsetting");
let chatMenuBtn=document.querySelector("#chatMenuBtn");

chatMenuBtn.addEventListener("click",function (event) {
    event.stopPropagation();
 if (chatsetting.style.display ==="block"){
  chatsetting.style.display ="none";
  }else {
  chatsetting.style.display ="block";
       }
   });

chatsetting.addEventListener("click",function (event) {
   event.stopPropagation();
   });

document.addEventListener("click", function (){
  chatsetting.style.display ="none";
});

// ============================================================
// DARK MODE
// ============================================================
let darkmode = document.querySelector("#darkmode");
darkmode.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
    });

// ============================================================
// PROFILE ELEMENTS
// ============================================================

let profileScreen =
    document.querySelector("#profileScreen");

let profile =
    document.querySelector("#profile");

let profileScreenClose =
    document.querySelector("#profileScreenClose");

let editProfileBtn =
    document.querySelector("#editProfile");





// ============================================================
// CURRENT USER PROFILE
// ============================================================

profile.addEventListener(
    "click",
    async function (event) {

        event.stopPropagation();


        profileScreen.style.display =
            "block";


        try {

            let token =
                localStorage.getItem(
                    "token"
                );


            if (!token) {

                alert(
                    "Token nahi mila"
                );

                return;

            }


            let response =
                await fetch(
                    `${BACKEND_URL}/api/auth/me`,
                    {

                        method: "GET",

                        headers: {
                            "Authorization":
                                "Bearer " +
                                token
                        }

                    }
                );


            let result =
                await response.json();


            if (
                !response.ok
            ) {

                alert(
                    result.error ||
                    "Profile load nahi hui"
                );

                return;

            }


            let user =
                result.user;


            document.querySelector(
                "#profileName"
            ).textContent =
                "👤 " +
                user.username;


            document.querySelector(
                "#profileEmail"
            ).textContent =
                user.email;


            document.querySelector(
                "#profileBio"
            ).textContent = user.bio||
                "Hello! I'm using MK Chat";

          
            // Current user profile
            editProfileBtn.textContent =
                "Edit Profile";


            editProfileBtn.dataset.mode =
                "edit";


        }

        catch (error) {

            console.error(
                error
            );

            alert(
                "Profile load karne me error aaya"
            );

        }

    }
);

// ============================================================
// CLOSE PROFILE
// ============================================================

profileScreenClose.addEventListener(
    "click",
    function () {

        profileScreen.style.display =
            "none";

    }
);


// ============================================================
// SEARCH USER
// ============================================================

let searchInput =
    document.querySelector(
        "#searchInput"
    );


let searchResult =
    document.querySelector(
        "#searchResult"
    );


searchInput.addEventListener(
    "input",
    async function () {

        let text =
            searchInput.value.trim();


        searchResult.innerHTML =
            "";


        if (!text) {

            return;

        }


        try {

            let token =
                localStorage.getItem(
                    "token"
                );


            let currentUser =
                JSON.parse(
                    localStorage.getItem(
                        "currentUser"
                    )
                );


            if (!token) {

                alert(
                    "Login token nahi mila"
                );

                return;

            }


            let response =
                await fetch(
                    `${BACKEND_URL}/api/users/search?q=${encodeURIComponent(text)}`,
                    {

                        method: "GET",

                        headers: {
                            "Authorization":
                                "Bearer " +
                                token
                        }

                    }
                );


            let result =
                await response.json();


            if (
                !response.ok
            ) {

                alert(
                    result.error ||
                    "Users search nahi ho paaye"
                );

                return;

            }


            let users =
                result.users || [];


            users.forEach(
                function (user) {


                    // Apna account hide
                    if (
                        currentUser &&
                        String(user._id) ===
                        String(currentUser.id)
                    ) {

                        return;

                    }


                    let div =
                        document.createElement(
                            "div"
                        );


                    div.className =
                        "user";


                    div.textContent =
                        "👤 " +
                        user.username;


                    searchResult.appendChild(
                        div
                    );


                    // User click
                    div.addEventListener(
                        "click",
                        function () {


                            // Selected user ID
                            localStorage.setItem(
                                "selectedUserId",
                                user._id
                            );


                            // Profile show
                            document.querySelector(
                                "#profileName"
                            ).textContent =
                                "👤 " +
                                user.username;


                            document.querySelector(
                                "#profileEmail"
                            ).textContent =
                                user.email ||
                                "";


                            document.querySelector(
                                "#profileBio"
                            ).textContent =
                                user.bio ||
                                "Hello! I'm using MK Chat";


                            // Message mode
                            editProfileBtn.textContent =
                                "Message";


                            editProfileBtn.dataset.mode =
                                "message";


                            // Profile open
                            profileScreen.style.display =
                                "block";


                            // Search clear
                            searchResult.innerHTML =
                                "";


                            searchInput.value =
                                "";

                        }
                    );

                }
            );


        }

        catch (error) {

            console.error(
                "Search Error:",
                error
            );

            alert(
                "Server se users search nahi ho paaye!"
            );

        }

    }
);


// ============================================================
// EDIT PROFILE / MESSAGE BUTTON
// ============================================================

editProfileBtn.addEventListener(
    "click",
    function () {

        let mode =
            editProfileBtn.dataset.mode;


        console.log(
            "Button Mode:",
            mode
        );


        // Current user
        if (
            mode ===
            "edit"
        ) {

            alert(
                "Edit Profile feature baad me banayenge"
            );

            return;

        }


        // Selected user
        if (
            mode ===
            "message"
        ) {

            let selectedUserId =
                localStorage.getItem(
                    "selectedUserId"
                );


            if (!selectedUserId) {

                alert(
                    "Please select a user first"
                );

                return;

            }


            let profileName =
                document.querySelector(
                    "#profileName"
                ).textContent;


            document.querySelector(
                "#chatUserName"
            ).textContent =
                profileName;


            profileScreen.style.display =
                "none";


            chatScreen.style.display =
                "block";


            // Chat load
            loadUserStatus();
            loadMessages();
        

        }

    }
);

// ============================================================
// CHAT ELEMENTS
// ============================================================

let chatScreen =
    document.querySelector("#chatScreen");

let backBtn =
    document.querySelector("#backBtn");

let sendBtn =
    document.querySelector("#sendBtn");

let messageInput =
    document.querySelector("#messageInput");

let messages =
    document.querySelector("#messages");


// ============================================================
// MESSAGE MENU ELEMENTS
// ============================================================

let messageMenu =
    document.querySelector("#messageMenu");

let copyMessageBtn =
    document.querySelector("#copyMessage");

let replyMessageBtn =
    document.querySelector("#replyMessage");

let deleteMessageOption =
    document.querySelector("#deleteMessageOption");


// Currently selected message
let selectedMessage = null;

// Reply ke liye selected message
let selectedReply = null;

// Currently editing message
let editingMessageId = null;

// Long press timer
let longPressTimer = null;

// Long press time
const LONG_PRESS_TIME = 600;


// ============================================================
// CHAT BACK
// ============================================================

backBtn.addEventListener(
    "click",
    function () {

        chatScreen.style.display = "none";

        // Message menu bhi close
        messageMenu.style.display = "none";
        
        homeScreen.style.display = "block";

    }
);


// ============================================================
// SEND BUTTON
// ============================================================

sendBtn.addEventListener(
    "click",
    function () {

        console.log(
            "✅ Send button clicked"
        );

        sendMessage();

    }
);


// ============================================================
// ENTER KEY SEND
// ============================================================

messageInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            event.preventDefault();

            console.log(
                "✅ Enter key pressed"
            );

            sendMessage();

        }

    }
);


// ============================================================
// JOIN USER ROOM
// ============================================================

function joinUserRoom() {

    let currentUser =
        JSON.parse(
            localStorage.getItem(
                "currentUser"
            )
        );


    if (
        currentUser &&
        socket.connected
    ) {

        socket.emit(
            "join_room",
            String(
                currentUser.id
            )
        );


        console.log(
            "👤 Joined personal room:",
            currentUser.id
        );

    }

}


// ============================================================
// SEND OR EDIT MESSAGE
// ============================================================

async function sendMessage() {

    let text =
        messageInput.value.trim();


    if (!text) {
        return;
    }


    // ========================================================
    // EDIT MODE
    // ========================================================

    if (editingMessageId) {

        await editMessage(
            editingMessageId,
            text
        );

        return;
    }


    // ========================================================
    // NORMAL SEND MODE
    // ========================================================

    let currentUser =
        JSON.parse(
            localStorage.getItem(
                "currentUser"
            )
        );


    let selectedUserId =
        localStorage.getItem(
            "selectedUserId"
        );


    if (
        !currentUser ||
        !selectedUserId
    ) {

        alert(
            "User information missing"
        );

        return;

    }


    if (
        !socket.connected
    ) {

        alert(
            "Server se connection nahi hai"
        );

        return;

    }


    // Send message through Socket.IO
socket.emit("send_message", {
    senderId: currentUser.id,
    receiverId: selectedUserId,
    text: text,
    replyTo: selectedReply
        ? {
              messageId: selectedReply._id,
              senderId: selectedReply.senderId,
              text: selectedReply.text
          }
        : null
});

// 👇 ISKE BAAD
loadChats();

    // Clear input
    messageInput.value = "";
    selectedReply = null;

document.querySelector("#replyPreview").style.display = "none";

}

// ============================================================
// EDIT MESSAGE FUNCTION
// ============================================================

async function editMessage(
    messageId,
    newText
) {

    let token =
        localStorage.getItem(
            "token"
        );


    if (!token) {

        alert(
            "Login token nahi mila"
        );

        return;

    }


    try {

        let response =
            await fetch(
                `${BACKEND_URL}/api/messages/${messageId}`,
                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            "Bearer " +
                            token

                    },

                    body:
                        JSON.stringify({

                            text:
                                newText

                        })

                }
            );


        let result =
            await response.json();


        if (
            !response.ok
        ) {

            alert(
                result.error ||
                "Message edit nahi hua"
            );

            return;

        }


        console.log(
            "✅ Message edited:",
            result.updatedMessage
        );


        // ====================================================
        // UI UPDATE
        // ====================================================

        let messageElement =
            document.querySelector(
                `[data-message-id="${messageId}"]`
            );


        if (
            messageElement
        ) {

            let textSpan =
                messageElement.querySelector(
                    "span"
                );


            if (
                textSpan
            ) {

                textSpan.textContent =
                    result.updatedMessage.text;


                let editedSpan =
                    document.createElement(
                        "span"
                    );


                editedSpan.textContent =
                    " (edited)";


                editedSpan.style.fontSize =
                    "11px";


                editedSpan.style.opacity =
                    "0.7";


                textSpan.appendChild(
                    editedSpan
                );

            }

        }


        // ====================================================
        // RESET EDIT MODE
        // ====================================================

        messageInput.value =
            "";

        editingMessageId =
            null;


    }

    catch (error) {

        console.error(
            "Edit Message Error:",
            error
        );


        alert(
            "Message edit karne me error aaya"
        );

    }

}

// ============================================================
// RECEIVE REALTIME MESSAGE
// ============================================================

// ============================================================
// RECEIVE REALTIME MESSAGE
// ============================================================

socket.on(
    "receive_message",
    function (message) {

        console.log(
            "📩 New Message:",
            message
        );


        let currentUser =
            JSON.parse(
                localStorage.getItem(
                    "currentUser"
                )
            );


        let selectedUserId =
            localStorage.getItem(
                "selectedUserId"
            );


        if (!currentUser) {
            return;
        }


        // ====================================================
        // CURRENT CHAT CHECK
        // ====================================================

        let isCurrentChat =

            (
                String(message.senderId) ===
                String(currentUser.id)
                &&
                String(message.receiverId) ===
                String(selectedUserId)
            )

            ||

            (
                String(message.senderId) ===
                String(selectedUserId)
                &&
                String(message.receiverId) ===
                String(currentUser.id)
            );


        // ====================================================
        // SHOW MESSAGE ONLY ONCE
        // ====================================================

        if (isCurrentChat) {

            showMessage(message);

        }


        // ====================================================
        // DELIVERY CONFIRMATION
        // Only receiver sends this
        // ====================================================

        if (
            String(message.receiverId) ===
            String(currentUser.id)
        ) {

            socket.emit(
                "message_received",
                {
                    messageId: message._id
                }
            );

        }


        // ====================================================
        // UPDATE CHAT LIST
        // ====================================================

        loadChats();

    }
);


// ============================================================
// SHOW MESSAGE
// ============================================================

function showMessage(message) {

    let currentUser =
        JSON.parse(
            localStorage.getItem(
                "currentUser"
            )
        );


    if (!currentUser) {

        return;

    }


    // ========================================================
    // MESSAGE ID
    // ========================================================

    let messageId =
        message._id ||
        message.id;


    // ========================================================
    // MESSAGE DIV
    // ========================================================

    let div =
        document.createElement(
            "div"
        );


    div.classList.add(
        "message"
    );


    // MongoDB message ID
    div.dataset.messageId =
        String(
            messageId
        );


    // ========================================================
    // MESSAGE TEXT
    // ========================================================

    // ========================================================
// REPLY PREVIEW
// ========================================================

if (
    message.replyTo &&
    message.replyTo.messageId
) {

    let repliedDiv =
        document.createElement(
            "div"
        );


    repliedDiv.className =
        "repliedMessage";


    repliedDiv.textContent =
        "↩️ " +
        message.replyTo.text;


    div.appendChild(
        repliedDiv
    );

}


// ========================================================
// CURRENT MESSAGE TEXT
// ========================================================

let textSpan =
    document.createElement(
        "span"
    );


textSpan.textContent =
    message.text;

if (message.edited === true) {

    let editedSpan =
        document.createElement("span");

    editedSpan.textContent =
        " (edited)";

    editedSpan.style.fontSize =
        "11px";

    editedSpan.style.opacity =
        "0.7";

    textSpan.appendChild(
        editedSpan
    );

}


div.appendChild(
    textSpan
);


    // ========================================================
    // USER ID CHECK
    // ========================================================

    let senderId =
        String(
            message.senderId
        );


    let currentUserId =
        String(
            currentUser.id
        );


    // ========================================================
    // MY MESSAGE
    // ========================================================

    if (
        senderId ===
        currentUserId
    ) {

        div.classList.add(
            "myMessage"
        );
        // ========================================================
// MESSAGE STATUS / TICKS
// ========================================================

let statusSpan =
    document.createElement("span");

statusSpan.className =
    "messageStatus";

let messageStatus =
    message.status || "sent";

if (messageStatus === "read") {

    statusSpan.textContent = "✓✓";
    statusSpan.style.color = "#2196F3";

}
else if (messageStatus === "delivered") {

    statusSpan.textContent = "✓✓";

}
else {

    statusSpan.textContent = "✓";

}

div.appendChild(statusSpan);


        // Delete button
        let deleteBtn =
            document.createElement(
                "button"
            );


        deleteBtn.textContent =
            "Delete";


        deleteBtn.className =
            "deleteBtn";


        deleteBtn.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();


                deleteMessage(
                    messageId,
                    div
                );

            }
        );


        div.appendChild(
            deleteBtn
        );

    }


    // ========================================================
    // RECEIVED MESSAGE
    // ========================================================

    else {

        div.classList.add(
            "receivedMessage"
        );

    }


    // ========================================================
    // ADD MESSAGE TO SCREEN
    // ========================================================

    messages.appendChild(
        div
    );


    // ========================================================
    // ENABLE LONG PRESS
    // ========================================================

    addLongPressToMessage(
        div,
        message
    );


    // ========================================================
    // SCROLL TO BOTTOM
    // ========================================================

    messages.scrollTop =
        messages.scrollHeight;

}


// ============================================================
// LONG PRESS MESSAGE FUNCTION
// ============================================================

function addLongPressToMessage(
    messageElement,
    messageData
) {

    let timer = null;


    // ========================================================
    // MOBILE TOUCH START
    // ========================================================

    messageElement.addEventListener(
        "touchstart",
        function (event) {

            timer =
                setTimeout(
                    function () {

                        openMessageMenu(
                            messageData,
                            event
                        );

                    },
                    LONG_PRESS_TIME
                );

        },
        {
            passive: true
        }
    );


    // ========================================================
    // MOBILE TOUCH END
    // ========================================================

    messageElement.addEventListener(
        "touchend",
        function () {

            clearTimeout(
                timer
            );

        }
    );


    // ========================================================
    // MOBILE TOUCH MOVE
    // ========================================================

    messageElement.addEventListener(
        "touchmove",
        function () {

            clearTimeout(
                timer
            );

        }
    );


    // ========================================================
    // PC MOUSE DOWN
    // ========================================================

    messageElement.addEventListener(
        "mousedown",
        function (event) {

            timer =
                setTimeout(
                    function () {

                        openMessageMenu(
                            messageData,
                            event
                        );

                    },
                    LONG_PRESS_TIME
                );

        }
    );


    // ========================================================
    // PC MOUSE UP
    // ========================================================

    messageElement.addEventListener(
        "mouseup",
        function () {

            clearTimeout(
                timer
            );

        }
    );


    // ========================================================
    // PC MOUSE LEAVE
    // ========================================================

    messageElement.addEventListener(
        "mouseleave",
        function () {

            clearTimeout(
                timer
            );

        }
    );


    // ========================================================
    // RIGHT CLICK
    // ========================================================

    messageElement.addEventListener(
        "contextmenu",
        function (event) {

            event.preventDefault();


            openMessageMenu(
                messageData,
                event
            );

        }
    );

}


// ============================================================
// DELETE MESSAGE
// ============================================================

async function deleteMessage(
    messageId,
    messageElement
) {

    let token =
        localStorage.getItem(
            "token"
        );


    if (!token) {

        alert(
            "Login token nahi mila"
        );

        return;

    }


    try {

        let response =
            await fetch(
                `${BACKEND_URL}/api/messages/${messageId}`,
                {

                    method: "DELETE",

                    headers: {

                        "Authorization":
                            "Bearer " +
                            token

                    }

                }
            );


        let result =
            await response.json();


        if (!response.ok) {

            alert(
                result.error ||
                "Message delete nahi hua"
            );

            return;

        }


        // Sirf selected message remove
        if (
            messageElement &&
            messageElement.parentNode
        ) {

            messageElement.remove();

        }


        console.log(
            "✅ Message deleted:",
            messageId
        );

    }


    catch (error) {

        console.error(
            "Delete Message Error:",
            error
        );


        alert(
            "Message delete karne me error aaya"
        );

    }

}


// ============================================================
// LOAD MESSAGES FROM BACKEND
// ============================================================

async function loadMessages() {

    let selectedUserId =
        localStorage.getItem(
            "selectedUserId"
        );


    let token =
        localStorage.getItem(
            "token"
        );


    if (
        !selectedUserId ||
        !token
    ) {

        console.log(
            "Chat information missing"
        );

        return;

    }


    try {

        let response =
            await fetch(
                `${BACKEND_URL}/api/messages/${selectedUserId}`,
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            "Bearer " +
                            token

                    }

                }
            );


        let result =
            await response.json();


        if (!response.ok) {

            alert(
                result.error ||
                "Messages load nahi hue"
            );

            return;

        }


        // Chat open hone par purane messages clear
        messages.innerHTML = "";


        let allMessages =
            result.messages ||
            [];


        allMessages.forEach(
            function (message) {

                showMessage(
                    message
                );

            }
        );
        // Chat open hote hi messages read mark karo
socket.emit("read_messages", {
    senderId: selectedUserId
});


        console.log(
            "✅ Chat loaded:",
            allMessages.length
        );

    }


    catch (error) {

        console.error(
            "Load Messages Error:",
            error
        );


        alert(
            "Server se messages load nahi ho paaye"
        );

    }

}


// ============================================================
// OPEN MESSAGE MENU
// ============================================================
// ============================================================
// OPEN MESSAGE MENU
// ============================================================

function openMessageMenu(message, event) {

    // Selected message save
    selectedMessage = message;


    // ========================================================
    // CURRENT USER
    // ========================================================

    let currentUser =
        JSON.parse(
            localStorage.getItem("currentUser")
        );


    if (!currentUser) {
        console.log("Current user not found");
        return;
    }


    // ========================================================
    // EDIT & DELETE OPTIONS
    // ========================================================

    let editMessageOption =
        document.querySelector("#editMessage");

    let deleteMessageOption =
        document.querySelector("#deleteMessageOption");


    // ========================================================
    // CHECK MY MESSAGE OR RECEIVED MESSAGE
    // ========================================================

    let isMyMessage =
        String(message.senderId) ===
        String(currentUser.id);


    // ========================================================
    // MY MESSAGE
    // ========================================================

    if (isMyMessage) {

        if (editMessageOption) {
            editMessageOption.style.display =
                "block";
        }

        if (deleteMessageOption) {
            deleteMessageOption.style.display =
                "block";
        }

    }


    // ========================================================
    // RECEIVED MESSAGE
    // ========================================================

    else {

        if (editMessageOption) {
            editMessageOption.style.display =
                "none";
        }

        if (deleteMessageOption) {
            deleteMessageOption.style.display =
                "none";
        }

    }


    // ========================================================
    // MENU SHOW
    // ========================================================

    messageMenu.style.display =
        "block";


    // ========================================================
    // MENU POSITION
    // ========================================================

    let x = 100;
    let y = 100;


    // Mobile Touch
    if (
        event &&
        event.touches &&
        event.touches.length > 0
    ) {

        x =
            event.touches[0].clientX;

        y =
            event.touches[0].clientY;

    }


    // PC Mouse
    else if (event) {

        x =
            event.clientX;

        y =
            event.clientY;

    }


    // ========================================================
    // MENU SIZE
    // ========================================================

    let menuWidth = 180;
    let menuHeight = 220;


    // Right side limit
    if (
        x + menuWidth >
        window.innerWidth
    ) {

        x =
            window.innerWidth -
            menuWidth -
            10;

    }


    // Bottom limit
    if (
        y + menuHeight >
        window.innerHeight
    ) {

        y =
            window.innerHeight -
            menuHeight -
            10;

    }


    // ========================================================
    // FINAL MENU POSITION
    // ========================================================

    messageMenu.style.left =
        x + "px";

    messageMenu.style.top =
        y + "px";


    console.log(
        "✅ Message menu opened:",
        message
    );

}


// ============================================================
// CLOSE MESSAGE MENU
// ============================================================
document.addEventListener("click",function (event) {
if (messageMenu.style.display ==="block"
            &&
    !messageMenu.contains(event.target)
    ) {
    messageMenu.style.display ="none";
      }
    });


// ============================================================
// COPY MESSAGE
// ============================================================
copyMessageBtn.addEventListener("click",async function () {
if (!selectedMessage) {
  return;
}

 try { await navigator.clipboard.writeText(selectedMessage.text); }

 catch (error) { console.log("Copy failed", error ); }

// Menu close
     messageMenu.style.display = "none";
 });


// ============================================================
// DELETE FROM MESSAGE MENU
// ============================================================

deleteMessageOption.addEventListener(
    "click",
    async function () {

        if (!selectedMessage) {

            return;

        }


        let currentUser =
            JSON.parse(
                localStorage.getItem(
                    "currentUser"
                )
            );


        if (!currentUser) {

            return;

        }


        // Sirf apna message delete
        if (
            String(
                selectedMessage.senderId
            )
            !==
            String(
                currentUser.id
            )
        ) {

            alert(
                "Aap sirf apne message delete kar sakte hain"
            );


            messageMenu.style.display =
                "none";


            return;

        }


        // Message ID
        let messageId =
            selectedMessage._id ||
            selectedMessage.id;


        // DOM message find
        let messageElement =
            document.querySelector(
                `[data-message-id="${messageId}"]`
            );


        // Backend se delete
        await deleteMessage(
            messageId,
            messageElement
        );


        // Menu close
        messageMenu.style.display =
            "none";


        // Selected message clear
        selectedMessage =
            null;
 });


// ============================================================
// REPLY MESSAGE
// ============================================================
let replyPreview =document.querySelector("#replyPreview");
let replyText =document.querySelector("#replyText");
let cancelReply =document.querySelector("#cancelReply");
replyMessageBtn.addEventListener("click",function () {
  if (!selectedMessage) {
            return;
        }
        
  // Reply ke liye message save
    selectedReply = selectedMessage;

// Reply message show karo
replyText.textContent =selectedMessage.text;

// Reply preview open
replyPreview.style.display ="flex";

// Message menu close
messageMenu.style.display ="none";

// Input par focus
messageInput.focus();
 });

cancelReply.addEventListener("click",function () {
  replyPreview.style.display ="none";
  selectedMessage = null;
  replyText.textContent = "";
  messageInput.focus();
  });
  
  // ============================================================
// EDIT MESSAGE
// ============================================================

let editMessageBtn =
    document.querySelector("#editMessage");
editMessageBtn.addEventListener(
    "click",
    function () {

        if (!selectedMessage) {
            return;
        }


        // Message input me old message show
        messageInput.value =
            selectedMessage.text;


        // Input focus
        messageInput.focus();


        // Editing mode ON
        editingMessageId =
            selectedMessage._id;


        // Menu close
        messageMenu.style.display =
            "none";


        console.log(
            "✍️ Editing message:",
            editingMessageId
        );

    }
);

let forwardSelectedUsers = [];

let forwardMessageBtn =
    document.querySelector(
        "#forwardMessage"
    );

let forwardModal =
    document.querySelector(
        "#forwardModal"
    );

let closeForwardModal =
    document.querySelector(
        "#closeForwardModal"
    );

let forwardSearchInput =
    document.querySelector(
        "#forwardSearchInput"
    );

let forwardUsersList =
    document.querySelector(
        "#forwardUsersList"
    );

let forwardSelectedCount =
    document.querySelector(
        "#forwardSelectedCount"
    );

let confirmForwardBtn =
    document.querySelector(
        "#confirmForwardBtn"
    );
    
forwardMessageBtn.addEventListener(
    "click",
    function () {

        if (!selectedMessage) {
            return;
        }


        // Previous selection clear
        forwardSelectedUsers = [];


        // Modal open
        forwardModal.style.display =
            "block";


        // Search clear
        forwardSearchInput.value =
            "";


        updateForwardSelectedCount();


        // Users load
        loadForwardUsers();


        // Message menu close
        messageMenu.style.display =
            "none";

    }
); 
async function loadForwardUsers(
    searchText = ""
) {

    let token =
        localStorage.getItem(
            "token"
        );


    if (!token) {
        return;
    }


    try {

        let response =
            await fetch(
                `${BACKEND_URL}/api/users/search?q=${encodeURIComponent(searchText)}`,
                {

                    headers: {

                        "Authorization":
                            "Bearer " +
                            token

                    }

                }
            );


        let result =
            await response.json();


        if (!response.ok) {

            console.log(
                result.error
            );

            return;

        }


        forwardUsersList.innerHTML =
            "";


        let currentUser =
            JSON.parse(
                localStorage.getItem(
                    "currentUser"
                )
            );


        result.users.forEach(
            function (user) {

                // Apna account hide
                if (
                    String(user._id) ===
                    String(currentUser.id)
                ) {

                    return;

                }


                let div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "forwardUser";


                let checkbox =
                    document.createElement(
                        "input"
                    );


                checkbox.type =
                    "checkbox";


                checkbox.value =
                    user._id;


                let name =
                    document.createElement(
                        "span"
                    );


                name.textContent =
                    user.username;


                div.appendChild(
                    checkbox
                );


                div.appendChild(
                    name
                );


                div.addEventListener(
                    "click",
                    function (event) {

                        if (
                            event.target !==
                            checkbox
                        ) {

                            checkbox.checked =
                                !checkbox.checked;

                        }


                        toggleForwardUser(
                            user._id,
                            user
                        );

                    }
                );


                forwardUsersList.appendChild(
                    div
                );

            }
        );


    } catch (error) {

        console.error(
            "Forward Users Error:",
            error
        );

    }

}

function toggleForwardUser(
    userId,
    user
) {

    let index =
        forwardSelectedUsers.findIndex(
            function (item) {

                return String(
                    item._id
                ) ===
                String(userId);

            }
        );


    // Already selected
    if (
        index !== -1
    ) {

        forwardSelectedUsers.splice(
            index,
            1
        );

    }

    // Select new user
    else {

        forwardSelectedUsers.push(
            user
        );

    }


    updateForwardSelectedCount();

}

function updateForwardSelectedCount() {

    let count =
        forwardSelectedUsers.length;


    forwardSelectedCount.textContent =
        count +
        " selected";


    confirmForwardBtn.disabled =
        count === 0;

}

forwardSearchInput.addEventListener(
    "input",
    function () {

        let text =
            forwardSearchInput.value.trim();


        loadForwardUsers(
            text
        );

    }
);
confirmForwardBtn.addEventListener(
    "click",
    async function () {

        if (
            !selectedMessage ||
            forwardSelectedUsers.length === 0
        ) {

            return;

        }


        let token =
            localStorage.getItem(
                "token"
            );


        let receiverIds =
            forwardSelectedUsers.map(
                function (user) {

                    return String(
                        user._id
                    );

                }
            );


        confirmForwardBtn.disabled =
            true;


        try {

            let response =
                await fetch(
                    `${BACKEND_URL}/api/messages/forward`,
                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                "Bearer " +
                                token

                        },

                        body:
                            JSON.stringify({

                                messageId:
                                    selectedMessage._id,

                                receiverIds:
                                    receiverIds

                            })

                    }
                );


            let result =
                await response.json();


            if (!response.ok) {

                alert(
                    result.error ||
                    "Message forward nahi hua"
                );

                return;

            }


            // Modal close
            forwardModal.style.display =
                "none";


            // Selection clear
            forwardSelectedUsers =
                [];


            updateForwardSelectedCount();


            console.log(
                "✅ Message forwarded",
                result.messages
            );


        } catch (error) {

            console.error(
                "Forward Error:",
                error
            );


            alert(
                "Message forward karne me error aaya"
            );

        }


        confirmForwardBtn.disabled =
            false;

    }
);
closeForwardModal.addEventListener(
    "click",
    function () {

        forwardModal.style.display =
            "none";

        forwardSelectedUsers =
            [];

        updateForwardSelectedCount();

    }
);

async function clearChat() {

    let selectedUserId =
        localStorage.getItem(
            "selectedUserId"
        );

    let token =
        localStorage.getItem(
            "token"
        );


    if (
        !selectedUserId ||
        !token
    ) {

        alert(
            "Chat information missing"
        );

        return;

    }


    let confirmClear =
        confirm(
            "Kya aap is chat ko clear karna chahte hain?"
        );


    if (!confirmClear) {

        return;

    }


    try {

        let response =
            await fetch(
                `${BACKEND_URL}/api/messages/clear-for-me/${selectedUserId}`,
                {

                    method: "DELETE",

                    headers: {

                        "Authorization":
                            "Bearer " +
                            token

                    }

                }
            );


        let result =
            await response.json();


        if (!response.ok) {

            alert(
                result.error ||
                "Chat clear nahi hui"
            );

            return;

        }


        // Sirf current screen clear
        messages.innerHTML = "";


        console.log(
            "✅ Chat cleared for current user"
        );


    } catch (error) {

        console.error(
            "Clear Chat Error:",
            error
        );

        alert(
            "Chat clear karne me error aaya"
        );

    }

}

// ============================================================
// CLEAR CHAT BUTTON
// ============================================================

let clearChatBtn =
    document.querySelector(
        "#clearChatBtn"
    );


clearChatBtn.addEventListener(
    "click",
    function () {

        clearChat();

    }
);

async function loadChats(){

let token=
localStorage.getItem(
"token"
);

let response=
await fetch(

`${BACKEND_URL}/api/chats`,

{

headers:{

Authorization:
"Bearer "+token

}

}

);

let result=
await response.json();

if(!result.success){

return;

}

let chatList=
document.querySelector(
"#chatList"
);

chatList.innerHTML="";

result.chats.forEach(

function(chat){

let div=
document.createElement(
"div"
);

div.className=
"chatItem";

let time=
new Date(
chat.lastMessageTime
);

div.innerHTML=

`
<div>

<h3>${chat.username}</h3>

<p class="lastMessage">

${chat.lastMessage}

</p>

</div>

<span class="lastTime">

${time.toLocaleTimeString([],{

hour:"2-digit",

minute:"2-digit"

})}

</span>

`;

div.addEventListener("click", function () {

    localStorage.setItem(
        "selectedUserId",
        chat.userId
    );

    document.querySelector(
        "#chatUserName"
    ).textContent =
        chat.username;

    homeScreen.style.display =
        "none";

    chatScreen.style.display =
        "block";
loadUserStatus();
    loadMessages();

});

chatList.appendChild(
div
);

}

);

}

/*async function loadUserStatus(){

let token=localStorage.getItem("token");

let userId=localStorage.getItem("selectedUserId");

let response=await fetch(

`${BACKEND_URL}/api/users/${userId}/status`,

{

headers:{

Authorization:"Bearer "+token

}

}

);

let result=await response.json();

if(result.isOnline){

document.querySelector("#chatStatus").textContent="Online";

}else{

document.querySelector("#chatStatus").textContent=

"Last Seen "+
new Date(result.lastSeen).toLocaleTimeString();

}

}

socket.on("user_status", function(data){

let selectedUserId=
localStorage.getItem("selectedUserId");

if(data.userId!==selectedUserId){

return;

}

if(data.isOnline){

document.querySelector("#chatStatus").textContent="Online";

}else{

document.querySelector("#chatStatus").textContent=

"Last Seen "+
new Date(data.lastSeen).toLocaleTimeString();

}

});

let typingTimeout;

messageInput.addEventListener("input",function(){

let currentUser=
JSON.parse(localStorage.getItem("currentUser"));

let selectedUserId=
localStorage.getItem("selectedUserId");

socket.emit("typing",{

senderId:currentUser.id,

receiverId:selectedUserId

});

clearTimeout(typingTimeout);

typingTimeout=setTimeout(function(){

socket.emit("stop_typing",{

senderId:currentUser.id,

receiverId:selectedUserId

});

},1000);

});

socket.on("typing",function(data){

let selectedUserId=
localStorage.getItem("selectedUserId");

if(data.senderId===selectedUserId){

document.querySelector("#chatStatus").textContent="Typing...";

}

});

socket.on("stop_typing",function(data){

let selectedUserId=
localStorage.getItem("selectedUserId");

if(data.senderId===selectedUserId){

loadUserStatus();

}

});*/

async function loadUserStatus(){

let selectedUserId =
localStorage.getItem("selectedUserId");

let token =
localStorage.getItem("token");


if(!selectedUserId || !token){
    return;
}


let response =
await fetch(
`${BACKEND_URL}/api/users/${selectedUserId}/status`,
{

headers:{
Authorization:
"Bearer "+token
}

});


let result =
await response.json();


if(result.success){

let status =
document.querySelector("#chatStatus");


if(result.isOnline){

status.textContent =
"Online";

}

else if(result.lastSeen){

let time =
new Date(result.lastSeen);


status.textContent =
"Last seen "+
time.toLocaleString();

}

else{

status.textContent =
"Offline";

}

}

}
/*socket.on("user_status",function(data){

let selectedUserId =
localStorage.getItem("selectedUserId");


if(String(data.userId) === String(selectedUserId)){


if(data.isOnline){

document.querySelector("#chatStatus")
.textContent="Online";

}

else{

document.querySelector("#chatStatus")
.textContent=
"Last seen just now";

}

}

});*/
socket.on("user_status", function(data) {

    let selectedUserId =
        localStorage.getItem("selectedUserId");

    if (String(data.userId) === String(selectedUserId)) {

        if (data.isOnline) {

            document.querySelector("#chatStatus").textContent =
                "🟢 Online";

        } else {

            if (data.lastSeen) {

                let time = new Date(data.lastSeen);

                document.querySelector("#chatStatus").textContent =
                    "Last seen " + time.toLocaleString();

            } else {

                document.querySelector("#chatStatus").textContent =
                    "Offline";

            }

        }

    }

});
/*
// ============================================================
// CHAT ELEMENTS
// ============================================================

let chatScreen =
    document.querySelector(
        "#chatScreen"
    );


let backBtn =
    document.querySelector(
        "#backBtn"
    );


let sendBtn =
    document.querySelector(
        "#sendBtn"
    );


let messageInput =
    document.querySelector(
        "#messageInput"
    );


let messages =
    document.querySelector(
        "#messages"
    );


// =================================
// CHAT BACK
// ============================================================

backBtn.addEventListener(
    "click",
    function () {

        chatScreen.style.display =
            "none";

    }
);


// ============================================================
// SEND BUTTON
// ============================================================

sendBtn.addEventListener(
    "click",
    function () {

        console.log(
            "✅ Send button clicked"
        );

        sendMessage();

    }
);


// ============================================================
// ENTER KEY SEND
// ============================================================

messageInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key ===
            "Enter"
        ) {

            event.preventDefault();

            console.log(
                "✅ Enter key pressed"
            );

            sendMessage();

        }

    }
);


// ============================================================
// JOIN USER ROOM
// ============================================================

function joinUserRoom() {

    let currentUser =
        JSON.parse(
            localStorage.getItem(
                "currentUser"
            )
        );


    if (
        currentUser &&
        socket.connected
    ) {

        socket.emit(
            "join_room",
            String(
                currentUser.id
            )
        );


        console.log(
            "👤 Joined personal room:",
            currentUser.id
        );

    }

}


// ============================================================
// SEND MESSAGE
// ============================================================

function sendMessage() {

    let text =
        messageInput.value.trim();


    if (!text) {

        return;

    }


    let currentUser =
        JSON.parse(
            localStorage.getItem(
                "currentUser"
            )
        );


    let selectedUserId =
        localStorage.getItem(
            "selectedUserId"
        );


    if (
        !currentUser ||
        !selectedUserId
    ) {

        alert(
            "User information missing"
        );

        return;

    }


    if (
        !socket.connected
    ) {

        alert(
            "Server se connection nahi hai"
        );

        return;

    }


    // Backend Socket.IO
    socket.emit(
        "send_message",
        {

            senderId:
                String(
                    currentUser.id
                ),

            receiverId:
                String(
                    selectedUserId
                ),

            text:
                text

        }
    );


    // Input clear
    messageInput.value =
        "";

}


// ============================================================
// RECEIVE REALTIME MESSAGE
// ============================================================

socket.on(
    "receive_message",
    function (message) {

        console.log(
            "📩 New Message:",
            message
        );


        let currentUser =
            JSON.parse(
                localStorage.getItem(
                    "currentUser"
                )
            );


        let selectedUserId =
            localStorage.getItem(
                "selectedUserId"
            );


        if (
            !currentUser
        ) {

            return;

        }


        // Message kis chat ka hai
        let isCurrentChat =

            (
                String(
                    message.senderId
                ) ===
                String(
                    currentUser.id
                )
                &&
                String(
                    message.receiverId
                ) ===
                String(
                    selectedUserId
                )
            )

            ||

            (
                String(
                    message.senderId
                ) ===
                String(
                    selectedUserId
                )
                &&
                String(
                    message.receiverId
                ) ===
                String(
                    currentUser.id
                )
            );


        // Sirf current chat me show
        if (
            isCurrentChat
        ) {

            showMessage(
                message
            );

        }

    }
);


// ============================================================
// SHOW MESSAGE
// ============================================================

function showMessage(message) {

    let currentUser =
        JSON.parse(
            localStorage.getItem(
                "currentUser"
            )
        );


    if (
        !currentUser
    ) {

        return;

    }


    // Message ID
    let messageId =
        message._id ||
        message.id;


    // Message wrapper
    let div =
        document.createElement(
            "div"
        );


    div.classList.add(
        "message"
    );


    // Important:
    // MongoDB ID ko DOM me save kar rahe hain
    div.dataset.messageId =
        String(
            messageId
        );


    // Message text
    let textSpan =
        document.createElement(
            "span"
        );


    textSpan.textContent =
        message.text;


    div.appendChild(
        textSpan
    );


    // Sender check
    let senderId =
        String(
            message.senderId
        );


    let currentUserId =
        String(
            currentUser.id
        );


    // ========================================================
    // MY MESSAGE
    // ========================================================

    if (
        senderId ===
        currentUserId
    ) {

        div.classList.add(
            "myMessage"
        );


        // Delete button
        let deleteBtn =
            document.createElement(
                "button"
            );


        deleteBtn.textContent =
            "Delete";


        deleteBtn.className =
            "deleteBtn";


        deleteBtn.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();


                deleteMessage(
                    messageId,
                    div
                );

            }
        );


        div.appendChild(
            deleteBtn
        );

    }


    // ========================================================
    // RECEIVED MESSAGE
    // ========================================================

    else {

        div.classList.add(
            "receivedMessage"
        );

    }


    // Add message
    messages.appendChild(
        div
    );
// Message ko screen par add karo
messages.appendChild(div);

// Long press enable karo
div.addEventListener(
    "touchstart",
    function (event) {

        longPressTimer =
            setTimeout(function () {

                openMessageMenu(
                    message,
                    event
                );

            }, LONG_PRESS_TIME);

    }
);


// Touch release
div.addEventListener(
    "touchend",
    function () {

        clearTimeout(
            longPressTimer
        );

    }
);


// Touch move
div.addEventListener(
    "touchmove",
    function () {

        clearTimeout(
            longPressTimer
        );

    }
);


// PC par mouse long press
div.addEventListener(
    "mousedown",
    function (event) {

        longPressTimer =
            setTimeout(function () {

                openMessageMenu(
                    message,
                    event
                );

            }, LONG_PRESS_TIME);

    }
);


// Mouse release
div.addEventListener(
    "mouseup",
    function () {

        clearTimeout(
            longPressTimer
        );

    }
);

    // Scroll
    messages.scrollTop =
        messages.scrollHeight;

}

// ============================================================
// DELETE MESSAGE
// ============================================================

async function deleteMessage(
    messageId,
    messageElement
) {

    let token =
        localStorage.getItem(
            "token"
        );


    if (
        !token
    ) {

        alert(
            "Login token nahi mila"
        );

        return;

    }


    // ========================================================
    // IMPORTANT
    // Pehle UI se sirf selected message remove
    // Puri chat clear nahi hogi
    // ========================================================

    try {

        let response =
            await fetch(
                `${BACKEND_URL}/api/messages/${messageId}`,
                {

                    method: "DELETE",

                    headers: {
                        "Authorization":
                            "Bearer " +
                            token
                    }

                }
            );


        let result =
            await response.json();


        if (
            !response.ok
        ) {

            alert(
                result.error ||
                "Message delete nahi hua"
            );

            return;

        }


        // ====================================================
        // SUCCESS
        // Sirf deleted message DOM se remove
        // ====================================================

        if (
            messageElement &&
            messageElement.parentNode
        ) {

            messageElement.remove();

        }


        console.log(
            "✅ Message deleted:",
            messageId
        );


    }

    catch (error) {

        console.error(
            "Delete Message Error:",
            error
        );


        alert(
            "Message delete karne me error aaya"
        );

    }

}
  // ==========================================
// LONG PRESS EVENTS
// ==========================================

div.addEventListener(
    "touchstart",
    function (event) {

        longPressTimer =
            setTimeout(
                function () {

                    openMessageMenu(
                        message,
                        event
                    );

                },
                LONG_PRESS_TIME
            );

    },
    {
        passive: true
    }
);


div.addEventListener(
    "touchend",
    function () {

        clearTimeout(
            longPressTimer
        );

    }
);


div.addEventListener(
    "touchmove",
    function () {

        clearTimeout(
            longPressTimer
        );

    }
);

div.addEventListener(
    "contextmenu",
    function (event) {

        event.preventDefault();

        openMessageMenu(
            message,
            event
        );

    }
);


// ============================================================
// LOAD MESSAGES FROM BACKEND
// ============================================================

async function loadMessages() {

    let selectedUserId =
        localStorage.getItem(
            "selectedUserId"
        );


    let token =
        localStorage.getItem(
            "token"
        );


    if (
        !selectedUserId ||
        !token
    ) {

        console.log(
            "Chat information missing"
        );

        return;

    }


    try {

        let response =
            await fetch(
                `${BACKEND_URL}/api/messages/${selectedUserId}`,
                {

                    method: "GET",

                    headers: {
                        "Authorization":
                            "Bearer " +
                            token
                    }

                }
            );


        let result =
            await response.json();


        if (
            !response.ok
        ) {

            alert(
                result.error ||
                "Messages load nahi hue"
            );

            return;

        }


        // ====================================================
        // IMPORTANT
        // Sirf chat open karte waqt clear karo
        // Delete ke baad loadMessages() call nahi hoga
        // ====================================================

        messages.innerHTML =
            "";


        let allMessages =
            result.messages ||
            [];


        allMessages.forEach(
            function (message) {

                showMessage(
                    message
                );

            }
        );


        console.log(
            "✅ Chat loaded:",
            allMessages.length
        );


    }

    catch (error) {

        console.error(
            "Load Messages Error:",
            error
        );


        alert(
            "Server se messages load nahi ho paaye"
        );

    }

}

// ==========================================
// LONG PRESS MESSAGE MENU
// ==========================================

let messageMenu =
    document.querySelector("#messageMenu");

let copyMessageBtn =
    document.querySelector("#copyMessage");

let replyMessageBtn =
    document.querySelector("#replyMessage");

let deleteMessageOption =
    document.querySelector("#deleteMessageOption");


// Currently selected message
let selectedMessage = null;


// Long press timer
let longPressTimer;


// Long press time
const LONG_PRESS_TIME = 600;


// ==========================================
// SHOW LONG PRESS MENU
// ==========================================

function openMessageMenu(message, event) {

    selectedMessage = message;

    // Menu show
    messageMenu.style.display = "block";


    // Menu position
    let x;
    let y;


    // Mobile touch
    if (event.touches) {

        x = event.touches[0].clientX;
        y = event.touches[0].clientY;

    }

    // PC mouse
    else {

        x = event.clientX;
        y = event.clientY;

    }


    // Screen ke andar menu rakhna
    let menuWidth = 180;
    let menuHeight = 180;


    if (x + menuWidth > window.innerWidth) {
        x = window.innerWidth - menuWidth - 10;
    }


    if (y + menuHeight > window.innerHeight) {
        y = window.innerHeight - menuHeight - 10;
    }


    messageMenu.style.left = x + "px";
    messageMenu.style.top = y + "px";

}


// ==========================================
// CLOSE MENU
// ==========================================

document.addEventListener(
    "click",
    function (event) {

        if (
            messageMenu.style.display === "block" &&
            !messageMenu.contains(event.target)
        ) {

            messageMenu.style.display =
                "none";

        }

    }
);

// ==========================================
// COPY MESSAGE
// ==========================================

copyMessageBtn.addEventListener(
    "click",
    async function () {

        if (!selectedMessage) {
            return;
        }


        try {

            await navigator.clipboard.writeText(
                selectedMessage.text
            );

            alert("Message copied");

        } catch (error) {

            console.log(
                "Copy failed",
                error
            );

        }


        messageMenu.style.display =
            "none";

    }
);


// ==========================================
// DELETE MESSAGE
// ==========================================

deleteMessageOption.addEventListener(
    "click",
    async function () {

        if (!selectedMessage) {
            return;
        }


        // Sirf apna message delete
        let currentUser =
            JSON.parse(
                localStorage.getItem(
                    "currentUser"
                )
            );


        if (
            String(selectedMessage.senderId) !==
            String(currentUser.id)
        ) {

            alert(
                "Aap sirf apne message delete kar sakte hain"
            );

            messageMenu.style.display =
                "none";

            return;

        }


        // Backend delete
        await deleteMessage(
            selectedMessage._id
        );


        // Menu close
        messageMenu.style.display =
            "none";

    }
);


// ==========================================
// REPLY
// ==========================================

replyMessageBtn.addEventListener(
    "click",
    function () {

        if (!selectedMessage) {
            return;
        }


        // Input me message ka preview
        messageInput.value =
            "↩️ " +
            selectedMessage.text;


        // Input focus
        messageInput.focus();


        // Menu close
        messageMenu.style.display =
            "none";

    }
);
*/
/*
// ============================================================
// MK CHAT - COMPLETE FRONTEND JS
// Backend + MongoDB + JWT + Socket.IO
// ============================================================


// ============================================================
// 1. BACKEND URL
// ============================================================

const BACKEND_URL =
    "https://mk-web-backend.onrender.com";


// ============================================================
// 2. SOCKET.IO CONNECTION
// ============================================================

const socket = io(BACKEND_URL, {
    transports: ["polling", "websocket"]
});


// Socket connected
socket.on("connect", function () {

    console.log(
        "✅ Socket Connected:",
        socket.id
    );

    // Agar user pehle se login hai
    // to personal room join karo
    joinCurrentUserRoom();

});


// Socket connection error
socket.on("connect_error", function (error) {

    console.error(
        "❌ Socket Connection Error:",
        error
    );

});


// Socket disconnected
socket.on("disconnect", function () {

    console.log(
        "❌ Socket Disconnected"
    );

});


// ============================================================
// 3. GET HTML ELEMENTS
// ============================================================


// Login / Register
let newaccount =
    document.querySelector("#newaccount");

let newAccountScreen =
    document.querySelector("#newAccountScreen");

let close =
    document.querySelector("#close");

let homeScreen =
    document.querySelector("#homeScreen");


// Profile
let profileScreen =
    document.querySelector("#profileScreen");

let profile =
    document.querySelector("#profile");

let profileScreenClose =
    document.querySelector("#profileScreenClose");

let editProfileBtn =
    document.querySelector("#editProfile");


// Search
let searchInput =
    document.querySelector("#searchInput");

let searchResult =
    document.querySelector("#searchResult");


// Chat
let chatScreen =
    document.querySelector("#chatScreen");

let backBtn =
    document.querySelector("#backBtn");

let sendBtn =
    document.querySelector("#sendBtn");

let messageInput =
    document.querySelector("#messageInput");

let messages =
    document.querySelector("#messages");


// Settings
let setting =
    document.querySelector("#setting");

let h1 =
    document.querySelector("#h1");

let darkmode =
    document.querySelector("#darkmode");


// Logout
let logout =
    document.querySelector("#logout");


// ============================================================
// 4. HELPER FUNCTIONS
// ============================================================


// Current logged-in user
function getCurrentUser() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "currentUser"
            )
        );

    } catch (error) {

        console.error(
            "Current User Parse Error:",
            error
        );

        return null;

    }

}


// Get JWT token
function getToken() {

    return localStorage.getItem(
        "token"
    );

}


// Get selected user ID
function getSelectedUserId() {

    return localStorage.getItem(
        "selectedUserId"
    );

}


// ============================================================
// 5. JOIN PERSONAL SOCKET ROOM
// ============================================================

function joinCurrentUserRoom() {

    let currentUser =
        getCurrentUser();


    if (
        !currentUser ||
        !currentUser.id
    ) {

        console.log(
            "User login nahi hai, room join nahi hua"
        );

        return;

    }


    socket.emit(
        "join_room",
        String(currentUser.id)
    );


    console.log(
        "👤 Joined Personal Room:",
        currentUser.id
    );

}


// ============================================================
// 6. REGISTER SCREEN OPEN
// ============================================================

if (newaccount) {

    newaccount.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            newAccountScreen.style.display =
                "block";

        }
    );

}


if (newAccountScreen) {

    newAccountScreen.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

        }
    );

}


if (close) {

    close.addEventListener(
        "click",
        function () {

            newAccountScreen.style.display =
                "none";

        }
    );

}


// ============================================================
// 7. CREATE ACCOUNT / REGISTER
// ============================================================

let createBtn =
    document.querySelector(
        "#createAccount"
    );


if (createBtn) {

    createBtn.addEventListener(
        "click",
        async function () {

            let username =
                document.querySelector(
                    "#username"
                ).value.trim();


            let email =
                document.querySelector(
                    "#email"
                ).value.trim();


            let password =
                document.querySelector(
                    "#password"
                ).value;


            let confirmPassword =
                document.querySelector(
                    "#confirmPassword"
                ).value;


            // Empty check
            if (
                !username ||
                !email ||
                !password ||
                !confirmPassword
            ) {

                alert(
                    "Please fill all fields"
                );

                return;

            }


            // Password check
            if (
                password !==
                confirmPassword
            ) {

                alert(
                    "Passwords do not match"
                );

                return;

            }


            try {

                let response =
                    await fetch(
                        `${BACKEND_URL}/api/auth/register`,
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    username,
                                    email,
                                    password
                                })

                        }
                    );


                let result =
                    await response.json();


                console.log(
                    "Register Result:",
                    result
                );


                if (
                    response.ok &&
                    result.success
                ) {

                    alert(
                        "Account Successfully Ban Gaya! Ab Login Karein."
                    );


                    newAccountScreen.style.display =
                        "none";

                } else {

                    alert(
                        result.error ||
                        result.message ||
                        "Account create nahi hua"
                    );

                }


            } catch (error) {

                console.error(
                    "Register Error:",
                    error
                );


                alert(
                    "Server se connect nahi ho paya!"
                );

            }

        }
    );

}


// ============================================================
// 8. LOGIN
// ============================================================

let loginBtn =
    document.querySelector(
        "#loginBtn"
    );


if (loginBtn) {

    loginBtn.addEventListener(
        "click",
        async function () {

            let email =
                document.querySelector(
                    "#loginEmail"
                ).value.trim();


            let password =
                document.querySelector(
                    "#loginPassword"
                ).value;


            if (
                !email ||
                !password
            ) {

                alert(
                    "Email aur Password enter karein"
                );

                return;

            }


            try {

                let response =
                    await fetch(
                        `${BACKEND_URL}/api/auth/login`,
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    email,
                                    password
                                })

                        }
                    );


                let result =
                    await response.json();


                console.log(
                    "Login Result:",
                    result
                );


                if (
                    response.ok &&
                    result.success
                ) {


                    // User save
                    localStorage.setItem(
                        "currentUser",
                        JSON.stringify(
                            result.user
                        )
                    );


                    // JWT save
                    localStorage.setItem(
                        "token",
                        result.token
                    );


                    // Username show
                    document.querySelector(
                        "#userName"
                    ).textContent =
                        result.user.username;


                    // Login screen hide
                    document.querySelector(
                        "#screen1"
                    ).style.display =
                        "none";


                    // Home show
                    homeScreen.style.display =
                        "block";


                    // Personal Socket Room
                    joinCurrentUserRoom();


                    console.log(
                        "✅ Login Successful"
                    );

                } else {

                    alert(
                        result.error ||
                        result.message ||
                        "Galat Email ya Password!"
                    );

                }


            } catch (error) {

                console.error(
                    "Login Error:",
                    error
                );


                alert(
                    "Login Error! Internet check karein."
                );

            }

        }
    );

}


// ============================================================
// 9. AUTO LOGIN
// ============================================================

window.addEventListener(
    "load",
    function () {

        let savedUser =
            localStorage.getItem(
                "currentUser"
            );


        let savedToken =
            localStorage.getItem(
                "token"
            );


        if (
            savedUser &&
            savedToken
        ) {

            try {

                let user =
                    JSON.parse(
                        savedUser
                    );


                document.querySelector(
                    "#userName"
                ).textContent =
                    user.username;


                document.querySelector(
                    "#screen1"
                ).style.display =
                    "none";


                homeScreen.style.display =
                    "block";


                // Socket room join
                joinCurrentUserRoom();


                console.log(
                    "✅ Auto Login Successful"
                );


            } catch (error) {

                console.error(
                    "Auto Login Error:",
                    error
                );

            }


        } else {

            document.querySelector(
                "#screen1"
            ).style.display =
                "block";


            homeScreen.style.display =
                "none";

        }

    }
);


// ============================================================
// 10. LOGOUT
// ============================================================

if (logout) {

    logout.addEventListener(
        "click",
        async function () {


            let token =
                getToken();


            // Backend logout
            if (token) {

                try {

                    await fetch(
                        `${BACKEND_URL}/api/auth/logout`,
                        {

                            method: "POST",

                            headers: {
                                "Authorization":
                                    "Bearer " + token
                            }

                        }
                    );

                } catch (error) {

                    console.log(
                        "Backend Logout Error:",
                        error
                    );

                }

            }


            // Local data clear
            localStorage.removeItem(
                "currentUser"
            );


            localStorage.removeItem(
                "token"
            );


            localStorage.removeItem(
                "selectedUserId"
            );


            // Home hide
            homeScreen.style.display =
                "none";


            // Login show
            document.querySelector(
                "#screen1"
            ).style.display =
                "block";


            console.log(
                "✅ Logged Out"
            );

        }
    );

}


// ============================================================
// 11. SETTINGS
// ============================================================

if (h1) {

    h1.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();


            if (
                setting.style.display ===
                "block"
            ) {

                setting.style.display =
                    "none";

            } else {

                setting.style.display =
                    "block";

            }

        }
    );

}


if (setting) {

    setting.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

        }
    );

}


// ============================================================
// 12. DARK MODE
// ============================================================

if (darkmode) {

    darkmode.addEventListener(
        "click",
        function () {

            if (
                homeScreen.style.background ===
                "black"
            ) {

                homeScreen.style.background =
                    "yellow";

                homeScreen.style.color =
                    "black";

            } else {

                homeScreen.style.background =
                    "black";

                homeScreen.style.color =
                    "white";

            }

        }
    );

}


// ============================================================
// 13. OPEN CURRENT USER PROFILE
// ============================================================

if (profile) {

    profile.addEventListener(
        "click",
        async function (event) {

            event.stopPropagation();


            profileScreen.style.display =
                "block";


            // Current user mode
            editProfileBtn.textContent =
                "Edit Profile";


            editProfileBtn.dataset.mode =
                "edit";


            let token =
                getToken();


            if (!token) {

                alert(
                    "Token nahi mila. Please login karein."
                );

                return;

            }


            try {

                let response =
                    await fetch(
                        `${BACKEND_URL}/api/auth/me`,
                        {

                            method: "GET",

                            headers: {
                                "Authorization":
                                    "Bearer " + token
                            }

                        }
                    );


                let result =
                    await response.json();


                console.log(
                    "My Profile:",
                    result
                );


                if (!response.ok) {

                    alert(
                        result.error ||
                        result.message ||
                        "Profile load nahi hui"
                    );

                    return;

                }


                let user =
                    result.user;


                document.querySelector(
                    "#profileName"
                ).textContent =
                    "👤 " +
                    user.username;


                document.querySelector(
                    "#profileEmail"
                ).textContent =
                    user.email;


                document.querySelector(
                    "#profileBio"
                ).textContent =
                    "Hello! I'm using MK Chat";


            } catch (error) {

                console.error(
                    "Profile Error:",
                    error
                );


                alert(
                    "Profile load karne me error aaya"
                );

            }

        }
    );

}


// ============================================================
// 14. CLOSE PROFILE
// ============================================================

if (profileScreenClose) {

    profileScreenClose.addEventListener(
        "click",
        function () {

            profileScreen.style.display =
                "none";

        }
    );

}


// ============================================================
// 15. SEARCH USER FROM BACKEND
// ============================================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        async function () {


            let text =
                searchInput.value.trim();


            searchResult.innerHTML =
                "";


            if (!text) {

                return;

            }


            let token =
                getToken();


            let currentUser =
                getCurrentUser();


            if (!token) {

                alert(
                    "Login token nahi mila"
                );

                return;

            }


            try {

                let response =
                    await fetch(
                        `${BACKEND_URL}/api/users/search?q=${encodeURIComponent(text)}`,
                        {

                            method: "GET",

                            headers: {
                                "Authorization":
                                    "Bearer " + token
                            }

                        }
                    );


                let result =
                    await response.json();


                console.log(
                    "Search Result:",
                    result
                );


                if (!response.ok) {

                    alert(
                        result.error ||
                        result.message ||
                        "Search failed"
                    );

                    return;

                }


                let users =
                    result.users || [];


                users.forEach(
                    function (user) {


                        // Apna account hide
                        if (
                            currentUser &&
                            String(user._id) ===
                            String(currentUser.id)
                        ) {

                            return;

                        }


                        // User div
                        let div =
                            document.createElement(
                                "div"
                            );


                        div.className =
                            "user";


                        div.textContent =
                            "👤 " +
                            user.username;


                        searchResult.appendChild(
                            div
                        );


                        // User click
                        div.addEventListener(
                            "click",
                            function () {


                                // Selected User ID
                                localStorage.setItem(
                                    "selectedUserId",
                                    String(user._id)
                                );


                                console.log(
                                    "Selected User:",
                                    user._id
                                );


                                // Profile details
                                document.querySelector(
                                    "#profileName"
                                ).textContent =
                                    "👤 " +
                                    user.username;


                                document.querySelector(
                                    "#profileEmail"
                                ).textContent =
                                    user.email ||
                                    "";


                                document.querySelector(
                                    "#profileBio"
                                ).textContent =
                                    user.bio ||
                                    "Hello! I'm using MK Chat";


                                // Message mode
                                editProfileBtn.textContent =
                                    "Message";


                                editProfileBtn.dataset.mode =
                                    "message";


                                // Profile open
                                profileScreen.style.display =
                                    "block";


                                // Search clear
                                searchResult.innerHTML =
                                    "";


                                searchInput.value =
                                    "";

                            }
                        );

                    }
                );


            } catch (error) {

                console.error(
                    "Search Error:",
                    error
                );


                alert(
                    "Server se users search nahi ho paaye!"
                );

            }

        }
    );

}


// ============================================================
// 16. PROFILE BUTTON
// EDIT PROFILE / MESSAGE
// ============================================================

if (editProfileBtn) {

    editProfileBtn.addEventListener(
        "click",
        function () {


            let mode =
                editProfileBtn.dataset.mode;


            console.log(
                "Button Mode:",
                mode
            );


            // Current User
            if (
                mode === "edit"
            ) {

                alert(
                    "Edit Profile feature baad me banayenge"
                );

                return;

            }


            // Selected User
            if (
                mode === "message"
            ) {


                let selectedUserId =
                    getSelectedUserId();


                if (!selectedUserId) {

                    alert(
                        "Please select a user first"
                    );

                    return;

                }


                // Username
                let profileName =
                    document.querySelector(
                        "#profileName"
                    ).textContent;


                // Chat header
                document.querySelector(
                    "#chatUserName"
                ).textContent =
                    profileName;


                // Profile close
                profileScreen.style.display =
                    "none";


                // Chat open
                chatScreen.style.display =
                    "block";


                // Old messages load
                loadMessages();

            }

        }
    );

}


// ============================================================
// 17. CHAT BACK BUTTON
// ============================================================

if (backBtn) {

    backBtn.addEventListener(
        "click",
        function () {

            chatScreen.style.display =
                "none";


            messages.innerHTML =
                "";

        }
    );

}


// ============================================================
// 18. SEND BUTTON
// ============================================================

if (sendBtn) {

    sendBtn.addEventListener(
        "click",
        function () {

            console.log(
                "Send Button Clicked"
            );


            sendMessage();

        }
    );

}


// ============================================================
// 19. ENTER KEY SEND
// ============================================================

if (messageInput) {

    messageInput.addEventListener(
        "keydown",
        function (event) {


            if (
                event.key ===
                "Enter"
            ) {

                event.preventDefault();


                console.log(
                    "Enter Key Send"
                );


                sendMessage();

            }

        }
    );

}


// ============================================================
// 20. SEND MESSAGE
// SOCKET.IO -> BACKEND -> MONGODB
// ============================================================

function sendMessage() {


    console.log(
        "sendMessage() function called"
    );


    // Text
    let text =
        messageInput.value.trim();


    // Empty
    if (!text) {

        return;

    }


    // Current user
    let currentUser =
        getCurrentUser();


    // Selected user
    let selectedUserId =
        getSelectedUserId();


    console.log(
        "Current User:",
        currentUser
    );


    console.log(
        "Selected User ID:",
        selectedUserId
    );


    // Check
    if (
        !currentUser ||
        !currentUser.id
    ) {

        alert(
            "Current user information missing"
        );

        return;

    }


    if (!selectedUserId) {

        alert(
            "Please select a user first"
        );

        return;

    }


    // Socket connected?
    if (!socket.connected) {

        alert(
            "Server se connection nahi hai"
        );

        return;

    }


    // Send to backend
    socket.emit(
        "send_message",
        {

            senderId:
                String(currentUser.id),

            receiverId:
                String(selectedUserId),

            text:
                text

        }
    );


    console.log(
        "📤 Message Sent To Backend"
    );


    // Input clear
    messageInput.value =
        "";

}


// ============================================================
// 21. RECEIVE REALTIME MESSAGE
// BACKEND -> FRONTEND
// ============================================================

socket.on(
    "receive_message",
    function (message) {


        console.log(
            "📩 Message Received:",
            message
        );


        let currentUser =
            getCurrentUser();


        let selectedUserId =
            getSelectedUserId();


        if (
            !currentUser ||
            !selectedUserId
        ) {

            return;

        }


        let senderId =
            String(
                message.senderId
            );


        let receiverId =
            String(
                message.receiverId
            );


        let currentUserId =
            String(
                currentUser.id
            );


        let selectedId =
            String(
                selectedUserId
            );


        // Check message current open chat ka hai
        let isCurrentChat =

            (
                senderId ===
                currentUserId

                &&

                receiverId ===
                selectedId
            )

            ||

            (
                senderId ===
                selectedId

                &&

                receiverId ===
                currentUserId
            );


        if (
            isCurrentChat
        ) {

            showMessage(
                message
            );

        }


    }
);


// ============================================================
// 22. SHOW MESSAGE
// ============================================================

function showMessage(
    message
) {


    let currentUser =
        getCurrentUser();


    if (!currentUser) {

        return;

    }


    let div =
        document.createElement(
            "div"
        );


    div.classList.add(
        "message"
    );


    // Message text
    let textSpan =
        document.createElement(
            "span"
        );


    textSpan.textContent =
        message.text;


    div.appendChild(
        textSpan
    );


    // IDs string me
    let senderId =
        String(
            message.senderId
        );


    let currentUserId =
        String(
            currentUser.id
        );


    // My message
    if (
        senderId ===
        currentUserId
    ) {


        div.classList.add(
            "myMessage"
        );


        // Delete button
        let deleteBtn =
            document.createElement(
                "button"
            );


        deleteBtn.textContent =
            "Delete";


        deleteBtn.className =
            "deleteBtn";


        deleteBtn.addEventListener(
            "click",
            function () {


                let messageId =
                    message._id ||
                    message.id;


                deleteMessage(
                    messageId
                );


            }
        );


        div.appendChild(
            deleteBtn
        );


    } else {


        // Received
        div.classList.add(
            "receivedMessage"
        );

    }


    // Screen par add
    messages.appendChild(
        div
    );


    // Scroll bottom
    messages.scrollTop =
        messages.scrollHeight;

}


// ============================================================
// 23. LOAD MESSAGES FROM MONGODB
// ============================================================

async function loadMessages() {


    let currentUser =
        getCurrentUser();


    let selectedUserId =
        getSelectedUserId();


    let token =
        getToken();


    if (
        !currentUser ||
        !selectedUserId ||
        !token
    ) {

        console.log(
            "Chat information missing"
        );

        return;

    }


    try {


        // Chat clear
        messages.innerHTML =
            "";


        let response =
            await fetch(
                `${BACKEND_URL}/api/messages/${selectedUserId}`,
                {

                    method: "GET",

                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }

                }
            );


        let result =
            await response.json();


        console.log(
            "Loaded Messages:",
            result
        );


        if (!response.ok) {

            alert(
                result.error ||
                result.message ||
                "Messages load nahi hue"
            );

            return;

        }


        let allMessages =
            result.messages || [];


        allMessages.forEach(
            function (message) {

                showMessage(
                    message
                );

            }
        );


    } catch (error) {

        console.error(
            "Load Messages Error:",
            error
        );


        alert(
            "Server se messages load nahi ho paaye"
        );

    }

}


// ============================================================
// 24. DELETE MESSAGE FROM MONGODB
// ============================================================

async function deleteMessage(
    messageId
) {


    let token =
        getToken();


    if (!token) {

        alert(
            "Login token nahi mila"
        );

        return;

    }


    if (!messageId) {

        alert(
            "Message ID nahi mili"
        );

        return;

    }


    try {


        let response =
            await fetch(
                `${BACKEND_URL}/api/messages/${messageId}`,
                {

                    method: "DELETE",

                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }

                }
            );


        let result =
            await response.json();


        console.log(
            "Delete Result:",
            result
        );


        if (!response.ok) {

            alert(
                result.error ||
                result.message ||
                "Message delete nahi hua"
            );

            return;

        }


        // Chat reload
        await loadMessages();


        console.log(
            "🗑️ Message Deleted"
        );


    } catch (error) {

        console.error(
            "Delete Message Error:",
            error
        );


        alert(
            "Message delete karte waqt error aaya"
        );

    }

}*/
