import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://cincoveinticinco.com/users.json';

  constructor(private http: HttpClient) {}

  // Obtener usuarios desde la API
  getUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Agregar usuario a localStorage
  addUser(user: any): void {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    user.id = users.length ? users[users.length - 1].id + 1 : 1; // Incrementa el ID
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
  }

  // Actualizar usuario en localStorage
  updateUser(updatedUser: any): void {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const index = users.findIndex((user: any) => user.email === updatedUser.email); // Suponiendo que el email es único
    if (index !== -1) {
      users[index] = updatedUser; // Actualiza el usuario
      localStorage.setItem('users', JSON.stringify(users)); // Guarda los cambios
    }
  }
}
