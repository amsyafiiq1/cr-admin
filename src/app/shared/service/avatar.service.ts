import { inject, Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class AvatarService {
  dataService = inject(DataService);
  supabase = this.dataService.supabase;

  uploadAvatar(file: File, userId: string) {
    return this.supabase.storage
      .from('user_profile_picture')
      .upload(`${userId}/profile_${userId}`, file, {
        upsert: true,
      });
  }

  getAvatar(userId: string) {
    return this.supabase.storage
      .from('user_profile_picture')
      .getPublicUrl(`${userId}/profile_${userId}`).data.publicUrl;
  }
}
