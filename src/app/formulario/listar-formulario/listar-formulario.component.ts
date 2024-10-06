import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../user.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Usuario } from '../../models/user.model';
import { MatSort } from '@angular/material/sort'; 
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'; 
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-listar-formulario',
  standalone: true,
  templateUrl: './listar-formulario.component.html',
  styleUrls: ['./listar-formulario.component.css'],
  imports: [MatTableModule, MatPaginatorModule, MatInputModule],
})
export class ListarFormularioComponent implements OnInit {
  displayedColumns: string[] = ['id', 'sexo', 'fechaNacimiento', 'nombre', 'apellido', 'email', 'direccion', 'casaApartamento', 'pais', 'departamento', 'ciudad', 'comentario', 'acciones'];
  dataSource = new MatTableDataSource<Usuario>([]);

  @ViewChild(MatSort) sort: MatSort; 
  @ViewChild(MatPaginator) paginator: MatPaginator; 

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.userService.getUsers().subscribe(
      data => {
        const usersFromApi = data.users || [];
        const localUsers = JSON.parse(localStorage.getItem('users') || '[]');

        this.dataSource.data = [
          ...usersFromApi.map((user: any, index: number) => ({
            id: index + 1,
            sexo: user.sex,
            fechaNacimiento: user.date_birthday,
            nombre: user.name,
            apellido: user.last_name,
            email: user.email,
            direccion: user.addres,
            casaApartamento:user.casaApartamento,
            pais: user.country,
            departamento: user.Deparment,
            ciudad: user.City,
            comentario: user.comment,
          })),
          ...localUsers.map((user: any, index: number) => ({
            ...user,
            id: usersFromApi.length + index + 1,
          }))
        ];
        this.dataSource.sort = this.sort; 
        this.dataSource.paginator = this.paginator; 
      },
      error => {
        console.error('Error al cargar usuarios:', error);
        alert('Ocurrió un error al cargar los usuarios. Por favor, intenta nuevamente.');
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editUser(user: Usuario) {
    this.router.navigate(['/'], { state: { user } });
    console.log('Usuario editado:', user);
  }
}
