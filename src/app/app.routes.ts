import { Routes } from '@angular/router';
import { FormularioComponent } from './formulario/formulario.component';
import { ListarFormularioComponent } from './formulario/listar-formulario/listar-formulario.component';

export const routes: Routes = [
    {
        path: "",
        component: FormularioComponent
    },
    {
        path: "listar-formulario",
        component: ListarFormularioComponent
    },

];
