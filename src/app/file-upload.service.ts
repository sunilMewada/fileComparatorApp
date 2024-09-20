import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private apiUrl = 'http://localhost:3000/post/compare';

  constructor(private http: HttpClient) {}

  compareFiles(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }
}
