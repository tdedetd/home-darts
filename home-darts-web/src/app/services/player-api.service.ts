import { Injectable } from '@angular/core';
import { apiPrefix } from '@config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlayerApi } from '@models/player-api.interface';
import { PlayerStatsApi } from '@models/player-stats-api.interface';

@Injectable({ providedIn: 'root' })
export class PlayerApiService {
  private readonly playersApiUrl = `${apiPrefix}players/`;

  constructor(private http: HttpClient) {}

  public getPlayers(): Observable<PlayerApi[]> {
    return this.http.get<PlayerApi[]>(this.playersApiUrl);
  }

  public getPlayerStats(playerId: number): Observable<PlayerStatsApi> {
    return this.http.get<PlayerStatsApi>(`${this.playersApiUrl}${playerId}/stats`);
  }
}
