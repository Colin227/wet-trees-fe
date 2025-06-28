import { FormGroup } from '@angular/forms';
import { CreateDeviceDto, UpdateDeviceDto } from '@models';

export function createDeviceDtoFromForm(form: FormGroup): CreateDeviceDto {
  return {
    deviceId: form.get('deviceId')?.value,
    zoneId: form.get('zone')?.value
  };
}

export function updateDeviceDtoFromForm(form: FormGroup): UpdateDeviceDto {
  return {
    deviceId: form.get('deviceId')?.value,
    zoneId: form.get('zone')?.value
  };
}
