import { FormGroup } from '@angular/forms';
import {CreateZoneDto } from '@models';

export function createZoneDtoFromForm(form: FormGroup): CreateZoneDto {
  return {
    name: form.get('name')?.value,
    location: form.get('location')?.value,
    siteId: form.get('siteId')?.value,
  };
}

// export function updateSiteDtoFromForm(form: FormGroup, id: number): UpdateSiteDto {
//   return {
//     id,
//     name: form.get('name')?.value,
//     location: form.get('location')?.value
//   };
// }