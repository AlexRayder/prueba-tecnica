export interface Usuario {
  id: number; 
  nombre: string;
  apellido: string;
  email: string;
  direccion: string;
  casaApartamento:string;
  sexo?: string;
  fechaNacimiento?: string | null; 
  pais?: string; 
  departamento?: string; 
  ciudad?: string; 
  comentario?: string; 
}
