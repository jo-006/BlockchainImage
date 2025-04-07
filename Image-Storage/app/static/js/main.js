document.addEventListener("DOMContentLoaded", function () {
    // Highlight active navigation link
    const currentLocation = window.location.href;
    const navLinks = document.querySelectorAll(".nav-links a");

    navLinks.forEach(link => {
        if (link.href === currentLocation) {
            link.classList.add("active");
        }
    });

    // File upload preview
    const fileInput = document.getElementById("fileUpld");
    const fileLabel = document.querySelector("label[for='fileUpld']");

    if (fileInput) {
        fileInput.addEventListener("change", function () {
            if (fileInput.files.length > 0) {
                fileLabel.textContent = `Selected File: ${fileInput.files[0].name}`;
            }
        });
    }

    // Flash message auto-dismiss
    const messages = document.querySelector(".messages");
    if (messages) {
        setTimeout(() => {
            messages.style.display = "none";
        }, 3000);
    }

    // Handle mining request
    const mineButton = document.querySelector(".nav-links a[href*='/mine']");
    if (mineButton) {
        mineButton.addEventListener("click", function (e) {
            e.preventDefault();

            // Show loading indicator
            showDialog("Mining in progress...", "Please wait", false);
            const spinner = document.createElement("div");
            spinner.className = "spinner";
            document.querySelector(".dialog-message").appendChild(spinner);

            // Make AJAX request to mine endpoint
            fetch("/mine_ajax")
                .then(response => response.json())
                .then(data => {
                    // Close the loading dialog
                    closeDialog();

                    // Show result dialog
                    showDialog(data.message, "OK", true);

                    // If mining was successful, refresh the files section
                    if (data.success) {
                        const okButton = document.querySelector(".dialog-button");
                        okButton.addEventListener("click", function() {
                            refreshUploadedFiles();
                        });
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    closeDialog();
                    showDialog("An error occurred while mining", "OK", true);
                });
        });
    }
});

// Function to show dialog
function showDialog(message, buttonText, showButton) {
    // Remove existing dialog if any
    closeDialog();

    // Create dialog elements
    const overlay = document.createElement("div");
    overlay.className = "dialog-overlay";

    const dialogBox = document.createElement("div");
    dialogBox.className = "dialog-box";

    const dialogMessage = document.createElement("div");
    dialogMessage.className = "dialog-message";
    dialogMessage.textContent = message;

    dialogBox.appendChild(dialogMessage);

    if (showButton) {
        const button = document.createElement("button");
        button.className = "dialog-button";
        button.textContent = buttonText;
        button.addEventListener("click", closeDialog);
        dialogBox.appendChild(button);
    }

    overlay.appendChild(dialogBox);
    document.body.appendChild(overlay);
}

// Function to close dialog
function closeDialog() {
    const existingDialog = document.querySelector(".dialog-overlay");
    if (existingDialog) {
        existingDialog.remove();
    }
}

// Function to refresh the uploaded files section
function refreshUploadedFiles() {
    fetch("/get_uploaded_files")
        .then(response => response.json())
        .then(data => {
            const filesSection = document.querySelector(".files-section");
            const heading = filesSection.querySelector("h2");

            // Clear existing file cards
            const existingCards = filesSection.querySelectorAll(".file-card");
            existingCards.forEach(card => card.remove());

            // Add new file cards
            data.files.forEach(post => {
                const fileCard = document.createElement("div");
                fileCard.className = "file-card";

                const fileInfo = document.createElement("div");
                fileInfo.className = "file-info";

                const fileAvatar = document.createElement("div");
                fileAvatar.className = "file-avatar";
                fileAvatar.textContent = post.user[0];

                const fileName = document.createElement("div");
                fileName.className = "file-name";
                fileName.textContent = post.user;

                fileInfo.appendChild(fileAvatar);
                fileInfo.appendChild(fileName);

                const fileActions = document.createElement("div");
                fileActions.className = "file-actions";

                const fileText = document.createElement("p");
                fileText.innerHTML = `${post.v_file} → <a href="/submit/${post.v_file}" class="download-link">Download</a>`;

                fileActions.appendChild(fileText);

                fileCard.appendChild(fileInfo);
                fileCard.appendChild(fileActions);

                filesSection.appendChild(fileCard);
            });

            closeDialog();
        })
        .catch(error => {
            console.error("Error:", error);
            closeDialog();
            showDialog("An error occurred while refreshing files", "OK", true);
        });
}