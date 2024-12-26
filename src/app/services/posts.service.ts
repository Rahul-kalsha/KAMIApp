import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/posts`;

  getPosts(params?: any): Observable<any> {
    return this.http.get(this.baseUrl, { params });
  }

  getPost(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }
}