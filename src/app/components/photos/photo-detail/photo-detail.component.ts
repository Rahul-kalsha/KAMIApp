import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PhotosService } from '../../../services/photos.service';
import { Photo } from '../../../interfaces/photo.interface';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { ImageUtilsService } from '../../../shared/services/image-utils.service';

@Component({
  selector: 'app-photo-detail',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './photo-detail.component.html',
  styleUrls: ['./photo-detail.component.scss']
})
export class PhotoDetailComponent implements OnInit {
  photo: Photo | null = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private photosService: PhotosService,
    private location: Location,
    public imageUtils: ImageUtilsService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.loadPhoto(id);
    });
  }

  loadPhoto(id: number) {
    this.loading = true;
    this.photosService.getPhoto(id).subscribe({
      next: (data) => {
        this.photo = data;
        this.photo.loading = true;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading photo:', error);
        this.loading = false;
      }
    });
  }

  goBack() {
    this.location.back();
  }
}
