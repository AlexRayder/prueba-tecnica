import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-formulario',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatDatepickerModule,
    CommonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'],
})
export class FormularioComponent {
  email: string = '';
  selectedPais: string | null = null; 
  selectedDepartamento: string | null = null; 
  isColombiaSelected: boolean = false;
  fechaNacimiento: Date | null = null; 
  nombre: string = '';
  casaApartamento:string = '';
  apellido: string = '';
  direccion: string = '';
  selectedSexo: string | null = null; 
  selectedCiudad: string | null = null; 
  comentario: string = '';
  userId: number | null = null; 

  sexos: { value: string; label: string }[] = [
    { value: 'Mujer', label: 'Mujer' },
    { value: 'Hombre', label: 'Hombre' },
    { value: 'No quiero decirlo', label: 'No quiero decirlo' },
  ];

  paises: { value: string; label: string }[] = [
    { value: 'Colombia', label: 'Colombia' },
    { value: 'Mexico', label: 'México' },
    { value: 'Argentina', label: 'Argentina' },
  ];

  ciudadesPorPais: { [key: string]: { value: string; label: string }[] } = {
    Colombia: [
      { value: 'Bogota', label: 'Bogota' },
      { value: 'Neiva', label: 'Neiva' },
      { value: 'Medellin', label: 'Medellin' },
    ],
    Mexico: [
      { value: 'Mexico City', label: 'Mexico City' },
      { value: 'Guadalajara', label: 'Guadalajara' },
      { value: 'Monterrey', label: 'Monterrey' },
    ],
    Argentina: [
      { value: 'Buenos Aires', label: 'Buenos Aires' },
      { value: 'Córdoba', label: 'Córdoba' },
      { value: 'Mendoza', label: 'Mendoza' },
    ],
  };

  ciudades: { value: string; label: string }[] = [];

  departamentos: { value: string; label: string }[] = [
    { value: 'Cundinamarca', label: 'Cundinamarca' },
    { value: 'Huila', label: 'Huila' },
    { value: 'Antioquia', label: 'Antioquia' },
  ];

  constructor(
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const user = navigation.extras.state['user'];
      if (user) {
        this.populateForm(user);
        this.userId = user.id;
      }
    }
  }

  onPaisChange(pais: string | null) { 
    this.selectedPais = pais; 
    this.isColombiaSelected = pais === 'Colombia';
    this.ciudades = pais ? this.ciudadesPorPais[pais] || [] : [];
    
    if (!this.isColombiaSelected) {
      this.selectedDepartamento = null; 
    }
  }

  onDepartamentoChange(departamento: string) {
    this.selectedDepartamento = departamento; 
  }

  validarEdad(): boolean {
    if (this.fechaNacimiento) {
      const hoy = new Date();
      const edad = hoy.getFullYear() - this.fechaNacimiento.getFullYear();
      const diferenciaMes = hoy.getMonth() - this.fechaNacimiento.getMonth();
      const diferenciaDia = hoy.getDate() - this.fechaNacimiento.getDate();
      return !(
        edad < 18 ||
        (edad === 18 && (diferenciaMes < 0 || (diferenciaMes === 0 && diferenciaDia < 0)))
      );
    }
    return false;
  }

  validarFormulario(): boolean {
    if (!this.nombre || !this.apellido || !this.email || !this.selectedSexo || !this.fechaNacimiento || !this.selectedPais || !this.selectedCiudad) {
      return false; 
    }
    return true; 
  }

  AdjuntarFormulario() {
    if (!this.validarEdad()) {
      alert('No puedes registrarte porque eres menor de 18 años');
      return; 
    }

    if (!this.validarFormulario()) {
      alert('Por favor, completa todos los campos obligatorios.');
      return; 
    }

    let formattedDate: string | null = null;
    if (this.fechaNacimiento) {
      const year = this.fechaNacimiento.getFullYear();
      const month = (this.fechaNacimiento.getMonth() + 1)
        .toString()
        .padStart(2, '0');
      const day = this.fechaNacimiento.getDate().toString().padStart(2, '0');
      formattedDate = `${year}-${month}-${day}`;
    }

    const userData = {
      id: this.userId,
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,
      direccion: this.direccion,
      casaApartamento:this.casaApartamento,
      sexo: this.selectedSexo,
      fechaNacimiento: formattedDate,
      pais: this.selectedPais,
      departamento: this.selectedDepartamento,
      ciudad: this.selectedCiudad,
      comentario: this.comentario,
    };

    if (this.userId) {
      this.userService.updateUser(userData);
      alert('Usuario actualizado correctamente');
    } else {
      this.userService.addUser(userData);
      alert('Formulario enviado correctamente');
    }
    
    this.router.navigate(['/listar-formulario']);
  }

  populateForm(user: any) {
    this.nombre = user.nombre;
    this.apellido = user.apellido;
    this.email = user.email;
    this.direccion = user.direccion;
    this.casaApartamento = user.casaApartamento
    this.selectedSexo = user.sexo;
    this.fechaNacimiento = new Date(user.fechaNacimiento);
    this.selectedPais = user.pais || null; 
    this.selectedDepartamento = user.departamento || null;
    this.selectedCiudad = user.ciudad || null; 
    this.comentario = user.comentario;

    this.onPaisChange(this.selectedPais); 
  }
}
