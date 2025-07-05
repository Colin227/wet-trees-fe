import { FormGroup } from '@angular/forms';
import { CreateTreeDto, UpdateTreeDto } from '@models';

export function createTreeDtoFromForm(form: FormGroup): CreateTreeDto {
  return {
    species: form.get('species')?.value,
    plantedAt: form.get('plantedAt')?.value,
    status: form.get('status')?.value,
    zoneId: form.get('zoneId')?.value,
  };
}

// export function updateTreeDtoFromForm(form: FormGroup, id: number) {
//   return {
//     species: form.get('species')?.value,
//     plantedAt: form.get('plantedAt')?.value,
//     status: form.get('status')?.value,
//     siteId: form.get('siteId')?.value,
//   };
// }
