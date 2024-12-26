import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';
import { Album } from '../interfaces/album.interface';

@Injectable({
  providedIn: 'root'
})
export class AlbumsService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/albums`;

  getAlbums(params?: any): Observable<Album[]> {
    let httpParams = new HttpParams();
  
    if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.set(key, params[key]);
      });
    }
    return this.http.get<Album[]>(this.baseUrl, { 
      params: httpParams
    });
  }

  getAlbum(id: number): Observable<Album> {
    return this.http.get<Album>(`${this.baseUrl}/${id}`);
  }
}