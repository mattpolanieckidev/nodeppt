document.addEventListener("DOMContentLoaded", function () {
  const fileInput = document.getElementById("fileInput");
  const uploadButton = document.getElementById("uploadButton");
  const fileNameElement = document.getElementById("fileName");
  const fileSizeElement = document.getElementById("fileSize");
  const processingResultElement = document.getElementById("processingResult");

  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      fileNameElement.textContent = file.name;
      fileSizeElement.textContent = file.size + " bytes";
    } else {
      fileNameElement.textContent = "";
      fileSizeElement.textContent = "";
    }
  });

  uploadButton.addEventListener("click", async () => {
    const file = fileInput.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("pptxFile", file);

      try {
        const response = await fetch("/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const result = await response.text();
          processingResultElement.textContent = result;
        } else {
          processingResultElement.textContent = "Error processing the PPTX file.";
        }
      } catch (error) {
        console.error(error);
        processingResultElement.textContent = "An error occurred.";
      }
    } else {
      processingResultElement.textContent = "No file selected.";
    }
  });
});
