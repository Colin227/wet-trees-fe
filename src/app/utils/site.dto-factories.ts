import { FormGroup } from '@angular/forms';
import { CreateSiteDto, UpdateSiteDto } from '@models';

export function createSiteDtoFromForm(form: FormGroup): CreateSiteDto {
  return {
    name: form.get('name')?.value,
    location: form.get('location')?.value
  };
}

// export function updateSiteDtoFromForm(form: FormGroup, id: number): UpdateSiteDto {
//   return {
//     id,
//     name: form.get('name')?.value,
//     location: form.get('location')?.value
//   };
// }