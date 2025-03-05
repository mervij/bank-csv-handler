class FileHandler {
  constructor() {
    this.fileInput = document.querySelector('input[type="file"]');
  }

  initFileInput() {
    if (this.fileInput) {
      console.log('File input found');
    } else {
      console.error('File input not found');
    }
  }

  handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log(e.target.result);
      };
      reader.readAsText(file);
    } else {
      console.error('No file selected');
    }
  }

  init() {
    console.log('FileHandler initialized');
    initFileInput();
    if (document.querySelector(input[type="file"])) {
      console.log('FileHandler initialized');

    }
  }
}

export default new FileHandler();