document.getElementById("file-input").addEventListener("change", function(e) {
    const file = e.target.files[0]; // Get the uploaded file
    if (file) {
        const reader = new FileReader(); // Create a FileReader to read the image
        reader.onload = function(event) {
            const img = new Image(); // Create a new image element
            img.onload = function() {
                const canvas = document.getElementById("canvas");
                const context = canvas.getContext("2d");
                
                // Set the canvas size to the image size
                canvas.width = img.width;
                canvas.height = img.height;

                // Draw the image onto the canvas
                context.drawImage(img, 0, 0);
                
                // Get the image data from the canvas
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                
                // Use jsQR to scan for QR code
                const code = jsQR(imageData.data, canvas.width, canvas.height);
                
                if (code) {
                    document.getElementById("result").innerText = `Scanned QR Code: ${code.data}`;
                } else {
                    document.getElementById("result").innerText = "No QR code found.";
                }
            };
            img.src = event.target.result; // Set the image source to the uploaded file
        };
        reader.readAsDataURL(file); // Read the file as a data URL
    }
});
