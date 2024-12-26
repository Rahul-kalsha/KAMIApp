import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class AlbumsService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/albums`;

  getAlbums(params?: any): Observable<any> {
    return this.http.get(this.baseUrl, { params });
  }

  getAlbum(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }
}