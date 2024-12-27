import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';
import { Photo } from '../interfaces/photo.interface';

@Injectable({
  providedIn: 'root'
})
export class PhotosService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/photos`;

  getPhotos(params?: any): Observable<HttpResponse<Photo[]>> {
    let httpParams = new HttpParams();
  
    if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.set(key, params[key]);
      });
    }
  
    return this.http.get<Photo[]>(this.baseUrl, { 
      params: httpParams,
      observe: 'response'  
    });
  }

  getPhoto(id: number): Observable<Photo> {
    return this.http.get<Photo>(`${this.baseUrl}/${id}`);
  }
}