import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploadService } from './file-upload.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  fileForm: FormGroup;
  errorMessage: string | null = null;
  responseMessage: string | null = null;

  constructor(private fb: FormBuilder, private fileUploadService: FileUploadService) {
    this.fileForm = this.fb.group({
      file1: [null, [Validators.required]],
      file2: [null, [Validators.required]]
    });
  }

  onFileChange(event: any, fileType: string) {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ['text/plain', 'application/json', 'application/xml'];
      if (!validTypes.includes(file.type)) {
        this.fileForm.get(fileType)?.setErrors({ invalidFileType: true });
        this.errorMessage = 'Invalid file type. Please upload a .txt, .json, or .xml file.';
        return;
      } else {
        this.errorMessage = null; // Clear previous error messages
      }

    if (file) {
      // Check if the file is empty
      if (file.size === 0) {
        this.fileForm.get(fileType)?.setErrors({ empty: true });
      } else {
        this.fileForm.get(fileType)?.setValue(file);
      }
    }
  }
  }

  onSubmit() {
    if (this.fileForm.valid) {
      const formData = new FormData();
      formData.append('file1', this.fileForm.get('file1')?.value);
      formData.append('file2', this.fileForm.get('file2')?.value);

      this.fileUploadService.compareFiles(formData).subscribe({
        next: (response) => {
          this.responseMessage = JSON.stringify(response);
          this.errorMessage = null;
        },
        error: (err) => {
          this.errorMessage = err.error.message || 'Error during file comparison.';
          this.responseMessage = null;
        }
      });
    } else {
      this.errorMessage = 'Please select both files.';
    }
  }
}
