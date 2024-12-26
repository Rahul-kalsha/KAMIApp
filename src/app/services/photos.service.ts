import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class PhotosService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/photos`;

  getPhotos(params?: any): Observable<any> {
    return this.http.get(this.baseUrl, { params });
  }

  getPhoto(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }
}