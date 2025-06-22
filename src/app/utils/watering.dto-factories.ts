import { FormGroup } from '@angular/forms';
import { CreateWateringDto } from '@models';


export function createWateringDtoFromForm(form: FormGroup): CreateWateringDto {
  return {
    wateredAt: form.get('wateredAt')?.value,
    notes: form.get('notes')?.value,
    recordedBy: form.get('recordedBy')?.value,
    zoneId: form.get('zoneId')?.value,
    

  };
}

// export function updateSiteDtoFromForm(form: FormGroup, id: number): UpdateSiteDto {
//   return {
//     id,
//     name: form.get('name')?.value,
//     location: form.get('location')?.value
//   };
// }